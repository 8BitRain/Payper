// Dependencies
import React from 'react';
import { AppRegistry, Dimensions, Platform,  StyleSheet, Text,TouchableHighlight, View, Animated, Image, NativeModules, ListView, DeviceEventEmitter, Modal } from 'react-native';
import {Actions} from 'react-native-router-flux'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {colors} from '../../globalStyles';
import * as Headers from '../../helpers/Headers';

// Modules
import CameraRollPicker from 'react-native-camera-roll-picker';
import Camera from 'react-native-camera';
var ReadImageData = require('NativeModules').ReadImageData;
import { RNS3 } from 'react-native-aws3';
import ImageResizer from 'react-native-image-resizer';


// Components
import UserPic from '../Previews/UserPic/UserPic';
import StickyView from '../../classes/StickyView';
import ContinueButton from './subcomponents/ContinueButton';
import DocumentUploadTooltip from '../Tooltips/DocumentUploadTooltip/DocumentUploadTooltip'


// Partial components
import Header from '../../components/Header/Header';
import * as Alert from '../../helpers/Alert';

// Enviroment
import * as config from '../../config';

// classes
import User from '../../classes/User';
import * as Lambda from '../../services/Lambda';

//Custom
const dimensions = Dimensions.get('window');
let PHOTOS_COUNT_BY_FETCH = 24;



class PhotoUploader extends React.Component {
  constructor(props) {
    super(props);
    { /*PhotoUploader type can either be "photo" or "document"*/ }

    console.log("Title: " + this.props.title + " Type: " + this.props.brand + " Index: " + this.props.index);
    this.state = {
      opacity: new Animated.Value(0),
      title: this.props.title,
      brand: this.props.brand,
      index: 1,
      image: this.props.image,
      optimisticallyRenderedImage: null,
      photoUploaded: false,
      selectedImage: null,
      mode: "photo",
      num: 0,
      selected: [],
      progress: {
        loaded: null,
        total: null
      },
      openTooltip: this.props.brand == "document" ? true : false
    };
    console.log("BRAND" + this.state.brand);
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

  toggleModal(toggle){
    this.setState({openTooltip: toggle });
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
           emptyText={"Loading Photos..."}
           backgroundColor={colors.medGrey}
           callback={this.getSelectedImages.bind(this)}
          />
      </View>
    );
  }

  _renderPhotoView(){
    console.log("Current Mode" + this.state.mode);
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

  }

  _renderPhotoTaken(){
    return(
      <View style={styles.container}>
        <Image source={{uri: this.state.selectedImage}} style={{height: dimensions.height * .80, width: dimensions.width}} />
      </View>
    );
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
  _renderHeader(){
    return(
      <View style={{flex: .1, backgroundColor: colors.accent, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          { /*Close*/ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            style={{marginTop: 10}}
            onPress={() => {Actions.pop()}}>
                <EvilIcons  size={32} name="close" color={colors.snowWhite} />
          </TouchableHighlight>

          <Text style={{marginTop: 10, fontSize: 17, color: colors.lightGrey, marginRight: 50, marginLeft: 50}}>{this.props.title}</Text>
          { /*Document Upload Tooltip*/ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            style={{marginTop: 10}}
            onPress={() => {this.toggleModal(true)}}>
                <Ionicons style={{}} size={32} name="ios-help-circle" color={colors.snowWhite} />
          </TouchableHighlight>
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
              this.uploadPhotoS3(this.state.selectedImage, this.state.brand);
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



  _renderAlert(brand){
    if(brand == "document"){
      Alert.photoUpload({
        title: "Document Upload Status",
        message: "Your document successfully uploaded!",
        confirmMessage: "Ok",
        confirm: () => {
          this.setState({photoUploaded: false});
          if(this.props.brand == "photo"){
            this.props.toggleModal(false);
          }
          if(this.props.brand == "document"){
            //fulfilled via Actions.pop() refer to componentes/StatusCard/AlternateStatusCard.js
            this.props.toggleModal();
          }
        }
      });
    }

    if(brand == "photo"){
      Alert.photoUpload({
        title: "Photo Upload Progress",
        message: "Your photo was successfully uploaded",
        confirmMessage: "Ok",
        confirm: () => {
          this.setState({photoUploaded: false});
          this.props.toggleModal(false);
        }
      });
    }

  }

  uploadPhotoS3(uri, brand){
    //Compress the photo (Currently not being used)
    //compressPhoto(brand);

    //Optimistically Render a photo before upload (Change Profile Pic Only)
    if(brand == "photo"){
      try{
        this.props.setOptimisticallyRenderedImage(this.state.selectedImage);
      }catch(err){
        console.log("Error", err);
      }
    }

    //Decrypt Email
    var decryptedEmail = this.props.currentUser.decryptedEmail.replace(".", ">");

    //Configs for uploading photo
    let file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: uri,
      name: decryptedEmail + ".png",
      type: "image/png"
    }
    let options = {
      bucket: (this.state.brand == "document") ? "payper-verifydocs-" + config.details.env : "payper-profilepics-" + config.details.env,
      region: "us-east-1",
      accessKey: "AKIAJAPGM72WRCJVO33A",
      secretKey: "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",
      successActionStatus: 201
    }

    //Begin Photo upload to S3 bucket
    RNS3.put(file, options).then(response => {
      if (response.status !== 201){
          throw new Error("Failed to upload image to S3");
      }
      if(response.status == 201){
        var userPhoto = response.headers.Location;
        this._renderAlert(this.state.brand);
        if(this.state.brand == "photo"){
          //Update the user's profile picture
          Lambda.updateProfilePic({url: response.headers.Location , token: this.props.currentUser.token }, (response) => {
            console.log(response);
            this.currentUser
          });
        }
      }
    }).progress((e) => {
      console.log(e.loaded / e.total)
    });
  }

  compressPhoto(uri, brand){
    if(brand == "photo"){
      //params imageUri, newWidth, newHeight, compressFormat, quality, rotation, outputPath
      ImageResizer.createResizedImage(uri, 64, 64, "JPEG", 10, 0).then((resizedImageUri) => {
        // resizeImageUri is the URI of the new image that can now be displayed, uploaded...
        console.log("FIRED COMPRESSOR");
        console.log("RESIZED IMAGE URI:", resizedImageUri);
        return(resizedImageUri);
      }).catch((err) => {
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
        console.log("COMPRESSION ERROR:", err);
      });
    }
  }

  render() {
    return(
      <View style={{flex: 1, backgroundColor: colors.snowWhite}}>
      {/* Header*/}
      { this.state.brand == "document" ? this._renderHeader() : null}

      { /*Main Content*/ }
      <View style={{flex: .8}}>
        {(this.state.index == 1 && this.state.brand == "photo" || this.state.brand == "document") ? (this.state.mode == "photo") ? this._renderPhotoView() : this._renderLibraryView() : null}
        {(this.state.index == 2) ? this._renderPhotoTaken() : null}
      </View>

      {/* Footer */}
      {this._renderFooter()}

      {/* Tooltip */}
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.openTooltip}>
          <DocumentUploadTooltip toggleModal={(value) => this.toggleModal(value)}/>
        </Modal>
      </View>
    );
  }
};

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


module.exports = PhotoUploader;
