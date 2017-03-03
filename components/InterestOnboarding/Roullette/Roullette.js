// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ListView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

//Routing
import {Actions} from 'react-native-router-flux';


// Stylesheets
import {colors} from '../../../globalStyles';

//Custom
const dimensions = Dimensions.get('window');
import { device } from '../../../helpers'


//Firebase
import { Firebase } from '../../../helpers'

import {connect} from 'react-redux'
import * as dispatchers from '../../../scenes/Main/MainState'


class Roullette extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: null,
      cleanDataSource: null,
      displayList: false,
      selectedTags: {
      },
      selectedNum: 0
    }
  }

  componentDidMount() {
    });
  }



  handleContinuePress(){
    this.updateFirebaseTags();
    Actions.Own({wantedTags: this.state.selectedTags});
  }


  render() {
    return(
      <View style={styles.wrapper}>
        {/* HEADER*/}
        <View>
          <Text style={styles.title}>{"And your free subscription is.."}</Text>
        </View>
        {/* CONTENT*/}
        <View>
          {/* Roullette //Animated View with Animated images */}
          <View>
          </View>

          {/* Selected Roullette Item Name //Animated Text or View*/}
          <View>
            <Text></Text>
          </View>

          {/* ReRoll optionalText*/}
          <View>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => this.handleContinuePress()}
              style={styles.buttonActive}>
                  <Text style={styles.buttonActiveText}>{"Continue"}</Text>
            </TouchableHighlight>
          <View>
        </View>
        {/* FOOTER*/}
        <View>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.handleContinuePress()}
            style={ styles.buttonInactive}>
                <Text style={styles.buttonInactiveText}>{"Continue"}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  buttonActiveText:{
    color: '#fff',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center"
  },
  buttonInactiveText:{
    color: 'black',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center"
  },
  buttonActive:{
    height: 50,
    width: dimensions.width,
    backgroundColor: colors.lightAccent,
    justifyContent: "center"
  },
  buttonInactive:{
    height: 50,
    width: dimensions.width,
    backgroundColor: colors.lightGrey,
    justifyContent: "center"
  },

  title: {
    color: "black",
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 25,
    marginRight: 15,
    paddingTop: device == "SE" ? 45 : device == "6" ? 20 : 95,
    lineHeight: device == "SE" ? 18 * 1.20 : device == "6" ? 35 * 1.20 : 22 * 1.20
  },
  description: {
    color: 'black',
    fontSize: 20,
    lineHeight: 20 * 1.20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: "left",
    fontWeight: "500"
  },
  container: {
   flex: 1,
   marginTop: 20,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
})


module.exports = (Roullette)
