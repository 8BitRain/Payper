// Dependencies
import React from 'react';
import {   AppRegistry, Dimensions, StyleSheet, Text,TouchableHighlight, View, Animated, Image, NativeModules } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../styles/colors';
import * as Headers from '../../helpers/Headers';

// Additional Components
import CameraRollPicker from 'react-native-camera-roll-picker';
import Camera from 'react-native-camera';
var ReadImageData = require('NativeModules').ReadImageData

// Components
import UserPic from '../Previews/UserPic/UserPic';

// Partial components
import Header from '../../components/Header/Header';

//Custom
const dimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

class PhotoUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      title: this.props.title,
      index: this.props.index,
      image: this.props.image,
      selectedImage: null,
      mode: "library",
      num: 0,
      selected: []
    };
  }

  componentDidMount() {
    Animated.spring(this.state.opacity, {
      toValue: 1.0,
      velocity: 4.0,
    }).start();
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
   console.log(this.state.selected);
   /*if(this.state.selected[0]){
     //this.readImage(this.state.selected[0].uri);
     this.setState({ selectedImage: this.state.selected[0].uri });
   }*/
 }

 readImage(uri){
   ReadImageData.readImage(this.state.selected[0].uri, (imageBase64) => {
     console.log("Base 64 Image: " + imageBase64);
     this.setState({ selectedImage: imageBase64 });
   });
 }

 takePicture() {
   this.camera.capture()
     .then((data) => console.log(data))
     .catch(err => console.error(err));
 }

  _renderImageAndCameraRoll(){
    return(
      <View style={{flex: 1}}>
        <View style={{marginTop: 5}}>
          {(this.state.selectedImage) ? <Image source={{uri: this.state.selectedImage}} style={{height: 128, width: 128}} /> : null }
        </View>
        <View style={{marginTop: 0}}>
          <CameraRollPicker
           scrollRenderAheadDistance={500}
           initialListSize={1}
           pageSize={3}
           removeClippedSubviews={false}
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
      </View>
    );
  }

  _renderDocumentUploadExplanation(){

  }

  _renderFooter(){
    return(
      <View style={{flex: (dimensions.height < 667) ? 0.12 : 0.1, flexDirection: 'row', backgroundColor: "white"}}>
      <TouchableHighlight
        style={{justifyContent: "center", alignItems: "center" }}
        activeOpacity={0.8}
        underlayColor={'transparent'}
        onPress={() => this.setState({mode: "library"})}>
          <Text style={{fontSize: 32}}>Library</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{justifyContent: "center", alignItems: "center"}}
        activeOpacity={0.8}
        underlayColor={'transparent'}
        onPress={() => this.setState({mode: "photo"})}>
          <Text style={{fontSize: 32}} >Photo</Text>
      </TouchableHighlight>

      </View>
    );
  }

  _renderCamera(){
    return(
      <View style={styles.container}>
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}>
        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
      </Camera>
      </View>
    );
  }

  render() {
    return(
      <View style={{flex: 1, backgroundColor: colors.richBlack}}>
      <View style={{flex: (dimensions.height < 667) ? 0.12 : 0.1}}>
        <Header
          //callback
          callbackClose={() => this.props.toggleModal()}
          headerProps={Headers.get({ header: "photoUpload", title: this.state.title, index: this.state.index })} />
      </View>
      <View style={{flex: .8}}>
        {(this.state.mode == "photo") ? this._renderCamera() : this._renderImageAndCameraRoll()}
      </View>
      {this._renderFooter()}
      </View>

    );
  }
};

export default PhotoUploader;
