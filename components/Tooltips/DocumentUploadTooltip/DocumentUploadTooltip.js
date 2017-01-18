// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'

//External Libraries
import Swiper from 'react-native-swiper';

// Stylesheets
import {colors} from '../../../globalStyles';

// Partial components
import Header from '../../../components/Header/Header';
import * as Headers from '../../../helpers/Headers';
import {device} from '../../../helpers';

//Custom
const dimensions = Dimensions.get('window');


class DocumentUploadTooltip extends React.Component {
  constructor(props) {
    super(props);
    //this.height = new Animated.Value(0);

    //this.deviceType = getDeviceType(dimensions.width);

    this.state = {
      index: 0,
      closeModal: false,
      openTooltip: false
    }

    this.fade_dimmed_background_value = new Animated.Value(0);

  }

  componentDidMount() {
    this.fade_dimmed_background();

    console.log("DocumentUploadTooltip DeviceType: " +  device);
  }

  fade_dimmed_background() {
    //this.fade_dimmed_background_value.setValue(0);
    Animated.timing(
      this.fade_dimmed_background_value,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.ease
      }
    ).start()
  }

  toggleTooltip(toggle){
    this.setState({openTooltip: toggle });
  }
  _renderDot(){
    return(
      <View style={{backgroundColor:'rgba(0,0,0,.2)', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />
    );

  }

  _renderActiveDot(){
    return(
      <View style={{backgroundColor: colors.accent, width: 12, height: 12, borderRadius: 10, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />
    );
  }

  _renderTooltip(){
    return(
      <View style={styles.wrapper2}>
          <Text style={styles.headerL}>{"Why do we need this information?"}</Text>
          <Text style={styles.textL}>{"Payper needs to validate this information in order to protect your identity in compliance with Federal Law. We care about your security!"}</Text>
          <View style={{flex: 1, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden"}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {this.toggleTooltip(false)}}
            style={{height: 50, width: dimensions.width * .84, backgroundColor: colors.lightCarminePink, justifyContent: "center"}}>
                <View style={{flexDirection: "row", justifyContent: "center", width: dimensions.width * .84}}>
                  <Text style={styles.buttonText}>{"Okay"}</Text>
                </View>
          </TouchableHighlight>
          </View>
      </View>
    );
  }

  render() {
    const dimOpacity = this.fade_dimmed_background_value.interpolate({
      inputRange: [0.0, 1.0],
      outputRange: [0.0, 0.9]
    })
    return(
      <View style={{flex: 1}}>
        <Animated.View style={{flex: 1,
            position: "absolute",
            backgroundColor: colors.richBlack,
            opacity: dimOpacity,
            height: dimensions.height,
            width: dimensions.width}}>
        </Animated.View>
        <View style={styles.wrapper}>

          <Text style={styles.headerL}>{"We require additional I.D to verify your identity"}</Text>

          <View style={styles.content}>
            <Text style={styles.header2}>{"Valid I.D Includes ..."}</Text>
            <View style={{flexDirection: "row", justifyContent: "center", margin: 0}}>
                <View style={{flexDirection: "column", alignSelf: "flex-start", alignItems: "center"}}>
                  <Image source={require('../../../assets/images/document_upload_id.png')} style={{width: 75, height: 50, marginTop: 55, marginBottom: 5, padding: 0}} />
                  <Text style={styles.text} >{"Driver's License"}</Text>
                </View>
                <View style={{flexDirection: "column", alignSelf: "center", margin: 15, marginTop: 25, marginLeft: 8.5, marginRight: 6.5}}>
                  <Text style={styles.text3}>{"or"}</Text>
                </View>
                <View style={{flexDirection: "column", alignSelf: "flex-end", alignItems: "center"}}>
                    <Image source={require('../../../assets/images/document_upload_passport.png')} style={{width: 50, height: 75, marginTop: 25, marginBottom: 5, padding: 0}} />
                    <Text style={styles.text} >{"Passport Photo"}</Text>
                </View>
            </View>
          </View>

          <View style={{flex: 1, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden"}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {this.props.toggleModal(false)}}
            style={{height: 50, width: dimensions.width * .84, backgroundColor: colors.lightAccent, justifyContent: "center"}}>
                <View style={{flexDirection: "row", justifyContent: "center", width: dimensions.width * .84}}>
                  <Text style={styles.buttonText}>{"Take A Photo"}</Text>
                  <Ionicons style={styles.buttonIcon} size={42} name="ios-camera" color={colors.snowWhite} />
                </View>
          </TouchableHighlight>
          </View>
        </View>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.openTooltip}
          >
            { this._renderTooltip()}
          </Modal>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            style={styles.helpTooltip}
            onPress={() => {this.toggleTooltip(true)}}>
                <Ionicons style={{}} size={32} name="ios-help-circle" color={colors.snowWhite} />
          </TouchableHighlight>
    </View>
    );
  }
}

var styles = StyleSheet.create({
  dimBackground: {
    flex: 1,
    position: "absolute",
    backgroundColor: colors.richBlack,
    opacity: .9,
    height: dimensions.height,
    width: dimensions.width
  },
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.accent,
    margin: dimensions.width * .08,
    marginTop: dimensions.height * .10,
    marginBottom: dimensions.height * .10,
    borderRadius: dimensions.width / 32.0,
  },
  wrapper2: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.carminePink,
    margin: dimensions.width * .12,
    marginTop: dimensions.height * .25,
    marginBottom: dimensions.height * .25,
    borderRadius: dimensions.width / 32.0,
  },
  helpTooltip: {
    position: "absolute",
    margin: 0,
    top: dimensions.height * .12,
    left: dimensions.width * .82,
    right: 0
  },
  content: {
    flex: 1,
    marginTop: device == "SE" ? dimensions.height * .15 : device == "6" ? 10  : 10 ,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText:{
    color: '#fff',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center",
    overflow: "hidden"
  },
  buttonIcon:{
    alignSelf: "flex-end",
    overflow: "hidden",
    marginLeft: 20
  },
  text: {
    color: '#fff',
    fontSize: device == "SE" ? 14 : device == "6" ? 18 : 20,
    lineHeight: device == "SE" ? 14 * 1.20 : device == "6" ? 18 * 1.20 : 20 * 1.20,
    textAlign: "center",
    fontWeight: "500"
  },
  textL: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 16 * 1.20,
    textAlign: "left",
    fontWeight: "500",
    padding: 15
  },
  text3: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 16 * 1.20,
    textAlign: "center",
    fontWeight: "500",
    padding: 0
  },
  header: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 18 * 1.20
  },
  header2: {
    color: "#fff",
    fontSize: device == "SE" ? 17 : device == "6" ? 21 : 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: device == "SE" ? 0: device == "6" ? 0 : 0,
    lineHeight: device == "SE" ? 16 * 1.20 : device == "6" ? 20 * 1.20 : 22 * 1.20,
  },

  headerL: {
    color: "#fff",
    fontSize: device == "SE" ? 18 : device == "6" ? 22 : 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginRight: device == "SE" ? 40 : device == "6" ? 40 : 40,
    marginLeft: 10,
    marginTop: 15,
    padding: 0,
    lineHeight: device == "SE" ? 18 * 1.20 : device == "6" ? 22 * 1.40 : 24 * 1.20,
  },

  footer: {
    fontSize: 14,
    lineHeight: 14 * 1.20,
    textAlign: "center",
    fontWeight: "300"
  }
})

module.exports = DocumentUploadTooltip
