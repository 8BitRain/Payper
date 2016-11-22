// Dependencies
import React from 'react';
import {   AppRegistry, Dimensions, Platform,  StyleSheet, Text,TouchableHighlight, View, Animated, Image, NativeModules, ListView, DeviceEventEmitter } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../globalStyles';
import * as Headers from '../../helpers/Headers';

// Modules
import CameraRollPicker from 'react-native-camera-roll-picker';
import Camera from 'react-native-camera';
var ReadImageData = require('NativeModules').ReadImageData;
import { RNS3 } from 'react-native-aws3';


// Components
import UserPic from '../Previews/UserPic/UserPic';
import StickyView from '../../classes/StickyView';
import ContinueButton from './subcomponents/ContinueButton';
// Partial components
import Header from '../../components/Header/Header';
import * as Alert from '../../helpers/Alert';

// Enviroment
import * as config from '../../config';

// classes
import User from '../../classes/User';
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.medGrey,
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
    fontSize: 24,
    color: colors.deepBlue,
    margin: 15,
    marginLeft: dimensions.width * .05
  },
  generalTextBold: {
    fontSize: 24,
    color: colors.deepBlue,
    fontWeight: "bold",
    margin: 15,
    marginBottom: 0,
    marginLeft: dimensions.width * .15
  },
  headerWrap: {
    flexDirection: 'row',
    flex: 0.15,
    width: dimensions.width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20
  },
  wrap: {
    flex: 1.0,
    width: dimensions.width,
    backgroundColor: colors.snowWhite,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 20
  }

});

class PhotoUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      title: this.props.title,
      index: 0,
      image: this.props.image,
      photoUploaded: false,
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

   if(this.state.selected[0]){
     console.log("Image" + this.state.selected[0].uri);
     //this.readImage(this.state.selected[0].uri);
     this.setState({ selectedImage: this.state.selected[0].uri, index: 2});
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
          {(this.state.selectedImage ? <Image source={{uri: this.state.selectedImage}} style={{height: dimensions.height * .45, width: dimensions.width}} /> : null)}
          <CameraRollPicker
           scrollRenderAheadDistance={500}
           initialListSize={1}
           pageSize={3}
           removeClippedSubviews={true}
           groupTypes='SavedPhotos'
           batchSize={5}
           maximum={1}
           selected={this.state.selected}
           selectedMarker={<Ionicons style={{ backgroundColor: "transparent", alignSelf:"center", justifyContent:"center", paddingTop:35}} size={48} name="ios-eye" color={colors.accent} />}
           assetType='Photos'
           imagesPerRow={3}
           imageMargin={5}
           backgroundColor={colors.medGrey}
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
          {/*<View style={styles.capture}>
            <Ionicons onPress={this.takePicture.bind(this)} style={{}} size={48} name="ios-camera" color={"black"} />
          </View>*/}
          <View style={[styles.capture]}>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={this.takePicture.bind(this)}
              style={{width: dimensions.width}}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons style={{}} size={48} name="ios-camera" color={colors.accent} />
              </View>
            </TouchableHighlight>
          </View>
          </View>

        );
        break;
      //Renders the image user took and prompts confirmation.
      case 2:
        return(
          <View style={styles.container}>
            <Image source={{uri: this.state.selectedImage}} style={{height: dimensions.height, width: dimensions.width}} />
          </View>
        );
        break;
    }
  }

  _renderDocumentUploadExplanation(){
    return(
      <View style={styles.wrap}>
        <View style={{alignSelf: "center"}}>
          <Ionicons name={"md-lock"} color={colors.accent} size={64} />
        </View>
        {(this.props.currentUser.appFlags.customer_status == "document") ? <Text style={styles.generalText}>We need additional documents to verify your identity. Please upload a photo of a valid form of ID</Text> : <Text style={styles.generalText}>There was an issue with the original documents you sent to us. Please reupload a valid form of ID.</Text>}
        {(this.props.currentUser.appFlags.customer_status == "document") ? <Text style={styles.generalText}>Valid forms of id include... </Text> : <Text style={styles.generalText}>Common reasons we see document submissions fail...</Text>}
        {(this.props.currentUser.appFlags.customer_status == "document") ? <Text style={styles.generalTextBold}>{"Driver's License"}</Text> : <Text style={styles.generalTextBold}>{"Low Image Quality"}</Text>}
        {(this.props.currentUser.appFlags.customer_status == "document") ? <Text style={styles.generalTextBold}>{"Passport Photo ID"}</Text> : <Text style={styles.generalTextBold}>{"Invalid Driver's License"}</Text>}
        {(this.props.currentUser.appFlags.customer_status == "documentFailure") ? <Text style={styles.generalTextBold}>{"Invalid Passport Photo ID"}</Text> : null}
      </View>
    );
  }

  _renderFooter(){
    switch(this.state.index){
      case 0:
        return(
          <StickyView>
            <ContinueButton text={"Continue"} onPress={() => {
              this.setState({index: 1});
            ;}}/>
          </StickyView>
        );
        break;
      case 1:
        return(
          <View style={{flex: (dimensions.height < 667) ? 0.12 : 0.1, width: dimensions.width, flexDirection: 'row', justifyContent:"center", backgroundColor: colors.snowWhite}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.setState({mode: "library", selectedImage: null})}>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: dimensions.width * .5}}>
              <Text style={{fontSize: 18, color: colors.accent}}>Library</Text>
              <Ionicons style={{}} size={32} name="ios-images" color={colors.accent} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.setState({mode: "photo", selectedImage: null})}>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: dimensions.width * .5}}>
              <Text style={{fontSize: 18, color: colors.accent}} >Photo</Text>
              <Ionicons style={{}} size={32} name="ios-camera" color={colors.accent} />
            </View>
          </TouchableHighlight>

          </View>
        );
        break;
      case 2:
        return(
          <StickyView>
            <ContinueButton text={(this.state.photoUploaded) ? "Uploading..." : "Upload Photo"} onPress={() => {
              this.uploadPhotoS3(this.state.selectedImage);
              this.setState({photoUploaded: true});
            }}/>
          </StickyView>
        );
       break;
    }

  }

  _renderContinueButton(){
    return(
      <StickyView>
        <ContinueButton text={"Upload Photo"} onPress={() => {
          this.uploadPhotoS3(this.state.selectedImage);
          this.setState({index: 3});
        ;}}/>
      </StickyView>
    );
  }

  _renderUploadedPhoto(){
    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'transparent'}
        onPress={() => this.props.onPress()}>

        <View style={{ height: 60, backgroundColor: colors.accent, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons style={{}} size={48} name="ios-checkmark-outline" color={colors.accent} />
        </View>
      </TouchableHighlight>
    );
  }

  _renderAlert(){
    Alert.photoUpload({
      title: "Document Upload Status",
      message: "Your document successfully uploaded!",
      confirmMessage: "Ok",
      confirm: () => {
        this.setState({photoUploaded: false});
        this.props.toggleModal();
      }
    });
  }

  uploadPhotoS3(uri){
    // Decrypt user email
    /*User.decrypt((response) => {
      console.log("Decrypted User: " + response);
    });*/


    var decryptedEmail = this.props.currentUser.decryptedEmail.replace(".", ">");
    console.log(decryptedEmail);

    let file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: uri,
      name: decryptedEmail + ".png",
      type: "image/png"
    }

    let options = {
      bucket: "payper-verifydocs-" + config.details.env,
      region: "us-east-1",
      accessKey: "AKIAJAPGM72WRCJVO33A",
      secretKey: "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",
      successActionStatus: 201
    }
    RNS3.put(file, options).then(response => {
      if (response.status !== 201){
          console.log(response);
          throw new Error("Failed to upload image to S3");
      }
      this._renderAlert();
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
    }).progress((e) => console.log(e.loaded / e.total));;
  }

  render() {
    return(
      <View style={{flex: 1, backgroundColor: colors.snowWhite}}>


      <View style={{flex: .8}}>
        {(this.state.index == 0) && (this.state.title == "Secure Document Upload") ? this._renderDocumentUploadExplanation() : null}
        {(this.state.index == 0) && (this.state.title == "Secure Document Upload") ? null : (this.state.mode == "photo") ? this._renderPhotoView() : this._renderLibraryView()}
      </View>
      {this._renderFooter()}
      </View>

    );
  }
};

module.exports = PhotoUploader;
