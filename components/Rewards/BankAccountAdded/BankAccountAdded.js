// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'


import Confetti from 'react-native-confetti';

// Stylesheets
import {colors} from '../../../globalStyles';

// Partial components
import Header from '../../../components/Header/Header';
import * as Headers from '../../../helpers/Headers';

//Custom
const dimensions = Dimensions.get('window');

class BankAccountAdded extends React.Component {
  constructor(props) {
    super(props);
    //this.height = new Animated.Value(0);


    this.state = {
      index: 0,
      closeModal: false,
      moneyTransitionState: 0,
      buttonFadeState: 0,
      buttonState: 0,
      moneyBagContainerTop: 0
    }

    this.top_pos;

    this.loadKey_value_0 = new Animated.Value(0);
    this.celebration_text_value = new Animated.Value(0);
    this.fade_confirmation_button_value = new Animated.Value(0);
    //Yo what does this even mean ??? change name
    this.transistion_view_value = new Animated.Value(0);
    this.moneybag_transition_value = new Animated.Value(0);
    this.extendedhand_transition_value = new Animated.Value(0);
    this.transition_money_hand_value = new Animated.Value(0);
    this.fadein_verifyid_text_value = new Animated.Value(0);


  }

  componentDidMount() {
    {/* Animations */}
    this.loadKey_0();
    /*if(this._confettiView) {
      this._confettiView.startConfetti();
    }*/

  }

  loadKey_0() {
  this.loadKey_value_0.setValue(0);
  Animated.timing(
    this.loadKey_value_0,
    {
      toValue: 1,
      duration: 500,
      easing: Easing.elastic(2)
    }
  ).start(() => {this._confettiView.startConfetti(); this.load_celebration_text()})
  }

