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
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => console.log("Push notification to Notify User")}>
          <View style={{}}>
            <Text style={styles.buttonText}>{"Notify User"}</Text>
          </View>
        </TouchableHighlight>
      );
    }
    {/* Start Casting Button (User wants service)*/}
    if(!own && want){
      return(
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => console.log("Start Casting With User")}>
          <View>
            <Text style={styles.buttonText}>{"Start Cast"}</Text>
          </View>
        </TouchableHighlight>
      );
    }
  }


  render() {
    console.log("Props: ", this.props);
    return(
      <View style={{flex: 1, flexDirection: "row", height: 90}}>
          <Text>{this.props.name +  " " + this.userDesire(this.props.wants, this.props.owns) + " " + "service"}</Text>
          {this._renderActionButton(this.props.wants, this.props.owns)}
      </View>
    );
  }

}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGrey
  },

  rowSelected:{
    flex: 1,
    height: 10,
    width: dimensions.width,
    flexDirection: 'row',
    backgroundColor: 'green',
    opacity: .8
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  buttonText: {
    fontSize: 16
  },
  buttonContainer:{
    flexDirection: "row",
    position: "absolute",
    left: dimensions.width * .59,
    top: 12
  },
  photo: {
    height: 40,
    width: 40,
  },
})

module.exports = MatchedInterestRow
