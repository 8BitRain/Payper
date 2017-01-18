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
import { device } from '../../../helpers'

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

  closeModal() {
    let {closeModal} = this.props
    if (typeof closeModal === 'function') closeModal()
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
        <View style={{flex: 1}}>
          <View style={styles.wrapper}>
            <Text style={styles.header}>{"Oh no!"}</Text>
            <Image source={require('../../../assets/images/suspended_photo_crash.png')} style={{width: dimensions.width * .56, height: dimensions.height * .245, marginTop: 35, marginBottom: 5}} />
            {/*<Text style={styles.header2}>{"We know this can be frustrating but don't worry!"}</Text>*/}
            <Text style={styles.text2} >{"There is an issue with your verification."}</Text>
            <Text style={styles.text2} >{"We are working on fixing this."}</Text>
            <View style={{flex: 1, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden"}}>
              <Text style={styles.text3} >{"Contact us at info@getpayper.io"}</Text>
            </View>
          </View>
          <View style={{flex: 1, position: "absolute", left: 0, top: 0}}>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              style={{ margin: dimensions.width * .08, marginTop: 20 }}
              onPress={() => this.closeModal()}>

                  <Ionicons  size={32} name="md-close" color={colors.accent} />

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
    textAlign: "left",
    fontWeight: "500"
  },
  text2: {
    color: '#fff',
    fontSize: device == "SE" ? 16 : device == "6" ? 18 : 20,
    lineHeight: device == "SE" ? 16 * 1.20 : device == "6" ? 16 * 1.20 : 16 * 1.20,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
    fontWeight: "500",
    marginTop: 25
  },
  text3: {
    color: '#fff',
    fontSize: device == "SE" ? 14 : device == "6" ? 16 : 18,
    lineHeight: device == "SE" ? 14 * 1.20 : device == "6" ? 16 * 1.20 : 18 * 1.20,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 10
  },
  header: {
    color: "#fff",
    fontSize: device == "SE" ? 50 : device == "6" ? 75 : 100,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: device == "SE" ? 45 : device == "6" ? 70 : 95,
    lineHeight: device == "SE" ? 18 * 1.20 : device == "6" ? 20 * 1.20 : 22 * 1.20
  },
  header2: {
    color: "#fff",
    fontSize: device == "SE" ? 18 : device == "6" ? 20 : 22,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 15,
    lineHeight: device == "SE" ? 18 * 1.20 : device == "6" ? 20 * 1.20 : 22 * 1.20
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
