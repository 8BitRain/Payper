// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ListView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {getFacebookUserData} from '../../helpers/auth'
import {setInAsyncStorage} from '../../helpers/asyncStorage'

//Routing
import {Actions} from 'react-native-router-flux';


// Stylesheets
import {colors} from '../../globalStyles';

//Custom
const dimensions = Dimensions.get('window');
import { device } from '../../helpers'


//Firebase
import { Firebase } from '../../helpers'

const FBSDK = require('react-native-fbsdk')
const {LoginButton} = FBSDK

var subscriptionList = [
  "ios-book-outline",
  "ios-school-outline",
  "md-heart",
  "md-restaurant",
  "ios-game-controller-b-outline",
  "ios-musical-notes"
]

class PromoRoulette extends React.Component {
  constructor(props) {
    super(props);

    this.AV = {
      loginButton: {opacity: new Animated.Value(0)}
    }

    this.state = {
      selectedSubscription: "",
      rouletteLoop: -1,
      rouletteFinished: true,
      showSubscription: false,
      wantedTags: null

    }

    this.animLogo_0 = new Animated.Value(0);
    this.animLogo_1 = new Animated.Value(0);
    this.animLogo_2 = new Animated.Value(0);
    this.animLogo_Selected = new Animated.Value(0);
  }

  componentDidMount() {
    //this.imageAnim(4, 0);
    console.log("Props: ", this.props);
    let wantedTagsDirty = this.props.wantedTags;
    let wantedTagsClean = [];
    for (var tag in wantedTagsDirty){
      if(wantedTagsDirty[tag]){
        //Remove the # & append a ,
        wantedTagsClean.push(tag)
      }
    }
    console.log("Wanted Tags: " + wantedTagsClean);
    this.setState({wantedTags: wantedTagsClean});

  }

  showLoginButton() {
    Animated.timing(this.AV.loginButton.opacity, {
      toValue: 1,
      duration: 250
    }).start()
  }

  onLoginFinished(err, res) {
    if (err) { onFailure(); return }
    if (res.isCancelled) return

    getFacebookUserData({
      onFailure,
      onSuccess: (facebookUserData) => {
        Actions.FacebookLogin({
          userData: facebookUserData,
          destination: (userData) => {
            setInAsyncStorage('userData', JSON.stringify(userData))
            Actions.PromoInvite({
              userData,
              subscription: this.state.selectedSubscription
            })
          }
        })
      }
    })

    function onFailure() {
      alert("Something went wrong on our end. Please try again later.")
    }
  }

  imageAnim(loop, pos){
    //Is this the first time the loop has ran?
    if(loop == 4){
      this.setState({rouletteFinished: false, showSubscription: false, rouletteLoop: 4});
    }
    if(pos == 0){
      console.log("Loop: " + loop);
      console.log("Anim0");
      this.animLogo_0.setValue(0);
      Animated.timing(
      this.animLogo_0,
      {
        toValue: 1,
        duration: this.getAnimSpeed(loop),
        easing: Easing.spring
      }
      ).start(() => {
        this.imageAnim(loop, 1);
      });
    }

    if(pos == 1){
      console.log("Anim1");
      this.animLogo_1.setValue(0);
      Animated.timing(
      this.animLogo_1,
      {
        toValue: 1,
        duration: this.getAnimSpeed(loop),
        easing: Easing.spring
      }
      ).start(() => {
        this.imageAnim(loop, 2);
      });
    }


    if(pos == 2 ){
      if(this.state.rouletteLoop == 0){
        console.log("Final Anim");
        //this.animLogo_Selected.setValue(0);
        Animated.timing(
        this.animLogo_Selected,
        {
          toValue: 1,
          duration: this.getAnimSpeed(loop),
          easing: Easing.spring
        }
      ).start(() => {
        if(loop == 0){
          console.log("Stop Anim");
          this.setState({rouletteFinished: true, showSubscription: true })
          this.showLoginButton()
        }});
      } else {
        this.animLogo_2.setValue(0);
        Animated.timing(
        this.animLogo_2,
        {
          toValue: 1,
          duration: this.getAnimSpeed(loop),
          easing: Easing.spring
        }
      ).start(() => {
        var next_loop = 0;
        if(loop != 0){
          next_loop = loop - 1;
          //Generate selectedSubscription
          let subscription;
          if(loop == 1){
            subscription = this.generateSubscription(subscriptionList);
          }
          this.imageAnim(next_loop, 0);
          this.setState({rouletteLoop: next_loop, selectedSubscription: subscription})
        }
        if(loop == 0){
          console.log("Stop Anim");
        }});
      }
    }
  }


