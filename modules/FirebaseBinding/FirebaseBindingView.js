// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as Firebase from '../../services/Firebase';

class FirebaseBindingView extends React.Component {
  constructor(props) {
    super(props);
  }


  /**
    *   Start listening to Firebase
  **/
  componentDidMount() {
    this.props.listen(this.props.activeFirebaseListeners);
  }


  /**
    *   Stop listening to Firebase
  **/
  componentWillUnmount() {
    this.props.stopListening(this.props.activeFirebaseListeners);
  }


  render() {

    var valueOneTemp = "",
        valueTwoTemp = "";

    return(
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontFamily: 'Roboto', color: 'black', fontSize: 16}}>
          valueOne == { this.props.valueOne }
        </Text>
        <Text style={{fontFamily: 'Roboto', color: 'black', fontSize: 16}}>
          valueTwo == { this.props.valueTwo }
        </Text>
      </View>
    );
  }
};

export default FirebaseBindingView;
