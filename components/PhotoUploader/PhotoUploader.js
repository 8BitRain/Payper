// Dependencies
import React from 'react';
import {   AppRegistry, Dimensions, Platform,  StyleSheet, Text,TouchableHighlight, View, Animated, Image, NativeModules, ListView, DeviceEventEmitter } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../styles/colors';
import * as Headers from '../../helpers/Headers';

// Modules
import CameraRollPicker from 'react-native-camera-roll-picker';
import Camera from 'react-native-camera';
import CameraRoll from 'rn-camera-roll';
var ReadImageData = require('NativeModules').ReadImageData;
import { RNS3 } from 'react-native-aws3';


// Components
import UserPic from '../Previews/UserPic/UserPic';
import StickyView from '../../classes/StickyView';
import ContinueButton from './subcomponents/ContinueButton';

// Partial components
import Header from '../../components/Header/Header';

// Enviroment
import * as config from '../../config';

//Custom
const dimensions = Dimensions.get('window');
let PHOTOS_COUNT_BY_FETCH = 24;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraContainer:{
    flex: dimensions.height * .66,
    height: dimensions.height * .66
  },
  preview: {
    flex: dimensions.height * .66,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: dimensions.height * .66,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: dimensions.height,
    backgroundColor: '#fff',
    borderRadius: 0,
    color: '#000',
    padding: 10
  },
  imageGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },
  generalText: {
    fontSize: 14,
    color: colors.white
  },
  generalTextBold: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "bold"
  }

});

class PhotoUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      title: this.props.title,
      index: 1,
      image: this.props.image,
      selectedImage: null,
      mode: "photo",
      num: 0,
      selected: []
    };

  }

  componentDidMount() {
    Animated.spring(this.state.opacity, {
      toValue: 1.0,
      velocity: 4.0,
    }).start();

    // upload progress
    /*DeviceEventEmitter.addListener('RNUploaderProgress', (data)=>{
      let bytesWritten = data.totalBytesWritten;
      let bytesTotal   = data.totalBytesExpectedToWrite;
      let progress     = data.progress;

      console.log( "upload progress: " + progress + "%");
    });*/
  }

  componentWillUnmount() {
    Animated.spring(this.state.opacity, {
      toValue: 0.0,
      velocity: 4.0
    }).start();
  }

  getSelectedImages(images, current) {
   var num = images.length;

   this.setState({
     num: num,
     selected: images,
   });

   console.log(current);
   console.log("Image" + this.state.selected[0]);
   if(this.state.selected[0]){
     this.readImage(this.state.selected[0].uri);
     //this.setState({ selectedImage: this.state.selected[0].uri });
   }
 }

 readImage(uri){
   ReadImageData.readImage(this.state.selected[0].uri, (imageBase64) => {
     console.log("Base 64 Image: " + imageBase64);
     this.setState({ selectedImage: imageBase64 });
   });
 }

 takePicture() {
   this.camera.capture()
     .then((data) => {
       console.log(data);
       this.setState({ selectedImage: data.path, index: 2 });
     }
     ).catch(err => console.error("Error: " + err));

     //Set state to show user the picture they took. Allow the user to go back or continue
 }

  _renderLibraryView(){
    console.log("Current Mode" + this.state.mode);
    console.log("selectedImage " + this.state.selectedImage);

    return(
      <View style={{flex: 1}}>
          {(this.state.selectedImage ? <Image source={{uri: this.state.selectedImage}} style={{height: dimensions.height * .66, width: dimensions.width}} /> : null)}
          <CameraRollPicker
           scrollRenderAheadDistance={500}
           initialListSize={1}
           pageSize={3}
           removeClippedSubviews={true}
           groupTypes='SavedPhotos'
           batchSize={5}
           maximum={1}
           selected={this.state.selected}
           assetType='Photos'
           imagesPerRow={3}
           imageMargin={5}
           backgroundColor={colors.richBlack}
           callback={this.getSelectedImages.bind(this)}
          />
      </View>
    );
  }

  _renderPhotoView(){
    console.log("Current Mode" + this.state.mode);
    switch (this.state.index){
      //Renders the camera
      case 1:
        return(
          <View style={styles.cameraContainer}>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}>
          </Camera>
          <View style={styles.capture}>
            <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
          </View>
          </View>

        );
        break;
      //Renders the image user took and prompts confirmation.
      case 2:
        return(
          <View style={styles.container}>
          <Image source={{uri: this.state.selectedImage}} style={{height: dimensions.height * .66, width: dimensions.width}} />
          </View>
        );
        break;
    }
  }

  _renderDocumentUploadExplanation(){
    <View style={styles.container}>
      <Text style={styles.generalText}> We need additional documents to verify your identity. Please upload either a picture of your <Text style={styles.generalTextBold}>photo id</Text> or <Text style={styles.generalTextBold}>passport photo</Text></Text>
    </View>
  }

  _renderFooter(){
    switch(this.state.index){
      case 0:
      case 1:
      return(
        <View style={{flex: (dimensions.height < 667) ? 0.12 : 0.1, flexDirection: 'row', backgroundColor: "white"}}>
        <TouchableHighlight
          style={{justifyContent: "center", alignItems: "center" }}
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => this.setState({mode: "library", selectedImage: null})}>
            <Text style={{fontSize: 32}}>Library</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={{justifyContent: "center", alignItems: "center"}}
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => this.setState({mode: "photo", selectedImage: null})}>
            <Text style={{fontSize: 32}} >Photo</Text>
        </TouchableHighlight>

        </View>
      );
      case 2:
      return(
        <StickyView>
          <ContinueButton text={"Upload Photo"} onPress={() => {
            this.uploadPhotoS3(this.state.selectedImage);
            this.setState({index: 3});
          ;}}/>
        </StickyView>
      );
    }

  }

  uploadPhotoS3(uri){
    // I need to retrieve this users email.

    let file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: uri,
      name: "PersonalID.png",
      type: "image/png"
    }

    let options = {
      bucket: "payper-verifydocs-dev",
      region: "us-east-1",
      accessKey: "AKIAJAPGM72WRCJVO33A",
      secretKey: "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",
      successActionStatus: 201
    }

    RNS3.put(file, options).then(response => {
      if (response.status !== 201){
          console.log(response.body);
          throw new Error("Failed to upload image to S3");
      }


      /**
       * {
       *   postResponse: {
       *     bucket: "your-bucket",
       *     etag : "9f620878e06d28774406017480a59fd4",
       *     key: "uploads/image.png",
       *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
       *   }
       * }
       */
    });
  }

  render() {
    return(
      <View style={{flex: 1, backgroundColor: colors.richBlack}}>
      <View style={{flex: (dimensions.height < 667) ? 0.12 : 0.1}}>
        <Header
          //callback
          callbackClose={() => this.props.toggleModal()}
          callbackBack={() => this.setState({index: this.state.index - 1})}
          headerProps={Headers.get({ header: "photoUpload", title: this.state.title, index: this.state.index })} />
      </View>
      <View style={{flex: .8}}>
        {(this.state.mode == "photo") ? this._renderPhotoView()  : this._renderLibraryView()}
      </View>
      {this._renderFooter()}
      </View>

    );
  }
};

export default PhotoUploader;
