// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ListView, Modal } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {Actions} from 'react-native-router-flux';


// Stylesheets
import {colors} from '../../../globalStyles';

//Custom
const dimensions = Dimensions.get('window');
import { device } from '../../../helpers'

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wantSelected: false,
      infoSelected: false,
      fallbackImageNeeded: true,
      modalOpened: false
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
        this.props.updateSelectedTags(this.props.tag, false, this.props.category);
      }
      if(!this.state.wantSelected){
        this.setState({wantSelected: true});
        this.props.updateSelectedTags(this.props.tag, true, this.props.category);
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
        <Image source={{uri:this.props.tag}}
               style={styles.photo}
               onError={() => this.setState({fallbackImageNeeded: true})}/>
      );
    }
  }

  _renderInfoModal(){
    return(
      <View style={styles.wrapper2}>
           <View style={{marginTop: 15, justifyContent: "center", alignItems: "center"}}>
             {this._renderLogo()}
             <Text style={styles.modalTitle}>{this.props.displayName}</Text>
           </View>

           <View style={{marginTop: 5}}>
            <Text style={styles.infoText}>{this.props.info}</Text>
           </View>

           <View style={{flex: 1, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden"}}>
             <TouchableHighlight
               activeOpacity={0.8}
               underlayColor={'transparent'}
               onPress={() => {this.toggleTooltip(false)}}
               style={{height: 50, width: dimensions.width * .84, backgroundColor: colors.lightAccent, justifyContent: "center"}}>
                   <View style={{flexDirection: "row", justifyContent: "center", width: dimensions.width * .84}}>
                     <Text style={styles.modalButtonText}>{"Okay"}</Text>
                   </View>
             </TouchableHighlight>
           </View>
     </View>
    );
  }

  toggleTooltip(toggle){
    this.setState({modalOpened: toggle });
  }

  render() {
    return(
      <View style={{flex: 1}}>

        <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.modalOpened}>
          { this._renderInfoModal()}
        </Modal>

         <View style={styles.container}>
            {/** Where are images stored?
             /* iOS: Image.xcassets
             /* Android: android/app/src/main/res/drawable/
             **/
            }
           {this._renderLogo()}
           <Text style={styles.text}>{this.props.displayName}</Text>

           <View style={styles.buttonContainer}>
             {/* want button */}
             <TouchableHighlight
               activeOpacity={0.8}
               underlayColor={'transparent'}
               onPress={() => this.toggleSelected("want")}>
               <View style={this.state.wantSelected ? styles.wantButtonActive : styles.wantButtonInactive}>
                 <Text style={this.state.wantSelected ? styles.wantButtonActiveText : styles.wantButtonInactiveText}>{"want"}</Text>
               </View>
             </TouchableHighlight>

             {/* info button*/}
             <TouchableHighlight
               activeOpacity={0.8}
               underlayColor={'transparent'}
               onPress={() => {this.toggleTooltip(true)}}>
               <View style={this.state.infoSelected ? styles.infoButtonActive : styles.infoButtonInactive}>
                 <Text style={styles.buttonText}>{"info"}</Text>
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
  wrapper2: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.accent,
    margin: dimensions.width * .12,
    marginTop: dimensions.height * .25,
    marginBottom: dimensions.height * .25,
    borderRadius: dimensions.width / 32.0,
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
  infoText: {
    color: colors.snowWhite,
    marginLeft: 12,
    fontSize: 18,
    lineHeight: device == "SE" ? 18 : device == "6" ? 18 : 18,
    fontWeight: "500",
    lineHeight: device == "SE" ? Math.round(18 * 1.20) : device == "6" ? Math.round(18 * 1.20) : Math.round(18 * 1.20),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.snowWhite
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500"
  },
  modalButtonText:{
    color: '#fff',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center"
  },
  buttonContainer:{
    flexDirection: "row",
    position: "absolute",
    left: dimensions.width * .59,
    top: 12
  },
  infoButtonActive: {
    padding: 10,
    borderRadius: 4,
    marginLeft: 16,
    backgroundColor: "green",

  },
  infoButtonInactive: {
    padding: 10,
    borderRadius: 4,
    marginLeft: 16,
    backgroundColor: colors.medGrey,

  },
  wantButtonActive: {
    padding: 10,
    borderRadius: 4,
    marginLeft: 16,
    backgroundColor: colors.carminePink
  },
  wantButtonInactive: {
    padding: 10,
    borderRadius: 4,
    marginLeft: 16,
    backgroundColor: colors.medGrey
  },
  wantButtonActiveText: {
    fontSize: 16,
    color: colors.snowWhite,
    fontWeight: "500"
  },
  wantButtonInactiveText: {
    fontSize: 16,
    color: "black",
    fontWeight: "500"
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 12
  },
})

module.exports = Row
