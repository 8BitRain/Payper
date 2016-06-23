import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";

var styles = StyleSheet.create({
    container: {
        flex: .5,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
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
});

class FacebookLogin extends React.Component {
    constructor(props) {
      super(props);
      this.destination = this.props.destination;
    }
    render(){
        return (
            <View style={styles.container}>
                <Button onPress={this.destination}>Continue with Facebook</Button>
            </View>
        );
    }
}

export default FacebookLogin;