  getAnimSpeed(loop){
    switch (loop) {
      case 0:
        return(1000);
        break;
      case 1:
        return(850)
        break;
      case 2:
        return(700);
        break;
      case 3:
        return (850);
        break;
      case 4:
        return (1000);
        break;
    }
  }

  generateSubscription(subscriptions){
    let randomIndex = Math.floor(Math.random() * subscriptions.length);
    let selectedSubscription = subscriptions[randomIndex];
    console.log("selectedSubscription: " + selectedSubscription);
    return selectedSubscription;
  }

  _renderReRollButton(){
    if(this.state.rouletteFinished){
      return(
        <View>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {
              this.setState({rouletteLoop: -2});
              this.imageAnim(4, 0);
            }}
            style={styles.buttonActive}>
                <Text style={styles.buttonActiveText}>{this.state.rouletteLoop == -1 ? "Roll" : "Re-Roll"}</Text>
          </TouchableHighlight>
        </View>
      );
    }
    if(!this.state.rouletteFinished){
      return(
        <View>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => console.log("nothing")}
            style={styles.buttonInactive}>
                <Text style={styles.buttonInactiveText}>{"Re-Roll"}</Text>
          </TouchableHighlight>
        </View>
      );
    }

  }


  _renderRouletteView(){

    console.log("RoulletteLoop: " + this.state.rouletteLoop);
    var fade_logo0 = this.animLogo_0.interpolate({inputRange: [0, 1],outputRange: [1.0, 0.0]});
    var fade_logo1 = this.animLogo_1.interpolate({inputRange: [0, 1],outputRange: [1.0, 0.0]});
    var fade_logo2 = this.animLogo_2.interpolate({inputRange: [0, 1],outputRange: [1.0, 0.0]});
    var translate_logo0 = this.animLogo_0.interpolate({inputRange: [0, 1],outputRange: [-40.0, 180.0]});
    var translate_logo1 = this.animLogo_1.interpolate({inputRange: [0, 1],outputRange: [-40.0, 180.0]});
    var translate_logo2 = this.animLogo_2.interpolate({inputRange: [0, 1],outputRange: [-40.0, 180.0]});
    var scale_logo0 = this.animLogo_0.interpolate({inputRange: [0, .5, 1],outputRange: [1, 1.5, 1]});
    var scale_logo1 = this.animLogo_1.interpolate({inputRange: [0, .5, 1],outputRange: [1, 1.5, 1]});
    var scale_logo2 = this.animLogo_2.interpolate({inputRange: [0, .5, 1],outputRange: [1, 1.5, 1]});
    var translate_logoFinal = this.animLogo_Selected.interpolate({inputRange: [0, 1],outputRange: [-40.0, 80.0]});
    var scale_logoFinal = this.animLogo_Selected.interpolate({inputRange: [0, .5, 1],outputRange: [1, 1.5, 1]});



    if(this.state.rouletteLoop == 0){
      //The final image should be here
      return(
        <View style={{ height: dimensions.height * .2,  backgroundColor: colors.carminePink, overflow: "hidden"}}>
          <Animated.View style={{position: "absolute", overflow: "visible", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logo0 }, {scaleY: scale_logo0 }, {translateY: translate_logo0}], opacity: 1}}><Ionicons name={"ios-book-outline"} size={64}/></Animated.View>
          <Animated.View style={{position: "absolute", overflow: "visible", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logo1 }, {scaleY: scale_logo1 }, {translateY: translate_logo1}], opacity: 1}}><Ionicons name={"ios-school-outline"} size={64}/></Animated.View>
          <Animated.View style={{position: "absolute", overflow: "visible", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logoFinal }, {scaleY: scale_logoFinal }, {translateY: translate_logoFinal}], opacity: 1}}><Ionicons name={this.state.selectedSubscription} size={64}/></Animated.View>
        </View>
      );
    } else {
      return(
        <View style={{ height: dimensions.height * .2,  backgroundColor: colors.carminePink, overflow: "hidden"}}>
          <Animated.View style={{position: "absolute", overflow: "visible", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logo0 }, {scaleY: scale_logo0 }, {translateY: translate_logo0}], opacity: 1}}><Ionicons name={"md-restaurant"} size={64}/></Animated.View>
          <Animated.View style={{position: "absolute", overflow: "visible", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logo1 }, {scaleY: scale_logo1 }, {translateY: translate_logo1}], opacity: 1}}><Ionicons name={"ios-game-controller-b-outline"} size={64}/></Animated.View>
          <Animated.View style={{position: "absolute", overflow: "visible", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logo2 }, {scaleY: scale_logo2 }, {translateY: translate_logo2}], opacity: 1}}><Ionicons name={"ios-musical-notes"} size={64}/></Animated.View>
        </View>
      );
    }
  }

  _renderSelectedSubscription(){
    if(this.state.showSubscription){
      return(
        <View style={{alignItems: "center"}}>
          <Text style={styles.title}>{this.state.selectedSubscription}</Text>
        </View>
      );
    }
  }

  render() {
    return(
      <View style={styles.wrapper}>
        {/* HEADER*/}
        <View style={{flex: .2}}>
          <Text style={styles.title}>{"And your free subscription is.."}</Text>
          <Button onPress={Actions.pop}>
            {"Back"}
          </Button>
        </View>
        {/* CONTENT*/}
        <View style={{flex: .7, height: dimensions.height * .7, marginTop: 150}}>
          {/* Roulette //Animated View with Animated images */}
          {this._renderRouletteView()}
          {/* ReRoll optionalText*/}
          {this._renderReRollButton()}
          {/* Selected Roulette Item Name //Animated Text or View*/}
          {this._renderSelectedSubscription()}
        </View>
        {/* FOOTER*/}
        <View style={{flex: .1}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => Actions.PromoInvite({
              subscription: {
                name: 'Netflix',
                logo: '../../assets/images/logos/netflix.png'
              }
            })}
            style={styles.buttonInactive}>
                <Text style={ styles.buttonInactiveText}>{"Continue"}</Text>
          </TouchableHighlight>
        </View>

        { /* Facebook Login Button */
          (this.state.selectedSubscription)
          ? <Animated.View style={[this.AV.loginButton, {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 22, justifyContent: 'center', alignItems: 'center'}]}>
              <LoginButton
                style={{width: dimensions.width - 60, height: 45}}
                readPermissions={["email", "public_profile", "user_friends"]}
                onLoginFinished={(err, res) => this.onLoginFinished(err, res)} />
            </Animated.View>
          : null }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  buttonActiveText:{
    color: '#fff',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center"
  },
  buttonInactiveText:{
    color: 'black',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center"
  },
  buttonActive:{
    height: 50,
    width: dimensions.width,
    backgroundColor: colors.lightAccent,
    justifyContent: "center"
  },
  buttonInactive:{
    height: 50,
    width: dimensions.width,
    backgroundColor: colors.lightGrey,
    justifyContent: "center"
  },

  title: {
    color: "black",
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 25,
    marginRight: 15,
    paddingTop: device == "SE" ? 45 : device == "6" ? 20 : 95,
    lineHeight: device == "SE" ? 18 * 1.20 : device == "6" ? 35 * 1.20 : 22 * 1.20
  },
  description: {
    color: 'black',
    fontSize: 20,
    lineHeight: 20 * 1.20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: "left",
    fontWeight: "500"
  },
  container: {
   flex: 1,
   marginTop: 20,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
})


module.exports = PromoRoulette
