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

    this.servicesStore = [];
    this.categoryStore = [];

    var categories = servicesDB;
    //Loop through categories
    for (var categoryKey in categories) {
      var category = categoryKey;
      this.categoryStore.push(category);
      var services = categories[categoryKey];

      //Loop through services
      for(var serviceKey in services){
        var service = serviceKey;
        var logo = services[service];
        var tag = services[service];

        //append title, selected, and category to each service obj.
        console.log("Service OBJ Initial: ", services);
        services[serviceKey]["selected"] = false;
        services[serviceKey]["title"] = service;
        services[serviceKey]["category"] = category;
        //Push manipulated object into datasource ready (readable) array
        this.servicesStore.push(services[service]);
        console.log("Service  OBJ Updated: ", services);
      }
    }

    console.log("Categories OBJ: + ", categories);
    console.log("Service Store", this.servicesStore);


    this.data = this.servicesStore;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(this.data),
      selectedTags: {},
      ownedTags:{},
      wantedTags:{},
      selectedNum: 0
    }
  }

  componentDidMount() {

  }

  formatData(data, categoryStore) {

    // Need somewhere to store our data
    const dataBlob = {};
    const sectionIds = [];
    const rowIds = [];

    //Loop through categories
    for(let sectionId = 0; sectionId < categoryStore.length; sectionId++ ){

      const category = categoryStore[sectionId];
      console.log("Category: " + category);

      //Get the services belonging to a certain category
      const services = data.filter((service) => service.category == category);
      console.log("Services", services);

      if(services.length > 0){
        // Add a section id to our array so the listview knows that we've got a new section

        sectionIds.push(sectionId);

        //This is what names the section
        dataBlob[sectionId] = {title: category};
        rowIds.push([]);

        // Loop over the services for the section
        for (let i = 0; i < services.length; i++) {
          // Create a unique row id for the data blob that the listview can use for reference
          const rowId = `${sectionId}:${i}`;
          console.log("Row_ID" + rowId);

          // Push the row id to the row ids array. This is what listview will reference to pull
          // data from our data blob
          rowIds[rowIds.length - 1].push(rowId);

          // Store the data we care about for this row
          console.log("Service: ", services[i]);
          dataBlob[rowId] = services[i];
        }
      }
    }
    return { dataBlob, sectionIds, rowIds };
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

  render() {
    return(
      <View style={styles.wrapper}>
        {/* HEADER*/}
        {/* CONTENT*/}
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow={(data) => <Row {...data} updateSelectedTags={(tag, selected, tagType) => this.updateSelectedTags(tag, selected, tagType)} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
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