  load_celebration_text(){
    Animated.timing(
      this.celebration_text_value,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(2)
      }
    ).start(() => this.fade_confirmation_button())
  }

  fade_confirmation_button(){
    this.fade_confirmation_button_value.setValue(0);
    Animated.timing(
      this.fade_confirmation_button_value,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.ease
      }
    ).start()
  }

  //Move celebration + key left
  //Fade out celebration text + key
  //Fade out confirmation button

  transistion_view(){
    Animated.timing(
      this.transistion_view_value,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.spring
      }
    ).start(() => this.extendedhand_transition())
  }

  moneybag_transition(){
    Animated.timing(
      this.moneybag_transition_value,
      {
        toValue: 1,
        duration: 600,
        easing: Easing.elastic(1.5)
      }
    ).start(() => {
      this.setState({moneyTransitionState: 1});
      //Adjust moneybag Containers top positioning. TranslateY caused an offset
      this.setState({moneyBagContainerTop: 125})
      this.transition_money_hand();
    })
  }

  extendedhand_transition(){
    Animated.timing(
      this.extendedhand_transition_value,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.ease
      }
    ).start(() => {this.moneybag_transition()})
  }

  transition_money_hand(){
    Animated.timing(
      this.transition_money_hand_value,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.ease
      }
    ).start(() => {this.fadein_verifyid_text()})
  }

  fadein_verifyid_text(){
    Animated.timing(
      this.fadein_verifyid_text_value,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(2.0)
      }
    ).start(() => {
      this.setState({buttonFadeState: 0,  buttonState: 1});
      this.fade_confirmation_button();
      console.log(this.state.buttonState);
    })
  }


  _renderConfirmationButton(){
    var fade_confirmation_button;
    switch (this.state.buttonFadeState) {
      //FADE IN
      case 0:
        fade_confirmation_button = this.fade_confirmation_button_value.interpolate({
          inputRange: [0, 1],
          outputRange: [0.0, 1.0]
        })
        break;
      //FADE OUT
      case 1:
         fade_confirmation_button = this.transistion_view_value.interpolate({
          inputRange: [0, 1],
          outputRange: [1.0, 0.0]
        })
        break;
      default:
    }

    if(this.state.buttonState == 0){
      return(
        <Animated.View style={{flex: 1, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden", opacity: fade_confirmation_button}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {
              this.setState({buttonFadeState: 1});
              this.transistion_view();
            }}
            style={{height: 50, width: dimensions.width * .84, backgroundColor: colors.lightAccent, justifyContent: "center"}}>

                <Text style={styles.buttonText}>{"Great!"}</Text>
          </TouchableHighlight>
        </Animated.View>
      );
    }

    if(this.state.buttonState == 1){
      return(
        <Animated.View style={{flex: 1, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, opacity: fade_confirmation_button}}>
          <View style={{flexDirection: "row"}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {
              /*this.setState({buttonFadeState: 1});*/
              //this.transistion_view();
            }}
            style={{height: 50, width: dimensions.width * .44, backgroundColor: colors.lightAccent, justifyContent: "center", borderRightColor: colors.accent, borderRightWidth: 3.0}}>
                <Text style={styles.buttonText}>{"Verifiy I.D"}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {
              /*this.setState({buttonFadeState: 1});*/
              //this.transistion_view();
            }}
            style={{height: 50, width: dimensions.width * .44, backgroundColor: colors.lightAccent, justifyContent: "center"}}>
                <Text style={styles.buttonText}>{"Skip"}</Text>
          </TouchableHighlight>
          </View>
        </Animated.View>
      );
    }

  }

  render() {

    const loadKey_scaleChange = this.loadKey_value_0.interpolate({
     inputRange: [0, 1],
     outputRange: [0.1, 2.0]
    })

    const load_celebration_text = this.celebration_text_value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.0, 1.0]
    })

    /*const fade_confirmation_button = this.fade_confirmation_button_value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.0, 1.0]
    })*/

    var fade_confirmation_button;
    switch (this.state.buttonFadeState) {
      //FADE IN
      case 0:
        fade_confirmation_button = this.fade_confirmation_button_value.interpolate({
          inputRange: [0, 1],
          outputRange: [0.0, 1.0]
        })
        break;
      //FADE OUT
      case 1:
         fade_confirmation_button = this.transistion_view_value.interpolate({
          inputRange: [0, 1],
          outputRange: [1.0, 0.0]
        })
        break;
      default:
    }

    const transistion_view = this.transistion_view_value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.0, -40.0]
    })

    const transistion_view_opacity = this.transistion_view_value.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })

    /*const moneybag_transition = this.moneybag_transition_value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.0, 125.0]
    })*/

    const moneybag_transition_opacity = this.moneybag_transition_value.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })

    var moneybag_transition;
    switch (this.state.moneyTransitionState) {
      case 0:
        moneybag_transition = this.moneybag_transition_value.interpolate({
          inputRange: [0, 1],
          outputRange: [0.0, 125.0]
        })
        break;
      case 1:
         moneybag_transition = this.transition_money_hand_value.interpolate({
          inputRange: [0, 1],
          outputRange: [0.0, -80.0]
        })
        break;
      default:
    }

    const extendedhand_transition = this.extendedhand_transition_value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.0, 1.0]
    })

    const transition_money_hand = this.transition_money_hand_value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.0, -80.0]
    })

    const fadein_verifyid_text = this.fadein_verifyid_text_value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.0, 1.0]
    })


    return(
      <View style={{flex: 1}}>
        <View style={styles.wrapper}>
          {/* Key */}
          <Animated.View style={{flex: 1, position: "absolute", justifyContent: "center", alignItems: "center", left: 100, top: 150, opacity: transistion_view_opacity, transform: [{translateX: transistion_view}]}}>
            <Animated.Image style={{width: 64, height: 64, transform: [{scaleX: loadKey_scaleChange}, {scaleY: loadKey_scaleChange}], opacity: 1}} source={require('../../../assets/images/key.png')}/>
          </Animated.View>
          {/* Money Bag */}
          {<Animated.View style={{flex: 1, position: "absolute", justifyContent: "center", alignItems: "center", left: 110, top: this.state.moneyBagContainerTop, transform: [{translateY: moneybag_transition}], opacity: moneybag_transition_opacity}}>
            <Animated.Image style={{width: 60, height: 81}} source={require('../../../assets/images/moneybag.png')}/>
          </Animated.View>}
          {/* Extended Hand*/}
          <Animated.View  style={{flex: 1, position: "absolute", justifyContent: "center", alignItems: "center", left: 100, top: 200, transform: [{translateY: transition_money_hand}], opacity: extendedhand_transition, width: 64, height: 64}}>
            <Animated.Image style={{width: 122, height: 56}} source={require('../../../assets/images/extendedhand.png')}/>
          </Animated.View>
          {/* Send Money With Payper */}
          <Animated.View style={{flex: 1, paddingLeft: 50, paddingRight: 50, position: "absolute", justifyContent: "center", alignItems: "center", top: dimensions.height * .45, opacity: transistion_view_opacity,
            transform: [{scaleX: load_celebration_text }, {scaleY: load_celebration_text}, {translateX: transistion_view}]}}>
            <Text style={styles.header}>{"Congrats!"}</Text>
            <Text style={styles.text}>{"You've unlocked the ability to send money with Payper!"}</Text>
          </Animated.View>
          {/* Verify I.D */}
          <Animated.View style={{flex: 1, paddingLeft: 25, paddingRight: 25, position: "absolute", justifyContent: "center", alignItems: "center", top: dimensions.height * .35, opacity: fadein_verifyid_text,
            transform: [{scaleX: fadein_verifyid_text }, {scaleY: fadein_verifyid_text}]}}>
            <Text style={styles.header}>{"Want to recieve money?"}</Text>
            <Text style={styles.text}>{"Verify your identity to unlock recieving money with Payper!"}</Text>
          </Animated.View>

          {/* Confirmation Button */}
          {this._renderConfirmationButton()}

        </View>
        <Confetti duration={1000} ref={(node) => this._confettiView = node}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.accent,
    margin: dimensions.width * .08,
    marginTop: dimensions.height * .10,
    marginBottom: dimensions.height * .10,
    borderRadius: dimensions.width / 32.0,
    overflow: "hidden"
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
  footer: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 14 * 1.20,
    textAlign: "center",
    fontWeight: "300"
  }
})

module.exports = BankAccountAdded
