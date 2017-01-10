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
      closeModal: false
    }

    this.loadKey_value_0 = new Animated.Value(1);


  }

  componentDidMount() {
    {/* Animations */}
    this.loadKey_0();
    if(this._confettiView) {
      this._confettiView.startConfetti();
    }

  }

  loadKey_0() {
  this.loadKey_value_0.setValue(0);
  Animated.timing(
    this.loadKey_value_0,
    {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease
    }
  ).start()
  }



  render() {
    const loadKey_0 = this.loadKey_value_0.interpolate({
     inputRange: [0, 1],
     outputRange: [0, 2]
    })

    return(
      <View style={{flex: 1}}>
        <View style={styles.wrapper}>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            { <Animated.Text style={{fontSize: loadKey_0}}>🔑</Animated.Text> }
            { /*<Animated.Image style={{width: 64, height: 64, transform: [{scaleX: loadKey_0}, {scaleY: loadKey_0}]}} source={require('../../../assets/images/key.png')}/> */}
          </View>
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
