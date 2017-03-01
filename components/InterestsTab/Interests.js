// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ListView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

//Routing
import {Actions} from 'react-native-router-flux';


// Stylesheets
import {colors} from '../../globalStyles';

//Custom
const dimensions = Dimensions.get('window');
import { device } from '../../helpers'


import Row from './Row'

import { Firebase } from '../../helpers'


let servicesDB = {
  'VideoStreaming': {
    'Netflix': {
      tag: '#Netflix',
      logo: 'Netflix-logo.jpg'
    },
    'Spotify': {
      tag: '#Spotify',
      logo: 'Netflix-logo.jpg'
    },
    'Hulu':{
      tag: '#Hulu',
      logo: 'Netflix-logo.jpg'
    },
  },
  'Game Subscriptions': {
    'Gamefly': {
      tag: '#Gamefly',
      logo: 'Netflix-logo.jpg'
    },
    'Pink Molly': {
      tag: '#Pink Molly',
      logo: 'Netflix-logo.jpg'
    },
  }
}

class Interests extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: null,
      displayList: false,
      loadedFirebase: false,
      selectedTags: {},
      ownedTags:{},
      wantedTags:{},
      selectedNum: 0
    }
  }

  componentDidMount() {
    this.listenerConfig = {
        endpoint: `Services`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          console.log("An update was made to fb", res);
          this.formatRowData(res);
      }
    }
    Firebase.listenTo(this.listenerConfig);
  }

  componentWillUnmount() {
    Firebase.stopListeningTo(this.listenerConfig);
  }

  formatRowData(rowData){
    var servicesStore = [];
    var categoryStore = [];

    var categories = rowData;
    //Loop through categories
    for (var categoryKey in categories) {
      var category = categoryKey;
      categoryStore.push(category);
      var services = categories[categoryKey];

      //Loop through services
      for(var serviceKey in services){
        var service = serviceKey;
        var logo = services[service];
        var tag = services[service];

        //append title, selected, and category to each service obj.
        //console.log("Service OBJ Initial: ", services);
        services[serviceKey]["selected"] = false;
        services[serviceKey]["title"] = service;
        services[serviceKey]["category"] = category;
        //Push manipulated object into datasource ready (readable) array
        if(typeof(services[service]) != 'string'){
          servicesStore.push(services[service]);
        }
        //console.log("Service  : ", services[service]);
      }
    }

    //console.log("Services: ", servicesStore);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({loadedFirebase: true, displayList: true, dataSource: ds.cloneWithRows(servicesStore)});

  }

  formatData(data, categoryStore) {
  }


  updateSelectedTags(tag, selected, tagType){
    if(tagType == "own"){
      console.log("Updating Owned Tags: ");
      this.state.ownedTags[tag] = selected;
    }
    if(tagType == "want"){
      console.log("Updating Wanted Tags: ");
      this.state.wantedTags[tag] = selected;
    }
    this.setState(this.state);
    console.log("Wanted Tags: ", this.state.wantedTags);
    console.log("Owned Tags: ", this.state.ownedTags);
  }

  handleContinuePress(){
    this.updateFirebaseTags();
    //Actions.Own();
  }

  updateFirebaseTags(){
    //console.log("Tags to Submit: ", this.state.selectedTags);
    //Loop through selected tags
    //Way to format the data
    /*data: {
      own: "val1, val2, val3",
      want: "val1, val2, val3"
    }*/
  }

  _renderListView(){
    if(this.state.displayList){
      return(
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow={(data) => <Row {...data} updateSelectedTags={(tag, selected, tagType) => this.updateSelectedTags(tag, selected, tagType)} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      );
    }
  }

  render() {
    return(
      <View style={styles.wrapper}>
        {/* HEADER*/}
        {/* CONTENT*/}
        {this._renderListView()}
        {/* FOOTER*/}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  buttonActiveText:{
    color: '#fff',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center"
  },
  buttonInactiveText:{
    color: 'black',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center"
  },
  buttonActive:{
    height: 50,
    width: dimensions.width,
    backgroundColor: colors.lightAccent,
    justifyContent: "center"
  },
  buttonInactive:{
    height: 50,
    width: dimensions.width,
    backgroundColor: colors.lightGrey,
    justifyContent: "center"
  },

  title: {
    color: "black",
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 25,
    marginRight: 15,
    paddingTop: device == "SE" ? 45 : device == "6" ? 20 : 95,
    lineHeight: device == "SE" ? 18 * 1.20 : device == "6" ? 35 * 1.20 : 22 * 1.20
  },
  description: {
    color: 'black',
    fontSize: 20,
    lineHeight: 20 * 1.20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: "left",
    fontWeight: "500"
  },
  container: {
   flex: 1,
   marginTop: 20,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
})

module.exports = Interests
