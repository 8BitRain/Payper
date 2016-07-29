// Dependencies
import React from 'react';
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableHighlight, ListView, RecyclerViewBackedScrollView } from 'react-native';

// Helpers
import * as Async from '../../helpers/Async';
import * as StringMaster5000 from '../../helpers/StringMaster5000';

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

    this.state = {
      user: {}
    };
  }


  /**
    *   Start listening to Firebase
  **/
  componentDidMount() {
    Async.get('user', (user) => {
      user = JSON.parse(user);

      // Store user in local states
      this.setState({user: user});
      var uid = user.uid;
      this.props.listen(['TestContacts/' + uid]);
    });
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


  _filterContacts(query) {
    var filtered = StringMaster5000.filterContacts(this.props.allContacts._dataBlob.s1, query);
    this.props.setFilteredContacts(filtered);
  }


  render() {
    return(
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex: 0.2, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[rowStyles.text], {color: '#000'}}>Who are you splitting with?</Text>
          <TextInput
            style={{height: 40, width: dimensions.width * 0.9, padding: 10, marginTop: 10, borderColor: '#000', borderRadius: 4, borderWidth: 1}}
            onChangeText={ (query) => this._filterContacts(query) }
            />
        </View>

        <View style={{flex: 0.8, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <ListView
            dataSource={(this.props.filteredContacts._dataBlob.s1.length > 0) ? this.props.filteredContacts : this.props.allContacts}
            renderRow={this._renderRow.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            enableEmptySections />
        </View>
      </View>
    );
  }
};

export default PredictiveSearchView;
