import React from 'react'
import {Dimensions, StyleSheet, TouchableHighlight, View, Image} from 'react-native'
import {ContinueButton, Header} from '../../components'
import {colors} from '../../globalStyles'
import CameraRollPicker from 'react-native-camera-roll-picker'
import Camera from 'react-native-camera'
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const ReadImageData = require('NativeModules').ReadImageData
const dims = Dimensions.get('window')
const PHOTOS_COUNT_BY_FETCH = 24

class CameraModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedImage: null,
      mode: "camera",
      num: 0,
      selected: [],
      cameraOrientation: Camera.constants.Type.front
    }

    this.capture = this.capture.bind(this)
    this.toggleMode = this.toggleMode.bind(this)
  }

  getSelectedImages(images, current) {
    this.setState({
      selected: images,
      selectedImage: (images.length > 0) ? images[0].uri : ""
    })
  }

  readImage(uri){
    ReadImageData.readImage(this.state.selected[0].uri, (imageBase64) => {
      console.log("imageBase64", imageBase64)
      this.setState({selectedImage: imageBase64})
    })
  }

  capture() {
    this.camera.capture()
    .then((data) => this.setState({
      mode: "cameraRoll",
      selectedImage: data.path
    }, () => console.log("--> this.state", this.state)))
    .catch((err) => console.error("Error taking picture:", err))
  }

  flipCamera() {
    this.setState({
      cameraOrientation: (this.state.cameraOrientation === Camera.constants.Type.front) ? Camera.constants.Type.back : Camera.constants.Type.front
    })
  }

  renderPhotoTaken(){
    return(
      <View style={{flex: 1.0}}>
        <Image source={{uri: this.state.selectedImage}} style={{height: dims.height * .80, width: dims.width}} />
      </View>
    )
  }

  toggleMode() {
    this.setState({
      mode: (this.state.mode === "camera" || this.state.mode === "review") ? "cameraRoll" : "camera",
      selectedImage: null
    })
  }

  renderCamera() {
    return(
      <View>
        <Camera
          ref={(cam) => {this.camera = cam}}
          aspect={Camera.constants.Aspect.fill}
          type={this.state.cameraOrientation}
          style={{
            flex: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: dims.height * 0.85,
            width: dims.width
          }}>
        </Camera>

        { /* Orientation flipper */ }
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          style={{position: "absolute", top: 20, right: 20}}
          onPress={() => this.flipCamera()}>
          <Ionicons style={{opacity: 0.6}} size={38} name={"md-reverse-camera"} color={colors.snowWhite} />
        </TouchableHighlight>

        { /* Capture button */ }
        <View style={{position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center'}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={this.capture}>
            <View style={{width: 48, height: 48, borderRadius: 24, backgroundColor: colors.snowWhite, borderWidth: 3, borderColor: colors.medGrey}} />
          </TouchableHighlight>
        </View>

        { /* Camera roll button */ }
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          style={{position: "absolute", bottom: 20, left: 20}}
          onPress={this.toggleMode}>
          <Ionicons size={38} name={"ios-images"} color={colors.snowWhite} />
        </TouchableHighlight>
      </View>
    )
  }

  renderCameraRoll() {
    return(
      <View style={{flex: 1}}>
        {(this.state.selectedImage)
          ? <Image source={{uri: this.state.selectedImage}} style={{height: dims.height * .45, width: dims.width}} />
          : null }

        <CameraRollPicker
           scrollRenderAheadDistance={500}
           initialListSize={1}
           pageSize={3}
           removeClippedSubviews={true}
           groupTypes='SavedPhotos'
           batchSize={5}
           maximum={1}
           selected={this.state.selected}
           selectedMarker={<EvilIcons style={{backgroundColor: "transparent", alignSelf: "center", justifyContent: "center", paddingTop: 35}} size={48} name={"check"} color={colors.accent} />}
           assetType='Photos'
           imagesPerRow={3}
           imageMargin={5}
           emptyText={"Loading Photos..."}
           backgroundColor={colors.lightGrey}
           callback={this.getSelectedImages.bind(this)} />

        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          style={{position: "absolute", bottom: 20, left: 20}}
          onPress={this.toggleMode}>
          <Ionicons size={38} name={"ios-camera"} color={colors.accent} />
        </TouchableHighlight>
      </View>
    )
  }

  renderReview() {
    return(
      <View style={{flex: 1}}>
        {(this.state.selectedImage)
          ? <Image source={{uri: this.state.selectedImage}} style={{height: dims.height * .45, width: dims.width}} />
          : null }

        <CameraRollPicker
           scrollRenderAheadDistance={500}
           initialListSize={1}
           pageSize={3}
           removeClippedSubviews={true}
           groupTypes='SavedPhotos'
           batchSize={5}
           maximum={1}
           selected={this.state.selected}
           selectedMarker={<EvilIcons style={{backgroundColor: "transparent", alignSelf: "center", justifyContent: "center", paddingTop: 35}} size={48} name={"check"} color={colors.accent} />}
           assetType='Photos'
           imagesPerRow={3}
           imageMargin={5}
           emptyText={"Loading Photos..."}
           backgroundColor={colors.lightGrey}
           callback={this.getSelectedImages.bind(this)} />

        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          style={{position: "absolute", bottom: 20, left: 20}}
          onPress={this.toggleMode}>
          <Ionicons size={38} name={"ios-camera"} color={colors.accent} />
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return(
      <View style={{flex: 1, backgroundColor: colors.snowWhite}}>

        { /* Header */
          (this.props.showHeader)
          ? <View style={{height: dims.height * 0.15}}>
              <Header {...this.props.headerProps} />
            </View>
          : null }

        { /* Camera and camera roll */ }
        <View style={{flex: 1, height: dims.height * 0.85}}>
          {this.renderCamera()}

          {(this.state.mode === "cameraRoll")
            ? <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                {this.renderCameraRoll()}
              </View>
            : null }

          { /* Submit button */
            (this.state.selectedImage)
            ? <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: dims.height * 0.15, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.snowWhite, borderColor: colors.medGrey, borderTopWidth: 1}}>
                <ContinueButton
                  customText={"Submit"}
                  onPress={() => this.props.onUpload(this.state.selectedImage)} />
              </View>
            : null }
        </View>

      </View>
    )
  }
}

module.exports = CameraModal
