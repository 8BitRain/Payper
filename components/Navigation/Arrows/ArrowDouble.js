/**
  *     TODO DURING IMPLEMENTATION
  *     --------------------------
**/




// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Image} from "react-native";
import Button from "react-native-button";
import Entypo from "react-native-vector-icons/Entypo";


// Header styles
const styles = StyleSheet.create({
  // // Container for header elements
  // headerWrap: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   // backgroundColor: "#593F62",
  //   backgroundColor: "transparent",
  //   paddingTop: 30,
  //   paddingBottom: 10,
  //   flexDirection: "row"
  // },

  // Container for arrow buttons
  arrowWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  // Inline icon positioning
  iconWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonStyles: {
    borderWidth: 1,
    borderColor: "red"
  },

  // Icon sizing
  iconArrow: {
    margin: 30,
    width: 50,
    height: 50
  },
  iconCheck: {
    marginLeft: 15,
    marginRight: 15,
    width: 50,
    height: 50
  }
});


// Return a right arrow button
function getRightArrow(callback, dark) {
  return(
    <Button style={{borderColor: "red", borderWidth: 10}} onPress={() => {callback()}}>
      <Entypo style={styles.iconArrow} name="chevron-thin-right" size={36} color={(dark) ? "black" : "white"} />
    </Button>
  );
};

// Return a left arrow button
function getLeftArrow(callback, dark) {
  return(
    <Button onPress={() => {callback()}}>
      <Entypo style={styles.iconArrow} name="chevron-thin-left" size={36} color={(dark) ? "black" : "white"} />
    </Button>
  );
};

// Return a check button
function getCheck(callback) {
  return(
    <Button onPress={() => {callback()}}>
      <Image style={styles.iconCheck} source={require('./assets/check.png')} />
    </Button>
  );
};


/**
  *   Toolbar for the create account onboarding process
  *
  *   TODO: implement pagination functionality by passing props and stuff
  *         (for now, the third page is always filled in)
**/
class ArrowNav extends React.Component {
  constructor(props) {
    super(props);

    // Callback functions to be passed to getArrow()
    // this.onPressLeft = function() { console.log("-----  Pressed left arrow  -----") };
    // this.onPressRight = function() { console.log("-----  Pressed right arrow  -----") };

    // For testing, these will typically be passed as props
    // this.arrowNavProps = {
    //   leftArrow: true,
    //   rightArrow: true
    // };
    // this.arrowNavProps = this.props.arrowNavProps;
    // END For testing, these will typically be passed as props
  }
  render() {
    return(
      <View style={styles.arrowWrap}>
        { this.props.arrowNavProps.left ? getLeftArrow(this.props.callbackLeft, this.props.dark) : null }
        { this.props.arrowNavProps.right ? getRightArrow(this.props.callbackRight, this.props.dark) : null }
        { this.props.arrowNavProps.check ? getCheck(this.props.callbackCheck) : null }
      </View>
    );
  }
};

export default ArrowNav;
