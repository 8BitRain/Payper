// Dependencies
import React from 'react';
import {   AppRegistry, Dimensions, StyleSheet, Text,TouchableHighlight, View, Animated, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../styles/colors';
import * as Headers from '../../helpers/Headers';

// Additional Components
import CameraRollPicker from 'react-native-camera-roll-picker';
import Camera from 'react-native-camera';

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
 }

 takePicture() {
   this.camera.capture()
     .then((data) => console.log(data))
     .catch(err => console.error(err));
 }

  _renderImageAndCameraRoll(){
    return(
      <View style={{flex: 1}}>
        <View style={{marginTop: 100}}>
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
         style={{backgroundColor: colors.richBlack}}
         callback={this.getSelectedImages.bind(this)}
        />
        </View>
      </View>
    );
  }

  _renderDocumentUploadExplanation(){

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
      <View>
        <Header
          //callback
          callbackClose={() => this.props.toggleDocumentUploadModal()}
          headerProps={Headers.get({ header: "photoUpload", title: this.state.title, index: this.state.index })} />
      </View>
      <View>
        {(this.state.mode == "photo") ? this._renderCamera() : this._renderImageAndCameraRoll()}
      </View>
      </View>

    );
  }
};

export default PhotoUploader;
