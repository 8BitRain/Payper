// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ListView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button'
import EvilIcons from 'react-native-vector-icons/EvilIcons';

//Routing
import {Actions} from 'react-native-router-flux';


// Stylesheets
import {colors} from '../../globalStyles';

//Custom
const dimensions = Dimensions.get('window');
import { device } from '../../helpers'


//Firebase
import { Firebase } from '../../helpers'

var subscriptionList = [
  "ios-book-outline",
  "ios-school-outline",
  "md-heart",
  "md-restaurant",
  "ios-game-controller-b-outline",
  "ios-musical-notes"
]

const animLoop = 4;

class PromoRoulette extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSubscription: "",
      rouletteLoop: -1,
      rouletteFinished: true,
      showSubscription: false,
      wantedTags: null,
      wantedTagsCategories: null,
      rouletteActive: null,
      canContinue: false

    }

    this.animLogo_0 = new Animated.Value(0);
    this.animLogo_1 = new Animated.Value(0);
    this.animLogo_2 = new Animated.Value(0);
    this.animLogo_Selected = new Animated.Value(0);
  }

  componentDidMount() {

  }

  componentWillMount() {
    let wantedTagsDirty = this.props.wantedTags;
    let wantedTagsClean = [];
    for (var tag in wantedTagsDirty){
      if(wantedTagsDirty[tag]){
        //Remove the # & append a ,
        wantedTagsClean.push(tag)
      }
    }
    console.log("Wanted Tags: " + wantedTagsClean);
    this.setState({wantedTags: wantedTagsClean,  rouletteActive: true, wantedTagsCategories: this.props.wantedTagsCategories});
  }

  componentWillUnmount() {
    console.log("Component unmounted");
    this.setState({rouletteActive: false});
  }

  imageAnim(loop, pos){
    console.log("RoulletteLoop? " + this.state.rouletteLoop);
    console.log("is rouletteActive: " + this.state.rouletteActive);
    if(this.state.rouletteActive){
      if(loop == animLoop){
        this.setState({rouletteFinished: false, showSubscription: false, rouletteLoop: animLoop});
      }

      if(animLoop == 1){
        this.animLogo_Selected.setValue(0);
      }

      //ANIM 0
      if(pos == 0){
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

      //ANIM 1
      if(pos == 1){
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

      //ANIM 2 or ANIM Final
      if(pos == 2 ){
        if(this.state.rouletteLoop == 0){
          console.log("Final Anim");
          this.animLogo_Selected.setValue(0);
          Animated.timing(
          this.animLogo_Selected,
          {
            toValue: 1,
            duration: this.getAnimSpeed(loop),
            easing: Easing.spring
          }
        ).start(() => {
          if(loop == 0){
            console.log("Stop Final Anim");
            this.setState({rouletteFinished: true, showSubscription: true, canContinue: true })
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
              subscription = this.generateSubscription(this.state.wantedTags);
              this.setState({rouletteLoop: next_loop, selectedSubscription: subscription});
              //this.imageAnim(next_loop, 2 );
              this.imageAnim(next_loop, 2 );
            } else {
              this.imageAnim(next_loop, 0 );
            }
          }});
        }
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
              this.setState({rouletteLoop: -2, canContinue: false});
              this.imageAnim(animLoop, 0);
            }}
            style={styles.rouletteButtonActive}>
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
            style={styles.rouletteButtonInactive}>
                <Text style={styles.buttonInactiveText}>{"Re-Roll"}</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }

  _renderContinueButton(){
    if(this.state.canContinue){
      let logoName = this.getLogoName(this.state.selectedSubscription);
      return(
        <View style={{flex: .1, backgroundColor: colors.lightAccent}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => Actions.PromoInvite({
              subscription: {
                name: this.state.selectedSubscription,
                logo: logoName
              }
            })}
            style={styles.buttonActive}>
                <Text style={styles.buttonActiveText}>{"Continue"}</Text>
          </TouchableHighlight>
        </View>
      );
    }
    if(!this.state.canContinue){
      return(
        <View style={{flex: .1, backgroundColor: "white"}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => console.log("Can't Continue")}
            style={styles.buttonInactive}>
                <Text style={styles.buttonInactiveText}>{"Continue"}</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }

  getLogoName(tagName){
    let category = "Exercise"
    let wantedTagsCategories = this.state.wantedTagsCategories;
    console.log("wantedTagsCategories, ", wantedTagsCategories);
    for(tag in wantedTagsCategories){
      if(tagName == tag){
        console.log("Tag Name (Loop) " + tag);
        category = wantedTagsCategories[tag];
      }
    }
    switch (category) {
      case "Books":
        return "ios-book-outline";
        break;
      case "Education":
        return "ios-school-outline";
        break;
      case "Exercise":
        return "md-heart";
        break;
      case "FoodDelivery":
        return "md-restaurant";
        break;
      case "Gaming":
        return "ios-game-controller-b-outline";
        break;
      case "LiveTv":
        return "md-desktop";
        break;
      case "MusicStreaming":
        return "ios-musical-notes";
        break;
      case "News":
        return "logo-rss";
        break;
      case "Sports":
        return "md-american-football";
        break;
      case "VideoStreaming":
        return "logo-youtube";
        break;
    }
  }

  _renderRouletteView(){

    var fade_logo0 = this.animLogo_0.interpolate({inputRange: [0, 1],outputRange: [1.0, 0.0]});
    var fade_logo1 = this.animLogo_1.interpolate({inputRange: [0, 1],outputRange: [1.0, 0.0]});
    var fade_logo2 = this.animLogo_2.interpolate({inputRange: [0, 1],outputRange: [1.0, 0.0]});
    var translate_logo0 = this.animLogo_0.interpolate({inputRange: [0, 1],outputRange: [-60.0, 200.0]});
    var translate_logo1 = this.animLogo_1.interpolate({inputRange: [0, 1],outputRange: [-60.0, 200.0]});
    var translate_logo2 = this.animLogo_2.interpolate({inputRange: [0, 1],outputRange: [-60.0, 200.0]});
    var scale_logo0 = this.animLogo_0.interpolate({inputRange: [0, .5, 1],outputRange: [1, 1.5, 1]});
    var scale_logo1 = this.animLogo_1.interpolate({inputRange: [0, .5, 1],outputRange: [1, 1.5, 1]});
    var scale_logo2 = this.animLogo_2.interpolate({inputRange: [0, .5, 1],outputRange: [1, 1.5, 1]});
    var translate_logoFinal = this.animLogo_Selected.interpolate({inputRange: [0, 1],outputRange: [-60.0, 80.0]});
    var scale_logoFinal = this.animLogo_Selected.interpolate({inputRange: [0, .5, 1],outputRange: [1, 1.5, 1]});

    if(this.state.rouletteLoop == -1 || this.state.rouletteLoop == -2 ){
      return(
        <View style={{ height: dimensions.height * .2, overflow: "hidden"}}>
          <Animated.View style={{position: "absolute", alignItems: "center", overflow: "visible", top: 0, left: dimensions.width * .20, right: dimensions.width * .20,  opacity: 1}}><Ionicons color={colors.snowWhite} name={this.getLogoName(this.state.wantedTags[0])} size={64}/><Text style={styles.logoName}>{this.state.wantedTags[0]}</Text></Animated.View>
        </View>
      );
    }
    if(this.state.rouletteLoop == 0){
      //The final image should be here
      return(
        <View style={{ height: dimensions.height * .2, overflow: "hidden"}}>
          <Animated.View style={{position: "absolute", alignItems: "center", overflow: "visible", top: -60, left: dimensions.width * .20, right: dimensions.width * .20, transform: [{scaleX: scale_logoFinal }, {scaleY: scale_logoFinal }, {translateY: translate_logoFinal}], opacity: 1}}><Ionicons name={this.getLogoName(this.state.selectedSubscription)} color={colors.snowWhite} size={64}/><Text style={styles.logoName}>{this.state.selectedSubscription}</Text></Animated.View>
          {/*<Animated.Image  source={{uri:this.state.wantedTags[0] + ".png"}} style={{ width: 40, height: 40, borderRadius: 12, position: "absolute", overflow: "hidden", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logo0 }, {scaleY: scale_logo0 }, {translateY: translate_logo0}], opacity: 1}}/>
          <Animated.Image  source={{uri:this.state.wantedTags[1] + ".png"}} style={{ width: 40, height: 40, borderRadius: 12, position: "absolute", overflow: "hidden", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logo1 }, {scaleY: scale_logo1 }, {translateY: translate_logo1}], opacity: 1}}/>
          <Animated.Image  source={{uri:this.state.selectedSubscription + ".png"}} style={{ width: 40, height: 40, borderRadius: 12, position: "absolute", overflow: "hidden", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logoFinal }, {scaleY: scale_logoFinal }, {translateY: translate_logoFinal}], opacity: 1}}/>*/}
        </View>
      );
    } else {
      return(
        <View style={{ height: dimensions.height * .2, overflow: "hidden"}}>
          <Animated.View style={{position: "absolute", alignItems: "center", overflow: "visible", top: -60, left: dimensions.width * .20, right: dimensions.width * .20, transform: [{scaleX: scale_logo0 }, {scaleY: scale_logo0 }, {translateY: translate_logo0}], opacity: 1}}><Ionicons name={this.getLogoName(this.state.wantedTags[0])} color={colors.snowWhite} size={64}/><Text style={styles.logoName}>{this.state.wantedTags[0]}</Text></Animated.View>
          <Animated.View style={{position: "absolute", alignItems: "center", overflow: "visible", top: -60, left: dimensions.width * .20, right: dimensions.width * .20, transform: [{scaleX: scale_logo1 }, {scaleY: scale_logo1 }, {translateY: translate_logo1}], opacity: 1}}><Ionicons name={this.getLogoName(this.state.wantedTags[1])} color={colors.snowWhite} size={64}/><Text style={styles.logoName}>{this.state.wantedTags[1]}</Text></Animated.View>
          <Animated.View style={{position: "absolute", alignItems: "center", overflow: "visible", top: -60, left: dimensions.width * .20, right: dimensions.width * .20, transform: [{scaleX: scale_logo2 }, {scaleY: scale_logo2 }, {translateY: translate_logo2}], opacity: 1}}><Ionicons name={this.getLogoName(this.state.wantedTags[2])} color={colors.snowWhite} size={64}/><Text style={styles.logoName}>{this.state.wantedTags[2]}</Text></Animated.View>
          {/*<Animated.Image  source={{uri:this.state.wantedTags[0] + ".png"}} style={{width: 40, height: 40, borderRadius: 12, position: "absolute", overflow: "hidden", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logo0 }, {scaleY: scale_logo0 }, {translateY: translate_logo0}], opacity: 1}}/>
          <Animated.Image  source={{uri:this.state.wantedTags[1] + ".png"}} style={{ width: 40, height: 40, borderRadius: 12, position: "absolute", overflow: "hidden", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logo1 }, {scaleY: scale_logo1 }, {translateY: translate_logo1}], opacity: 1}}/>
          <Animated.Image  source={{uri:this.state.wantedTags[2] + ".png"}} style={{ width: 40, height: 40, borderRadius: 12, position: "absolute", overflow: "hidden", top: -40, left: dimensions.width * .425, transform: [{scaleX: scale_logo2 }, {scaleY: scale_logo2 }, {translateY: translate_logo2}], opacity: 1}}/> */}
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
          <Text style={styles.title}>{"Roll to recieve your free subscription!"}</Text>
          {/* Back Button*/}
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {
              this.setState({rouletteActive: false});
              Actions.pop();
            }}
            style={{position: "absolute", top: 20, marginLeft: 5}}>
                <Ionicons name={"ios-arrow-back"} size={48} color={colors.snowWhite}/>
          </TouchableHighlight>
        </View>
        {/* CONTENT*/}
        <View style={{flex: .7, height: dimensions.height * .7, marginTop: 150}}>
          {/* Roulette //Animated View with Animated images */}
          {this._renderRouletteView()}
          {/* ReRoll optionalText*/}
          {this._renderReRollButton()}
        </View>
        {/* FOOTER*/}
        {this._renderContinueButton()}

      </View>
    );
  }
}

var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  buttonActiveText:{
    color: '#fff',
    fontSize: 18,
    lineHeight: Math.round(18 * 1.20),
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center",
  },
  buttonInactiveText:{
    color: 'black',
    fontSize: 18,
    lineHeight: Math.round(18 * 1.20),
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center",
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
  rouletteButtonActive:{
    height: 50,
    width: dimensions.width * .5,
    backgroundColor: colors.carminePink,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 4
  },
  rouletteButtonInactive:{
    height: 50,
    width: dimensions.width * .5,
    backgroundColor: colors.lightGrey,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 4
  },

  title: {
    color: colors.snowWhite,
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 35,
    marginRight: 15,
    paddingTop: device == "SE" ? 45 : device == "6" ? 20 : 95,
    lineHeight: device == "SE" ? Math.round(18 * 1.20) : device == "6" ? Math.round(35 * 1.20) : Math.round(22 * 1.20)
  },
  logoName: {
    color: colors.snowWhite,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  description: {
    color: 'black',
    fontSize: 20,
    lineHeight: Math.round(20 * 1.20),
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
