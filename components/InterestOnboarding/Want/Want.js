// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ListView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

//Routing
import {Actions} from 'react-native-router-flux';


// Stylesheets
import {colors} from '../../../globalStyles';

//Custom
const dimensions = Dimensions.get('window');
import { device } from '../../../helpers'


//Rows
import Row from './Row'
import SectionHeader from './SectionHeader'

//Firebase
import { Firebase } from '../../../helpers'



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

class Want extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: null,
      cleanDataSource: null,
      displayList: false,
      selectedTags: {
      },
      selectedNum: 0
    }
  }

  componentDidMount() {
    Firebase.getServices((cb) => {
      console.log("Services pulled from Firebase: ", cb);
      var categories = cb;
      let servicesStore = [];
      let categoryStore = [];
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
          console.log("Service OBJ Initial: ", services);
          services[serviceKey]["selected"] = false;
          services[serviceKey]["title"] = service;
          services[serviceKey]["category"] = category;
          //Push manipulated object into datasource ready (readable) array
          servicesStore.push(services[service]);
          console.log("Service  OBJ Updated: ", services);
        }
      }

      //Set up RowData and SectionData
      const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
      const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];

      //DS with section headers
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
        getSectionData,
        getRowData,
      });

      const { dataBlob, sectionIds, rowIds } = this.formatData(servicesStore, categoryStore);

      //Update state
      //Note cleanDataSource is created to pass an un-edited datasource to the "Own" portion of Interest Onboarding
      this.setState({displayList: true, dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds), cleanDataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)})
    });
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


  updateSelectedTags(tag, selected){
    this.state.selectedTags[tag] = selected;
    console.log("Selected?: " + selected);
    console.log("Selected Num: " + this.state.selectedNum);

    this.setState(this.state);
    selected == true ? this.setState({selectedNum: this.state.selectedNum + 1}) : this.setState({selectedNum: this.state.selectedNum - 1});


  }

  handleContinuePress(){
    this.updateFirebaseTags();
    Actions.Own();
  }

  updateFirebaseTags(){
    console.log("Tags to Submit: ", this.state.selectedTags);
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
          renderRow={(data) => <Row {...data} updateSelectedTags={(tag, selected) => this.updateSelectedTags(tag, selected)} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
        />
      );
    }
  }

  render() {
    return(
      <View style={styles.wrapper}>
        {/* HEADER*/}
        <View>
          <Text style={styles.title}>{"Customize your experience"}</Text>
          <Text style={styles.description}>{"Please select 3 or more services you would like."}</Text>
        </View>
        {/* CONTENT*/}
        { this._renderListView()}
        {/* FOOTER*/}
        <View>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => this.handleContinuePress()}
          style={this.state.selectedNum >= 3 ? styles.buttonActive : styles.buttonInactive}>
              <Text style={this.state.selectedNum >= 3 ? styles.buttonActiveText : styles.buttonInactiveText}>{"Continue"}</Text>
        </TouchableHighlight>
        </View>
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

module.exports = Want
