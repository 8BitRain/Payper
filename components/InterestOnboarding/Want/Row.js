// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ListView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'


// Stylesheets
import {colors} from '../../../globalStyles';

//Custom
const dimensions = Dimensions.get('window');
import { device } from '../../../helpers'

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected,
      fallbackImageNeeded: false
    }
  }

  componentDidMount() {
    console.log("Props", this.props);
  }
  /*Toggles betweens whether or not the row has been selected.
  * Helps determine which tags to send to the db.
  */
  toggleSelected(){
    if(this.state.selected){
      this.setState({selected: false});
      this.props.updateSelectedTags(this.props.tag, false);
    }
    if(this.state.selected == false){
      this.setState({selected: true})
      this.props.updateSelectedTags(this.props.tag, true);
    }
    //Update selected tags to send to firebase
    //console.log("Row selected?: " + this.state.selected);

  }

  _renderLogo(){
    if(this.state.fallbackImageNeeded){
      return(
        <Image source={{uri:this.props.category + ".png"}} style={styles.photo} />
      );
    }
    if(!this.state.fallbackImageNeeded){
      return(
        <Image source={{uri:this.props.logo}}
               style={styles.photo}
               onError={() => this.setState({fallbackImageNeeded: true})}/>
      );
    }
  }

  render() {
    return(
      <View style={{flex: 1}}>
       <TouchableHighlight
         activeOpacity={0.8}
         underlayColor={'transparent'}
         onPress={() => this.toggleSelected()}>
         <View style={styles.container}>
            {/** Where are images stored?
             /* iOS: Image.xcassets
             /* Android: android/app/src/main/res/drawable/
             **/
            }
           {this._renderLogo()}
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
    backgroundColor: colors.lightGrey
  },
  rowSelected:{
    flex: 1,
    height: 10,
    width: dimensions.width,
    flexDirection: 'row',
    backgroundColor: 'green',
    opacity: .8
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
