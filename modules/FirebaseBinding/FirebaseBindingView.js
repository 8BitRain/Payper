// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as Firebase from '../../services/Firebase';

class FirebaseBindingView extends React.Component {
  constructor(props) {
    super(props);

    this.activeListeners = [];
  }

  /**
    *   Set up listeners
  **/
  componentDidMount() {
    Firebase.listenToTest((snapshot) => {
      this.activeListeners.push('FirebaseBindingTest');
      this.props.setTest(snapshot.test);
    });
  }

  componentWillUnmount() {
    Firebase.stopListening(this.activeListeners);
  }

  render() {
    return(
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontFamily: 'Roboto', color: 'black', fontSize: 16}}>
          Test value: { this.props.test }
        </Text>
        <TouchableHighlight onPress={() => this.props.setTest("1")}><Text>test=1</Text></TouchableHighlight>
        <TouchableHighlight onPress={() => this.props.setTest("2")}><Text>test=2</Text></TouchableHighlight>
        <TouchableHighlight onPress={() => this.props.setTest("3")}><Text>test=3</Text></TouchableHighlight>
      </View>
    );
  }
};

export default FirebaseBindingView;
