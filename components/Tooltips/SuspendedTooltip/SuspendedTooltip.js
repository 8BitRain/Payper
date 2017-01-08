// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet } from 'react-native';
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

//Custom
const dimensions = Dimensions.get('window');

class SuspendedTooltip extends React.Component {
  constructor(props) {
    super(props);
    //this.height = new Animated.Value(0);


    this.state = {
      index: 0,
      closeModal: false
    }


  }

  componentDidMount() {

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

  render() {
    return(
      <View style={{flex: 1}}>
        {/* To get the close button working change height to 50. Remember to view the borders*/}
        <View style={{ width: 100, height: 5}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            style={{position: "absolute", margin: dimensions.width * .08, marginTop: 20, marginBottom: 0, top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => console.log("Skip Modal")}>

                <EvilIcons  size={32} name="close" color={colors.accent} />

          </TouchableHighlight>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.header}>{"Oh no, there seems to be an issue with your account."}</Text>
          <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 50, marginBottom: 5}} />
          <Text style={styles.header}>{"We know this can be frustrating but don't worry!"}</Text>
          <Text style={styles.text2} >{"We are getting down to the bottom of why this happened. We'll keep you updated. In the meantime.."}</Text>
          <View style={{flex: 1, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden"}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => console.log("Close Modal")}
            style={{height: 50, width: dimensions.width * .84, backgroundColor: "#06C0A7", justifyContent: "center"}}>

                <Text style={styles.buttonText}>{"Contact Payper"}</Text>
          </TouchableHighlight>
          </View>
        </View>
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

module.exports = SuspendedTooltip
