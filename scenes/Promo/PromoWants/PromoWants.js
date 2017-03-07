// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ListView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button'
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


class PromoWants extends React.Component {
  constructor(props) {
    super(props);

    //Reset datasource to null and displaylist to false if pulling from Firebase
    this.state = {
      dataSource: null,
      displayList: false,
      loadedFirebase: false,
      selectedTags: {
      },
      selectedNum: 0
    }
  }

  componentDidMount() {
    //this.formatRowData(servicesDB);
    this.listenerConfig = {
        endpoint: `SXSWServices`,
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


  updateSelectedTags(tag, selected){
    //Uncomment to get working
    this.state.selectedTags[tag] = selected;
    //let tags = this.state.selectedTags;
    //var index = this.state.selectedTags.indexOf({tag})

    console.log("Selected?: " + selected);
    console.log("Selected Num: " + this.state.selectedNum);

    this.setState(this.state);
    selected == true ? this.setState({selectedNum: this.state.selectedNum + 1}) : this.setState({selectedNum: this.state.selectedNum - 1});

  }

  handleContinuePress(){
    Actions.PromoRoulette({wantedTags: this.state.selectedTags});
  }

  _renderListView(){
    if(this.state.displayList){
      return(
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow={(data) => <Row {...data} updateSelectedTags={(tag, selected) => this.updateSelectedTags(tag, selected)} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
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
          <Button onPress={Actions.pop}>{"Back"}</Button>
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

module.exports = PromoWants
