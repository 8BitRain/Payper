import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";

// Stylesheets
import colors from "../styles/colors";

var styles = StyleSheet.create({
    container: {
        flex: .5,
        justifyContent: "flex-start",
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
      backgroundColor: colors.icyBlue,
      width: 260,
      height: 35,
      borderRadius: 4,
      color: colors.white,
      paddingTop: 7,
      marginTop: 10,
    }
});


class GenericSignUp extends React.Component {
    constructor(props) {
      super(props);
      this.destination = this.props.destination;
    }
    render(){
        return (
            <View style={styles.container}>
                <Button style={styles.button} onPress={this.destination}>Sign Up</Button>
            </View>
        );
    }
}

export default GenericSignUp;
