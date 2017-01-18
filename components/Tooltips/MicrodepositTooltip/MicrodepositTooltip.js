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
        <View style={{padding: 0}}>
          <Swiper style={styles.wrapper, {}}
            showsButtons={false}
            dot={this._renderDot()}
            activeDot={this._renderActiveDot()}>
            <View style={styles.slide1}>
              <Text style={styles.header}>{"Verifying Your Bank Account"}</Text>
              <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 50, marginBottom: 5}} />
              <Text style={styles.text}> {"Payper will notify you when 2 amounts (Less than 20 cents each) are deposited in your account."}}</Text>
            </View>
            <View style={styles.slide2}>
              <Text style={styles.header}>{"Verifying Your Bank Account"}</Text>
              <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 50, marginBottom: 5}} />
              <Text style={styles.text}>{"Check your bank account for 2 amounts deposited by Payper."}</Text>
            </View>
            <View style={styles.slide3}>
              <Text style={styles.header}>{"Verifying Your Bank Account"}</Text>
              <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 50, marginBottom: 5}} />
              <Text style={styles.text}>{"On the home page of this app click on your status card to enter the 2 amounts Payper deposited."}</Text>
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


      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'transparent'}
        style={{position: "absolute", margin: dimensions.width * .08, marginTop: 20, marginBottom: 0, top: 0, left: 0}}
        onPress={() => this.closeModal()}>

        <EvilIcons size={32} name="close" color={colors.accent} />

      </TouchableHighlight>

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
    fontSize: 16,
    lineHeight: 16 * 1.20,
    textAlign: "center",
    fontWeight: "500"
  },
  header: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
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

module.exports = MicrodepositTooltip
