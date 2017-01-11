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
      moneyTransitionState: 0
    }

    this.loadKey_value_0 = new Animated.Value(0);
    this.celebration_text_value = new Animated.Value(0);
    this.fadein_confirmation_button_value = new Animated.Value(0);
    this.transistion_view_value = new Animated.Value(0);
    this.moneybag_transition_value = new Animated.Value(0);
    this.extendedhand_transition_value = new Animated.Value(0);
    this.transition_money_hand_value = new Animated.Value(0);


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
    ).start(() => this.fadein_confirmation_button())
  }

  fadein_confirmation_button(){
    Animated.timing(
      this.fadein_confirmation_button_value,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.ease
      }
    ).start()
  }

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
    ).start(() => {this.setState({moneyTransitionState: 1}), this.transition_money_hand()})
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
    ).start()
  }



  render() {
    const loadKey_0 = this.loadKey_value_0.interpolate({
     inputRange: [0, 1],
     outputRange: [0, 64]
    })

    const loadKey_scaleChange = this.loadKey_value_0.interpolate({
     inputRange: [0, 1],
     outputRange: [0.1, 2.0]
    })

    const load_celebration_text = this.celebration_text_value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.0, 1.0]
    })

    const fadein_confirmation_button = this.fadein_confirmation_button_value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.0, 1.0]
    })

    const transistion_view = this.transition_money_hand_value.interpolate({
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
          outputRange: [0.0, -20.0]
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



    return(
      <View style={{flex: 1}}>
        <View style={styles.wrapper}>
          {/* Key */}
          <Animated.View style={{flex: 1, position: "absolute", justifyContent: "center", alignItems: "center", left: 100, top: 150, opacity: transistion_view_opacity, transform: [{translateX: transistion_view}]}}>
            <Animated.Image style={{width: 64, height: 64, transform: [{scaleX: loadKey_scaleChange}, {scaleY: loadKey_scaleChange}], opacity: 1}} source={require('../../../assets/images/key.png')}/>
          </Animated.View>
          {/* Money Bag */}
          {<Animated.View style={{flex: 1, position: "absolute", justifyContent: "center", alignItems: "center", left: 110, top: 0, transform: [{translateY: moneybag_transition}], opacity: moneybag_transition_opacity}}>
            <Animated.Image style={{width: 60, height: 81}} source={require('../../../assets/images/moneybag.png')}/>
          </Animated.View>}
          {/* Extended Hand*/}
          <Animated.View style={{flex: 1, position: "absolute", justifyContent: "center", alignItems: "center", left: 100, top: 200, transform: [{translateY: transition_money_hand}], opacity: extendedhand_transition, width: 64, height: 64}}>
            <Animated.Image style={{width: 122, height: 56}} source={require('../../../assets/images/extendedhand.png')}/>
          </Animated.View>

          <Animated.View style={{flex: 1, paddingLeft: 50, paddingRight: 50, position: "absolute", justifyContent: "center", alignItems: "center", top: dimensions.height * .45, opacity: transistion_view_opacity,
            transform: [{scaleX: load_celebration_text }, {scaleY: load_celebration_text}, {translateX: transistion_view}]}}>
            <Text style={styles.header}>{"Congrats!"}</Text>
            <Text style={styles.text}>{"You've unlocked the ability to send money with Payper!"}</Text>
          </Animated.View>
          <Animated.View style={{flex: 1, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden", opacity: this.fadein_confirmation_button_value}}>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => this.transistion_view()}
              style={{height: 50, width: dimensions.width * .84, backgroundColor: colors.lightAccent, justifyContent: "center"}}>

                  <Text style={styles.buttonText}>{"Great!"}</Text>
            </TouchableHighlight>
          </Animated.View>
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
