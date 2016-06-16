/**
  *   NOT CURRENTLY IMPORTING THIS ANYWHERE, BUT I DIDN'T WANT TO DELETE THIS
  *   COMPONENT YET. CHECK CreateAccountView.js FOR FULL TOOLBAR IMPLEMENTATION.
**/

import React from 'react';
import {View, Text, TextInput, StyleSheet} from "react-native";
import Button from "react-native-button";

// Houses all styles for the create account onboarding toolbar
const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: "pink",
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: "row"
  },
  toolbarButton: {
    width: 50,
    color: "#fff",
    textAlign: "center"
  },
  toolbarTitle: {
    color: "#fff",
    textAlign: "center",
    flex: 1
  }
});

/**
  *   Toolbar for the create account onboarding process
  *
  *   TODO: implement pagination functionality by passing props and stuff
  *         (for now, the third page is always filled in)
**/
const Toolbar = React.createClass({
  render() {
    return(
      // <Provider>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarButton}>Prev</Text>
        <Text style={styles.toolbarTitle}>This is the title</Text>
        <Text style={styles.toolbarButton}>Next</Text>
      </View>
      // </Provider>
    );
  }
});

export default Toolbar;
