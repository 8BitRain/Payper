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


  render() {
    return(
      <View style={{flex: 1}}>
         <View style={styles.container}>
          <Text>{"User Info"}</Text>
         </View>
     </View>
    );
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
