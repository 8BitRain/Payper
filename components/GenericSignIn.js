import React from 'react';
import {View, Text, StyleSheet, Dimensions} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";

// Stylesheets
import colors from "../styles/colors";
var dimensions = Dimensions.get('window');

var styles = StyleSheet.create({
    container: {
        flex: .5,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
    button: {
      backgroundColor: '#14D063',
      width: dimensions.width - 50,
      height: 50,
      paddingTop: 14.5,
      borderRadius: 4,
      color: colors.white,
      marginTop: 10,
    }
});


class GenericSignIn extends React.Component {
    constructor(props) {
      super(props);
      this.destination = this.props.destination;
    }
    render(){
        return (
            <View style={styles.container}>
                <Button style={styles.button} onPress={this.destination}>Sign In</Button>
            </View>
        );
    }
}

export default GenericSignIn;