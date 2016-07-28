// Dependencies
import React from 'react';
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableHighlight, ListView, RecyclerViewBackedScrollView } from 'react-native';

const dimensions = Dimensions.get('window');

// Row styles
const rowStyles = StyleSheet.create({
  wrap: {
    height: 100,
    width: dimensions.width,
    padding: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bf3636',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#FFF',
  },
});

class PredictiveSearchView extends React.Component {
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


  _renderRow(data) {
    return(
      <View style={rowStyles.wrap}>
        <Text style={rowStyles.text}>Name: { data.first_name + " " + data.last_name }</Text>
        <Text style={rowStyles.text}>Username: { data.username }</Text>
        <Text style={rowStyles.text}>Img src: { (data.profile_pic) ? data.profile_pic : "no profile pic" }</Text>
        <Text style={rowStyles.text}>Type: { data.type }</Text>
      </View>
    );
  }


  render() {
    return(
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex: 0.2, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[rowStyles.text], {color: '#000'}}>Who are you splitting with?</Text>
          <TextInput
            style={{height: 40, width: dimensions.width * 0.9, padding: 10, marginTop: 10, borderColor: '#000', borderRadius: 4, borderWidth: 1}}
            onChangeText={ (text) => console.log(text) }
            />
        </View>

        <View style={{flex: 0.8, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[rowStyles.text, {color: '#000', paddingBottom: 10}]}>Empty: { this.props.empty.toString() }</Text>
          <ListView
            dataSource={this.props.contacts}
            renderRow={this._renderRow.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            enableEmptySections />
        </View>
      </View>
    );
  }
};

export default PredictiveSearchView;
