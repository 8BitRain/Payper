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


//Firebase
import { Firebase } from '../../../helpers'

import {connect} from 'react-redux'
import * as dispatchers from '../../../scenes/Main/MainState'


class Roullette extends React.Component {
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
    console.log("Current User", this.props);
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



  handleContinuePress(){
    this.updateFirebaseTags();
    Actions.Own({wantedTags: this.state.selectedTags});
  }


  render() {
    return(
      <View style={styles.wrapper}>
        {/* HEADER*/}
        <View>
          <Text style={styles.title}>{"And your free subscription is.."}</Text>
        </View>
        {/* CONTENT*/}
        <View>
          {/* Roullette //Animated View with Animated images */}
          <View>
          </View>

          {/* Selected Roullette Item Name //Animated Text or View*/}
          <View>
            <Text></Text>
          </View>

          {/* ReRoll optionalText*/}
          <View>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => this.handleContinuePress()}
              style={this.state.selectedNum >= 3 ? styles.buttonActive : styles.buttonInactive}>
                  <Text style={this.state.selectedNum >= 3 ? styles.buttonActiveText : styles.buttonInactiveText}>{"Continue"}</Text>
            </TouchableHighlight>
          <View>
        </View>
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


module.exports = (Roullette)
