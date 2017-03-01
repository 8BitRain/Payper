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
      ownSelected: false,
      wantSelected: false,
      fallbackImageNeeded: false
    }
  }

  componentDidMount() {
    //console.log("Props", this.props);
  }
  /*Toggles betweens whether or not the row has been selected.
  * Helps determine which tags to send to the db.
  */
  toggleSelected(tagType){
    if(tagType == "want"){
      if(this.state.wantSelected){
        this.setState({wantSelected: false});
        this.props.updateSelectedTags(this.props.tag, false, tagType);
      }
      if(!this.state.wantSelected){
        this.setState({wantSelected: true});
        this.props.updateSelectedTags(this.props.tag, true, tagType);
      }
    }
    if(tagType == "own"){
      if(this.state.ownSelected){
        this.setState({ownSelected: false});
        this.props.updateSelectedTags(this.props.tag, false, tagType);
      }
      if(!this.state.ownSelected){
        this.setState({ownSelected: true});
        this.props.updateSelectedTags(this.props.tag, true, tagType);
      }
    }

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
         <View style={styles.container}>
            {/** Where are images stored?
             /* iOS: Image.xcassets
             /* Android: android/app/src/main/res/drawable/
             **/
            }
           {this._renderLogo()}
           <Text style={styles.text}>{this.props.title}</Text>

           <View style={styles.buttonContainer}>
             {/* want button */}
             <TouchableHighlight
               activeOpacity={0.8}
               underlayColor={'transparent'}
               onPress={() => this.toggleSelected("want")}>
               <View style={this.state.wantSelected ? styles.wantButtonActive : styles.wantButtonInactive}>
                 <Text style={styles.buttonText}>{"want"}</Text>
               </View>
             </TouchableHighlight>

             {/* own button*/}
             <TouchableHighlight
               activeOpacity={0.8}
               underlayColor={'transparent'}
               onPress={() => this.toggleSelected("own")}>
               <View style={this.state.ownSelected ? styles.ownButtonActive : styles.ownButtonInactive}>
                 <Text style={styles.buttonText}>{"own"}</Text>
               </View>
             </TouchableHighlight>
           </View>
         </View>
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
  buttonText: {
    fontSize: 16
  },
  buttonContainer:{
    flexDirection: "row",
    position: "absolute",
    left: dimensions.width * .59,
    top: 12
  },
  ownButtonActive: {
    padding: 10,
    borderRadius: 4,
    marginLeft: 16,
    backgroundColor: "green",
  },
  ownButtonInactive: {
    padding: 10,
    borderRadius: 4,
    marginLeft: 16,
    backgroundColor: colors.medGrey
  },
  wantButtonActive: {
    padding: 10,
    borderRadius: 4,
    marginLeft: 16,
    backgroundColor: "blue"
  },
  wantButtonInactive: {
    padding: 10,
    borderRadius: 4,
    marginLeft: 16,
    backgroundColor: colors.medGrey
  },
  photo: {
    height: 40,
    width: 40,
  },
})

module.exports = Row
