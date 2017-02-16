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

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected
    }
  }

  componentDidMount() {
    console.log("Props", this.props);
  }
  /*Toggles betweens whether or not the row has been selected.
  * Helps determine which tags to send to the db.
  */
  toggleSelected(){
    //this.props.updateRow([{logo: this.props.logo, title: this.props.title, selected: true, tag: this.props.tag}]);
    if(this.state.selected){
      this.setState({selected: false});
    }
    if(this.state.selected == false){
      this.setState({selected: true})
    }
    //Update selected tags to send to firebase
    console.log("Row selected?: " + this.state.selected)
    this.props.updateSelectedTags(this.props.tag, true);

  }

  render() {
    return(
      <View>
       <TouchableHighlight
         activeOpacity={0.8}
         underlayColor={'green'}
         onPress={() => this.toggleSelected()}>
         <View style={styles.container}>
            {/** Where are images stored?
             /* iOS: Image.xcassets
             /* Android: android/app/src/main/res/drawable/
             **/
            }
           <Image source={{uri:this.props.logo}} style={styles.photo} />
           <Text style={styles.text}>{this.props.title}</Text>
           <Text style={styles.text}>{this.props.tag}</Text>
           <Text style={styles.text}>{this.state.selected ? "True" : "False"}</Text>
         </View>
       </TouchableHighlight>
     </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
})

module.exports = Row
