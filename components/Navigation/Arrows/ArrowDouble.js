// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Image} from 'react-native';
import Button from 'react-native-button';
import Entypo from 'react-native-vector-icons/Entypo';


// Arrow nav styles
const styles = StyleSheet.create({

  // Container for arrow buttons
  arrowWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCheck: {
    marginLeft: 15,
    marginRight: 15,
    width: 50,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});


// Return a right arrow button
function getRightArrow(callback, dark) {
  return(
    <Button style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderColor: "red", borderWidth: 10}} onPress={() => {callback()}}>
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
      <Entypo style={styles.iconCheck} name="check" size={36} color="white" />
    </Button>
  );
};


/**
  *   Toolbar for the create account onboarding process
**/
class ArrowNav extends React.Component {
  constructor(props) {
    super(props);
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
