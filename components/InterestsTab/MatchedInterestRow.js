// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ListView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'


// Stylesheets
import {colors} from '../../globalStyles';

//Custom
const dimensions = Dimensions.get('window');
import { device } from '../../helpers'

class MatchedInterestRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  userDesire(want, own){
    if(!want && own){
      return "owns"
    }
    if(!own && want){
      return "wants"
    }
  }

  _renderActionButton(want, own){
    /* Send Notification Button (User owns service)*/
    if(!want && own){
      return(
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => console.log("Push notification to Notify User")}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{"Notify User"}</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
    {/* Start Casting Button (User wants service)*/}
    if(!own && want){
      return(
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => console.log("Start Casting With User")}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{"Start Cast"}</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
  }


  render() {
    console.log("Props: ", this.props);
    return(
      <View style={{ flexDirection: "row", height: 90, width: dimensions.width, alignItems: "center", backgroundColor: colors.medGrey}}>
          <Image source={{uri:this.props.img}} style={styles.photo}/>
          <Text style={styles.text}>{this.props.name +  " " + this.userDesire(this.props.wants, this.props.owns) + " " + this.props.service}</Text>
          {this._renderActionButton(this.props.wants, this.props.owns)}
      </View>
    );
  }

}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.medGrey
  },

  text: {
    marginLeft: 12,
    fontSize: 16
  },

  buttonText: {
    fontSize: 16,
    color: colors.snowWhite
  },

  buttonContainer:{
    flexDirection: "row",
    position: "absolute",
    left: dimensions.width * .64,
    top: 25
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginLeft: 16,
    backgroundColor: colors.carminePink
  },
  photo: {
    height: 64,
    width: 64,
    marginLeft: 8,
    borderRadius: 32
  },
})

module.exports = MatchedInterestRow
