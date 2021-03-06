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
import {colors} from '../globalStyles';

//Custom
const dimensions = Dimensions.get('window');
import {device} from '../helpers';


class MicrodepositTooltip extends React.Component {
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

  closeModal() {
    let {closeModal} = this.props
    if (typeof closeModal === 'function') closeModal()
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <Swiper style={styles.wrapper}
              showsButtons={false}
              dot={this._renderDot()}
              activeDot={this._renderActiveDot()}>
              <View style={styles.slide1}>
                <Text style={styles.header}>{"Verifying Your Bank Account"}</Text>
                <Image source={require('../assets/images/microdeposit_tooltip_1.png')} style={{width: dimensions.width * .84, height: dimensions.height * .40, marginTop: 20, marginBottom: 5}} />
                <Text style={styles.text}>{"Payper will notify you when 2 amounts (Less than 20 cents each) are deposited in your account."}</Text>
              </View>
              <View style={styles.slide2}>
                <Text style={styles.header}>{"Verifying Your Bank Account"}</Text>
                <Image source={require('../assets/images/microdeposit_tooltip_2.png')} style={{width: dimensions.width * .84, height: dimensions.height * .45, marginTop: 20, marginBottom: 5}} />
                <Text style={styles.text}>{"Check your bank account for 2 amounts deposited by Payper."}</Text>
              </View>
              <View style={styles.slide3}>
                <Text style={styles.header}>{"Verifying Your Bank Account"}</Text>
                <Image source={require('../assets/images/microdeposit_tooltip_3.png')} style={{width: dimensions.width * .84, height: dimensions.height * .50, marginTop: 0, marginBottom: 2.5}} />
                <Text style={styles.text}>{"Click on your status card to enter the 2 deposited amounts."}</Text>
                <View style={{flex: 1, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden"}}>
                  <TouchableHighlight
                    activeOpacity={0.8}
                    underlayColor={'transparent'}
                    onPress={() => this.closeModal()}
                    style={{height: 50, width: dimensions.width * .84, backgroundColor: "#06C0A7", justifyContent: "center"}}>
                        <Text style={styles.buttonText}>{"I Understand"}</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Swiper>
          </View>
      </View>
      { /* Close Modal */ }
      <View style={{flex: 1, position: "absolute", left: 0, top: 0}}>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          style={{ margin: dimensions.width * .08, marginTop: 20 }}
          onPress={() => this.closeModal()}>
          <Ionicons size={34} name="md-close" color={colors.accent} />
        </TouchableHighlight>
      </View>
    </View>
    );
  }
}

var styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },
  slide1: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.accent,
    margin: dimensions.width * .08,
    marginTop: dimensions.height * .10,
    marginBottom: dimensions.height * .10,
    borderRadius: dimensions.width / 32.0

  },
  slide2: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.accent,
    margin: dimensions.width * .08,
    marginTop: dimensions.height * .10,
    marginBottom: dimensions.height * .10,
    borderRadius: dimensions.width / 32.0,
  },
  slide3: {
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
    fontSize: device == "SE" ? 16 : device == "6" ? 18 : 20,
    lineHeight: device == "SE" ? 16 * 1.20 : device == "6" ? 18 * 1.20 : 20 * 1.20,
    paddingLeft: device == "SE" ? 10 : device == "6" ? 10 : 10,
    paddingRight: device == "SE" ? 20 : device == "6" ? 20 : 20,
    marginTop: device == "SE" ? 10 : device == "6" ? 10 : 10,
    textAlign: "left",
    fontWeight: "500"
  },
  header: {
    color: "#fff",
    fontSize: device == "SE" ? 20 : device == "6" ? 22 : 24,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: device == "SE" ? 20 : device == "6" ? 20 : 20,
    paddingRight: device == "SE" ? 60 : device == "6" ? 60 : 60,
    marginTop: 15,
    padding: 0,
    lineHeight: device == "SE" ? 20 * 1.20 : device == "6" ? 22 * 1.40 : 24 * 1.20,
  },
  footer: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 14 * 1.20,
    textAlign: "center",
    fontWeight: "300"
  }
})

module.exports = MicrodepositTooltip
