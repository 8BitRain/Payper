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
      wantSelected: false
    }
  }

  componentDidMount() {
    console.log("Props", this.props);
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

  render() {
    return(
      <View>
         <View style={styles.container}>
            {/** Where are images stored?
             /* iOS: Image.xcassets
             /* Android: android/app/src/main/res/drawable/
             **/
            }
           <Image source={{uri:this.props.logo}} style={styles.photo} />
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
    borderRadius: 20,
  },
})

module.exports = Row
