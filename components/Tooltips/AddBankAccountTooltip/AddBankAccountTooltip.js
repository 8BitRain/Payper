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

    this.fade_dimmed_background_value = new Animated.Value(0);

  }

  componentDidMount() {
    this.fade_dimmed_background();
  }

  fade_dimmed_background() {
    //this.fade_dimmed_background_value.setValue(0);
    Animated.timing(
      this.fade_dimmed_background_value,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.ease
      }
    ).start()
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
    const dimOpacity = this.fade_dimmed_background_value.interpolate({
      inputRange: [0.0, 1.0],
      outputRange: [0.0, 0.9]
    })
    return(
      <View style={{flex: 1}}>
      {/* Dim Background*/ }
      <Animated.View style={{flex: 1,
          position: "absolute",
          backgroundColor: colors.richBlack,
          opacity: dimOpacity,
          height: dimensions.height,
          width: dimensions.width}}>
      </Animated.View>
      <View style={{flex: 1}}>
        {/* To get the close button working change height to 50. Remember to view the borders*/}

        <View style={{padding: 0}}>
          <Swiper style={styles.wrapper}
            showsButtons={false}
            dot={this._renderDot()}
            activeDot={this._renderActiveDot()}>
            <View style={styles.slide1}>
              <Text style={styles.header}>Adding A Bank Account Is Secure & Simple</Text>
              <Image source={require('../../../assets/images/add_bank_explan_1.png')} style={{width: dimensions.width * .84, height: dimensions.height * .40, marginTop: 30, marginBottom: 5}} />
              <Text style={styles.text}> You have two ways to add a bank account,
              through Instant Account Verification and Deposit Verification</Text>
              <View style={{flex: 1, justifyContent: "flex-end", marginBottom: 15}}>
                <Text style={styles.footer}>*Payper does not store this information</Text>
              </View>
            </View>
            <View style={styles.slide2}>
              <Text style={styles.header}>Instant Account Verification</Text>
              <Image source={require('../../../assets/images/add_bank_explan_2.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 50, marginBottom: 5}} />
              <Text style={styles.text}>Find your bank!</Text>
              <Image source={require('../../../assets/images/add_bank_explan_3.png')} style={{width: dimensions.width * .84, height: dimensions.height * .20, marginTop: 5, marginBottom: 5}} />
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
    <View style={{flex: 1, position: "absolute", left: 0, top: 0}}>
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'transparent'}
        style={{margin: dimensions.width * .08, marginTop: 20}}
        onPress={() => {this.props.toggleTooltip(false)}}>

            <EvilIcons  size={32} name="close" color={colors.snowWhite} />

      </TouchableHighlight>
    </View>
    </View>
    );
  }
}

var styles = StyleSheet.create({
  dimBackground: {
    flex: 1,
    position: "absolute",
    backgroundColor: colors.richBlack,
    opacity: .9,
    height: dimensions.height,
    width: dimensions.width
  },
  wrapper: {
    backgroundColor: "transparent",
    opacity: 1
  },
  slide1: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.accent,
    margin: dimensions.width * .08,
    marginTop: dimensions.height * .10,
    marginBottom: dimensions.height * .10,
    borderRadius: dimensions.width / 32.0,
    opacity: 1

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
