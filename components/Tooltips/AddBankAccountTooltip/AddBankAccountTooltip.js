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

class AddBankAccountTooltip extends React.Component {
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
        <View style={{flex: 1, width: 100, height: 5}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            style={{position: "absolute", margin: dimensions.width * .08, marginTop: 20, marginBottom: 0, top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => console.log("Skip Modal")}>

                <EvilIcons  size={32} name="close" color={colors.accent} />

          </TouchableHighlight>
        </View>
        <View style={{padding: 0}}>
          <Swiper style={styles.wrapper, {}}
            showsButtons={false}
            dot={this._renderDot()}
            activeDot={this._renderActiveDot()}>
            <View style={styles.slide1}>
              <Text style={styles.header}>Adding A Bank Account Is Secure & Simple</Text>
              <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 50, marginBottom: 5}} />
              <Text style={styles.text}> You have two ways to add a bank account,
              through Instant Account Verification and Deposit Verification</Text>
              <View style={{flex: 1, justifyContent: "flex-end", marginBottom: 15}}>
                <Text style={styles.footer}>*Payper does not store this information</Text>
              </View>
            </View>
            <View style={styles.slide2}>
              <Text style={styles.header}>Instant Account Verification</Text>
              <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 50, marginBottom: 5}} />
              <Text style={styles.text}>Find your bank!</Text>
              <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 5, marginBottom: 5}} />
              <Text style={styles.text}>Use your login information to verify your bank account. Thats it!</Text>
              <View style={{flex: 1, justifyContent: "flex-end", marginBottom: 15}}>
                <Text style={styles.footer}>*Payper does not store this information</Text>
              </View>
            </View>
            <View style={styles.slide3}>
              <Text style={styles.header}>{"Can't Find Your Bank? No Problem!"}</Text>
              <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 50, marginBottom: 5}} />
              <Text style={styles.text}>If your bank is not found you will automatically use deposit verification.</Text>
              <View style={{flex: 1, justifyContent: "flex-end", marginBottom: 15}}>
                <Text style={styles.footer}>*Payper does not store this information</Text>
              </View>
            </View>
            <View style={styles.slide4}>
              <Text style={styles.header}>Deposit Verification</Text>
              <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 50, marginBottom: 5}} />
              <Text style={styles.text}>{"Enter your routing number and account number."}</Text>
              <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 5, marginBottom: 5}} />
              <Text style={styles.text}>{"Those numbers can easily be found on a check."}</Text>
              <View style={{flex: 1, justifyContent: "flex-end", marginBottom: 15}}>
                <Text style={styles.footer}>*Payper does not store this information</Text>
              </View>
            </View>
            <View style={styles.slide5}>
              <Text style={styles.header}>{"That's it!"}</Text>
              <Image source={require('../../../assets/images/blank_image.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 50, marginBottom: 5}} />
              <Text style={styles.text}>{"Once finished you will be returned to the home screen."}</Text>
              <View style={{flex: 1, justifyContent: "flex-end", marginBottom: 15}}>
                <Text style={styles.footer}>*Payper does not store this information</Text>
              </View>
            </View>
          </Swiper>
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
  slide4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    margin: dimensions.width * .08,
    marginTop: dimensions.height * .10,
    marginBottom: dimensions.height * .10,
    borderRadius: dimensions.width / 32.0
  },
  slide5: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    margin: dimensions.width * .08,
    marginTop: dimensions.height * .10,
    marginBottom: dimensions.height * .10,
    borderRadius: dimensions.width / 32.0
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

module.exports = AddBankAccountTooltip
