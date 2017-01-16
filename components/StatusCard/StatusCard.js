import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableHighlight, Animated, Easing, Dimensions, Modal, Image, StyleSheet } from 'react-native'
import { colors } from '../../globalStyles'
import { IAVWebView, KYCOnboardingView, PhotoUploader, MicrodepositOnboarding } from '../index'
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

    this.config = {
      'need-bank': {
        title: "Bank Account Needed",
        message: "You won't be able to send money until you add a bank account.",
        action: "Add Bank Account",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent
        })
      },
      'need-kyc': {
        title: "Account Verification Needed",
        message: "You won't be able to receive money until you verify your account.",
        action: "Verify Account",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <KYCOnboardingView currentUser={this.props.currentUser} />,
          backgroundColor: colors.snowWhite,
          showHeader: true,
          title: "Account Verification"
        })
      },
      'kyc-retry': {
        title: "Account Verification Failed",
        message: "Try verifying your account again with slightly more detailed information.",
        action: "Verify Account",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <KYCOnboardingView retry currentUser={this.props.currentUser} />,
          backgroundColor: colors.snowWhite,
          showHeader: true,
          title: "Account Verification"
        })
      },
      'kyc-documentNeeded': {
        title: "Additional Documents Required",
        message: "We need a bit more info to verify your account. Please take a snapshot of a valid photo ID.",
        action: "Take Snapshot",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <PhotoUploader title={"Document Upload"} index={1} brand={"document"}  {...this.props}/>,
          backgroundColor: colors.snowWhite,
          showHeader: false,
          title: "Document Upload"
        })
      },
      'kyc-documentProcessing': {
        title: "Verifying Your Account",
        message: "We're processing your information and will notify you when verification is complete."
      },
      'kyc-documentReceived': {
        title: "Verifying Your Account",
        message: "We're processing your information and will notify you when verification is complete."
      },
      'kyc-suspended': {
        title: "Verifying Your Account",
        message: "We're processing your information and will notify you when verification is complete."
      },
      'microdeposits-initialized': {
        title: "Microdeposits Initialized",
        message: "We're transferring two small (< 20¢) sums to your bank account. We will notify you when they've arrived."
      },
      'microdeposits-deposited': {
        title: "Microdeposits Arrived",
        message: "We've deposited two small (< 20¢) sums to your bank account and are awaiting your verification.",
        action: "Verify Microdeposits",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <MicrodepositOnboarding {...this.props} toggleModal={() => Actions.pop()} />,
          backgroundColor: colors.snowWhite,
          showHeader: true,
          title: "Microdeposit Verification"
        })
      },
      'microdeposits-failed': {
        title: "Microdeposits Failed to Transfer",
        message: "Please try adding your bank account again. Be sure to double check your routing and account number.",
        action: "Add Bank Account",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent
        })
      }
    }

    this.state = {
      onboardingPercentage: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      onboardingPercentage: this.getOnboardingPercentage(nextProps.currentUser.appFlags)
    })
  }

  getOnboardingPercentage(appFlags) {
    let customer_status = appFlags.customer_status;
    let onboardingPercentage = 0;

    switch (appFlags.onboardingProgress) {
      case "kyc-success":
        onboardingPercentage = 100;
        break;
      case "need-bank":
        if(customer_status== "verified"){
          onboardingPercentage = 75;
        }
        if(customer_status == "kyc-retry" || customer_status == "kyc-document" || customer_status == "kyc-suspended"){
          onboardingPercentage = 60;
        }
        if(customer_status == "kyc-documentRecieved"){
          onboardingPercentage = 65;
        }
        if(customer_status == "kyc-documentProcessing"){
          onboardingPercentage = 75;
        }
        if(customer_status == "unverified"){
          onboardingPercentage = 50;
        }
        break;
      case "microdeposits-initialized":
        if(customer_status == "verified"){
          onboardingPercentage = 80;
        }
        if(customer_status == "kyc-retry" || customer_status == "kyc-document" || customer_status == "kyc-documentFailed" || customer_status == "kyc-suspended"){
          onboardingPercentage = 65;
        }
        if(customer_status == "kyc-documentRecieved"){
          onboardingPercentage = 70;
        }
        if(customer_status == "kyc-documentProcessing"){
          onboardingPercentage = 75;
        }
        if(customer_status == "unverified"){
          onboardingPercentage = 55;
        }
        break;
      case "microdeposits-failed":
        if(customer_status == "verified"){
          onboardingPercentage = 75;
        }
        if(customer_status == "kyc-retry" || customer_status == "kyc-document" || customer_status == "kyc-documentFailed" || customer_status == "kyc-suspended"){
          onboardingPercentage = 65;
        }
        if(customer_status == "kyc-documentRecieved"){
          onboardingPercentage = 70;
        }
        if(customer_status == "kyc-documentProcessing"){
          onboardingPercentage = 75;
        }
        if(customer_status == "unverified"){
          onboardingPercentage = 50;
        }
        break;
      case "need-kyc":
        onboardingPercentage = 70;
        break;
      case "kyc-retry" || "kyc-suspended" || "kyc-documentNeeded" :
        onboardingPercentage = 75;
        break;
      case "kyc-documentRecieved":
        onboardingPercentage = 80;
        break;
      case "kyc-documentProcessing":
        onboardingPercentage = 85;
        break;
      case "kyc-documentFailed":
        onboardingPercentage = 75;
        break;
      default:
    }

    return onboardingPercentage
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

  _renderSendMoneyLock(currentUser){
    //Render Send Money and Lock as unlocked
    if(currentUser.fundingSource &&
      currentUser.appFlags.onboardingProgress != "microdeposits-initialized" &&
      currentUser.appFlags.onboardingProgress != "microdeposits-deposited" &&
      currentUser.appFlags.onboardingProgress != "microdeposits-failed"){
        return(
          <View style={{flex: 1, alignItems: "center"}}>
            <Ionicons size={24} name="md-unlock" color={colors.snowWhite} />
            <Text style={styles.unlockedText}>{"Send Money"}</Text>
          </View>
        )
      } else {
    //Render Send Money and Lock as locked
        return(
          <View style={{flex: 1, alignItems: "center"}}>
            <Ionicons size={24} name="md-lock" color={colors.medGrey} />
            <Text style={styles.lockText}>{"Send Money"}</Text>
          </View>
        )
      }
  }

  _renderRecieveMoneyLock(currentUser){
    //Recieve money unlocked
    if(currentUser.appFlags.onboardingProgress == "kyc-success"){
      return(
        <View style={{flex: 1, alignItems: "center"}}>
          <Ionicons size={24} name="md-unlock" color={colors.snowWhite} />
          <Text style={styles.unlockedText}>{"Receive Money"}</Text>
        </View>
      );
    //Recieve money locked
    } else {
      return(
        <View style={{flex: 1, alignItems: "center"}}>
          <Ionicons size={24} name="md-lock" color={colors.medGrey} />
          <Text style={styles.lockText}>{"Receive Money"}</Text>
        </View>
      );
    }
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

  render() {
    let onboardingProgress = this.props.currentUser.appFlags['onboardingProgress']
    let message = (this.config[onboardingProgress]) ? this.config[onboardingProgress].message : "'" + onboardingProgress + "' is not a valid value for the 'onboardingProgress' appFlag"
    let destination = (this.config[onboardingProgress]) ? this.config[onboardingProgress].destination : null

    // Return an empty view for cases where no StatusCard should be rendered
    if (!this.config[onboardingProgress]) {
      return(
        <View />
      )
    } else {
      return(
        <View style={styles.wrapper}>
          {/* //TODO Close Modal Floating Points Move this to outside of wrapper*/}
          {/* Header */}
          <View style={{flex: 1, flexShrink: 0, justifyContent: "flex-start", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden", marginTop: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, backgroundColor: colors.darkAccent}}>
            {/* Profile Picture & Onboarding Progress Text*/}
            <View style={{flex: 1, alignItems: "center", backgroundColor: colors.darkAccent}}>
              {this._renderPicWithInitials(this.props.currentUser.first_name, this.props.currentUser.last_name)}
              <Text style={styles.text}>{"My Profile Strength"}</Text>
            </View>
            {/* Unlocked Features*/}
            <View style={{flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.darkAccent}}>
              {this._renderSendMoneyLock(this.props.currentUser)}
              {/* Progress Percentage */}
              <View style={{flex: 1, alignItems: "center"}}>
                {/* <Text style={styles.header}>{"80%"}</Text> */}
                <AnimatedCircularProgress
                  size={64}
                  width={4}
                  fill={this.state.onboardingPercentage}
                  tintColor={colors.snowWhite}
                  backgroundColor={colors.medGrey}>
                  {
                    (fill) => (
                      <Text style={styles.percantageText}>
                        {this.state.onboardingPercentage + "%"}
                      </Text>
                    )
                  }
                </AnimatedCircularProgress>
              </View>
              {this._renderRecieveMoneyLock(this.props.currentUser)}
            </View>


          </View>
          {/* Body */}
          <View style={{flex: .5, justifyContent: "center", alignItems: "center", marginTop: 5}}>
            <Text style={styles.header}>{this.config[onboardingProgress].title}</Text>
            <Text style={styles.text}>{this.config[onboardingProgress].message}</Text>
          </View>

          { /* Footer */
            (!this.config[onboardingProgress].action)
              ? null
              : <View style={{flex: .5, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden"}}>
                  <TouchableHighlight
                    activeOpacity={0.8}
                    underlayColor={'transparent'}
                    onPress={() => {this.handlePress(destination)}}
                    style={{height: 50, width: dimensions.width * .84, backgroundColor: colors.lightAccent, justifyContent: "center"}}>
                    <Text style={styles.buttonText}>{this.config[onboardingProgress].action}</Text>
                  </TouchableHighlight>
                </View> }
      </View>
      )
    }
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
    borderRadius: dimensions.width / 32.0,
    height: 320
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
    color: colors.snowWhite,
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
