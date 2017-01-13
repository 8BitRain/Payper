import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableHighlight, Animated, Easing, Dimensions, Modal, Image, StyleSheet } from 'react-native'
import { colors } from '../../globalStyles'
import { IAVWebView, KYCOnboardingView } from '../index'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

//External Libraries
import { AnimatedCircularProgress } from 'react-native-circular-progress';
//Custom
const dimensions = Dimensions.get('window');
let imageDims = { width: 56, height: 56 }

class StatusCard extends React.Component {
  constructor(props) {
    super(props)


    this.customer_status = this.props.currentUser.customer_status;
    this.onboardingPercentage = 0;
    switch (this.props.onboardingProgress) {
      case "kyc-success":
        this.onboardingPercentage = 100;
        break;
      case "need-bank":
        if(this.customer_status== "verified"){
          this.onboardingPercentage = 75;
        }
        if(this.customer_status == "kyc-retry" || this.customer_status == "kyc-document" || this.customer_status == "kyc-suspended"){
          this.onboardingPercentage = 60;
        }
        if(this.customer_status == "kyc-documentRecieved"){
          this.onboardingPercentage = 65;
        }
        if(this.customer_status == "kyc-documentProcessing"){
          this.onboardingPercentage = 75;
        }
        if(this.customer_status == "unverified"){
          this.onboardingPercentage = 50;
        }
        break;
      case "microdeposits-initialized":
        if(this.customer_status == "verified"){
          this.onboardingPercentage = 80;
        }
        if(this.customer_status == "kyc-retry" || this.customer_status == "kyc-document" || this.customer_status == "kyc-documentFailed" || this.customer_status == "kyc-suspended"){
          this.onboardingPercentage = 65;
        }
        if(this.customer_status == "kyc-documentRecieved"){
          this.onboardingPercentage = 70;
        }
        if(this.customer_status == "kyc-documentProcessing"){
          this.onboardingPercentage = 75;
        }
        if(this.customer_status == "unverified"){
          this.onboardingPercentage = 55;
        }
        break;
      case "microdeposits-failed":
        if(this.customer_status == "verified"){
          this.onboardingPercentage = 75;
        }
        if(this.customer_status == "kyc-retry" || this.customer_status == "kyc-document" || this.customer_status == "kyc-documentFailed" || this.customer_status == "kyc-suspended"){
          this.onboardingPercentage = 65;
        }
        if(this.customer_status == "kyc-documentRecieved"){
          this.onboardingPercentage = 70;
        }
        if(this.customer_status == "kyc-documentProcessing"){
          this.onboardingPercentage = 75;
        }
        if(this.customer_status == "unverified"){
          this.onboardingPercentage = 50;
        }
        break;
      case "need-kyc":
        if(this.customer_status == "kyc-documentRecieved"){
          this.onboardingPercentage = 80;
        }
        break;
      case "kyc-retry" || "kyc-suspended" || "kyc-documentNeeded" :
        this.onboardingPercentage = 75;
        break;
      case "kyc-documentRecieved":
        this.onboardingPercentage = 80;
        break;
      case "kyc-documentProcessing":
        this.onboardingPercentage = 85;
        break;
      case "kyc-documentFailed":
        this.onboardingPercentage = 75;
        break;
      default:

    }

    this.config = {
      'need-bank': {
        message: "You still need to add a bank account!",
        title: "Bank Account Needed",
        action: "Add Bank",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent
        })
      },
      'need-kyc': {
        message: "need-kyc",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <KYCOnboardingView currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent,
          showHeader: true,
          title: "Bank Account Verification"
        })
      },
      'kyc-retry': {
        message: "kyc-retry"
      },
      'kyc-documentNeeded': {
        message: "kyc-documentNeeded"
      },
      'kyc-documentProcessing': {
        message: "kyc-documentProcessing"
      },
      'kyc-documentReceived': {
        message: "kyc-documentReceived"
      },
      'kyc-suspended': {
        message: "kyc-suspended"
      },
      'microdeposits-initialized': {
        message: "microdeposits-initialized"
      },
      'microdeposits-deposited': {
        message: "microdeposits-deposited"
      },
      'microdeposits-failed':{
        message: "microdeposits-failed"
      }
    }
    //let onboardingProgress = props.currentUser.appFlags['onboardingProgress']
    //let onboardingProgress = 'need-bank'

  }


  handlePress(destination) {
      let onboardingProgress = this.props.currentUser.appFlags['onboardingProgress']

      let pressable = (this.config[onboardingProgress])
        ? this.config[onboardingProgress].pressable
        : false

      if (!pressable) return

      if (typeof destination === 'function')
        destination()
    }


  _renderPicWithInitials(firstname, lastname){
    let initials = firstname.charAt(0) + lastname.charAt(0);

    return(
      <View style={styles.imageWrap}>
          { /*Profile pic with initials*/ }
          <View style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
              {initials}
            </Text>
          </View>
      </View>
    )
  }

  _renderUnlocks(onboardingProgress){
    //TODO add rendering logic for locks & associated text based on onboaridngProgress
  }

  render() {
    let onboardingProgress = this.props.currentUser.appFlags['onboardingProgress']
    //let onboardingProgress = 'need-bank'
    let message = (this.config[onboardingProgress]) ? this.config[onboardingProgress].message : "'" + onboardingProgress + "' is not a valid value for the 'onboardingProgress' appFlag"
    let destination = (this.config[onboardingProgress]) ? this.config[onboardingProgress].destination : null

    return(
      <View style={styles.wrapper}>
        {/* //TODO Close Modal Floating Points Move this to outside of wrapper*/}
        {/* Header */}
        <View style={{flex: 1, justifyContent: "flex-start", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden", marginTop: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, backgroundColor: colors.darkAccent}}>
          {/* Profile Picture & Onboarding Progress Text*/}
          <View style={{flex: 1, alignItems: "center"}}>
            {this._renderPicWithInitials(this.props.currentUser.first_name, this.props.currentUser.last_name)}
            <Text style={styles.text}>{"My Profile Strength"}</Text>
          </View>
          {/* Unlocked Features*/}
          <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
            <View style={{flex: 1, alignItems: "center"}}>
              <Ionicons size={24} name="md-lock" color={colors.medGrey} />
              <Text style={styles.lockText}>{"Send Money"}</Text>
            </View>
            {/* Progress Percentage */}
            <View style={{flex: 1, alignItems: "center"}}>
              {/* <Text style={styles.header}>{"80%"}</Text> */}
              <AnimatedCircularProgress
                size={64}
                width={4}
                fill={this.onboardingPercentage}
                tintColor={colors.snowWhite}
                backgroundColor={colors.medGrey}>
                {
                  (fill) => (
                    <Text style={styles.percantageText}>
                      {this.onboardingPercentage + "%"}
                    </Text>
                  )
                }
              </AnimatedCircularProgress>
            </View>
            <View style={{flex: 1, alignItems: "center"}}>
              <Ionicons size={24} name="md-lock" color={colors.medGrey} />
              <Text style={styles.lockText}>{"Receive Money"}</Text>
            </View>
          </View>


        </View>
        {/* Body */}
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Text style={styles.header}>{this.config[onboardingProgress].title}</Text>
          <Text style={styles.text}>{this.config[onboardingProgress].message}</Text>
        </View>
        {/*Footer*/}
        <View style={{flex: .5, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden"}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {this.handlePress(destination)}}
            style={{height: 50, width: dimensions.width * .84, backgroundColor: colors.lightAccent, justifyContent: "center"}}>
                <Text style={styles.buttonText}>{this.config[onboardingProgress].action}</Text>
          </TouchableHighlight>
        </View>
    </View>
    )
  }
}
//Ideal margins are *.25 for Top & Bottom
var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.accent,
    margin: dimensions.width * .08,
    marginTop: dimensions.height * .15,
    marginBottom: dimensions.height * .15,
    borderRadius: dimensions.width / 32.0,
  },
  imageWrap: {
    width: imageDims.width,
    height: imageDims.height,
    borderRadius: imageDims.width / 2,
    backgroundColor: colors.snowWhite,
    shadowColor: colors.slateGrey,
    marginTop: 5,
    shadowOpacity: 0.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  percantageText: {
    position: "absolute",
    bottom: 24,
    left: 20,
    fontSize: 14,
    color: colors.snowWhite,
    fontWeight: "bold"
  },
  buttonText:{
    color: '#fff',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center"
  },
  text: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 16 * 1.20,
    textAlign: "center",
    fontWeight: "500"
  },
  lockText: {
    color: colors.medGrey,
    fontSize: 16,
    lineHeight: 16 * 1.20,
    textAlign: "center",
    fontWeight: "500"
  },
  unlockedText:{
    color: '#fff',
    fontSize: 16,
    lineHeight: 16 * 1.20,
    textAlign: "center",
    fontWeight: "500"
  },
  text2: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 16 * 1.20,
    textAlign: "center",
    fontWeight: "500",
    marginTop: 15
  },
  header: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 18 * 1.20
  },
  header2:{
    color: "#fff",
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 14 * 1.20
  },
  footer: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 14 * 1.20,
    textAlign: "center",
    fontWeight: "300"
  }
});

module.exports = StatusCard
