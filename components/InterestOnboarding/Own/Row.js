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
      switch (this.props.category) {
        case "Books":
          return(<Ionicons name={"ios-book-outline"} size={32}/>);
          break;
        case "Education":
          return(<Ionicons name={"ios-school-outline"} size={32}/>);
          break;
        case "Exercise":
          return(<Ionicons name={"md-heart"} size={32}/>);
          break;
        case "FoodDelivery":
          return(<Ionicons name={"md-restaurant"} size={32}/>);
          break;
        case "Gaming":
          return(<Ionicons name={"ios-game-controller-b-outline"} size={32}/>);
          break;
        case "LiveTv":
          return(<Ionicons name={"md-desktop"} size={32}/>);
          break;
        case "MusicStreaming":
          return(<Ionicons name={"ios-musical-notes"} size={32}/>);
          break;
        case "News":
          return(<Ionicons name={"logo-rss"} size={32}/>);
          break;
        case "Sports":
          return(<Ionicons name={"md-american-football"} size={32}/>);
          break;
        case "VideoStreaming":
          return(<Ionicons name={"logo-youtube"} size={32}/>);
          break;
      }
      return(
        <Ionicons name={"md-heart"} size={32}/>
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
