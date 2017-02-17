// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ListView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'


// Stylesheets
import {colors} from '../../globalStyles';

//Custom
const dimensions = Dimensions.get('window');
import { device } from '../../helpers'

//Rows
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

class Want extends React.Component {
  constructor(props) {
    super(props);
    //this.height = new Animated.Value(0);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //How do I append selected to services?

    this.servicesStore = [];



    var categories = servicesDB;
    //Loop through categories
    for (var categoryKey in categories) {
      var category = categoryKey;
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

    this.state = {
      dataSource: ds.cloneWithRows(this.data),
      selectedTags: {
      }
    }
  }

  componentDidMount() {

  }

  updateSelectedTags(tag, selected){
    this.state.selectedTags[tag] = selected;
    this.setState(this.state);
  }

  updateFirebaseTags(){
    console.log("Tags to Submit: ", this.state.selectedTags);
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
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow={(data) => <Row {...data} updateSelectedTags={(tag, selected) => this.updateSelectedTags(tag, selected)} />}
        />
        {/* FOOTER*/}
        <View>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => this.updateFirebaseTags()}
          style={{height: 50, width: dimensions.width, backgroundColor: colors.lightAccent, justifyContent: "center"}}>
              <Text style={styles.buttonText}>{"Continue"}</Text>
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

  buttonText:{
    color: '#fff',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center"
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
