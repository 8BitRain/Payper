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

class Want extends React.Component {
  constructor(props) {
    super(props);
    //this.height = new Animated.Value(0);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.data = [{logo: 'Netflix-logo.jpg', title: "Netflix", selected: false, tag: "#Netflix"}, {logo: 'Netflix-logo.jpg', title: "Spotify", selected: false, tag: "#Spotify"}, {logo: 'Netflix-logo.jpg', title: "Hulu", selected: false, tag: "#Hulu"}];
    this.state = {
      dataSource: ds.cloneWithRows(this.data),
      selectedTags: {
        "#Netflix": false,
        "#Hulu": false,
        "#Spotify": false
      }
    }
  }

  componentDidMount() {

  }

  /*updateRow(rowData){
    console.log("RowData: ", rowData);
    this.data = this.data.concat(rowData);
    this.setState({dataSource:this.state.dataSource.cloneWithRows(this.data)});
  }*/

  updateSelectedTags(tag, selected){
    //this.setState({selectedTags[tag]: selected});
    //console.log("Selected Tags ", this.state.selectedTags);
    var updatedTag = Object.assign({}, this.state.selectedTags, {"#Netflix":selected});
    this.setState({"Netflix":updatedTag});
    console.log("Selected Tags State: ", this.state.selectedTags);
  }


  render() {
    console.log("DataSource", this.state.dataSource);
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
          renderRow={(data) => <Row {...data} updateSelectedTags={(tag, selected) => this.updateSelectedTags(tag, selected)}/>}
        />
        {/* FOOTER*/}
        <View>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => console.log("Continue Pressed")}
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
})

module.exports = Want
