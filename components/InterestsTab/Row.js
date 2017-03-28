// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions, StyleSheet, ScrollView, ListView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'

import MatchedInterestRow from './MatchedInterestRow'

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
      fallbackImageNeeded: false,
      displayList: false,
      miDataSource: null,
      servicesWithMatchedUsers: ["audible", "litbox"]
    }
  }

  componentDidMount() {
    //Load initial data source for user row
    /*let matchedUsers = [{name: "Ryder", wants:"none" , owns: "none" }, {name: "Sonny", wants:"none" , owns: "none"}, {name: "The Widow", wants:"none" , owns: "none"}];
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({miDataSource: ds.cloneWithRows(matchedUsers)});*/
  }

  getMatchedUsers(title){
    let matchedUsers;
    switch (title) {
      case "audible":
         matchedUsers = [{img: "sunny", name: "Sunny", wants:true , owns:false, service:"Audible"}, {img:"widow", name: "Minerva", wants:false , owns: true, service: "Audible"}, {img: "jacobee", name: "Jacobee",  service: "Audible", wants:false , owns: true}];
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({miDataSource: ds.cloneWithRows(matchedUsers), displayList: true});
        break;
      case "litbox":
         matchedUsers = [{img: "sunny", name: "Sunny", wants:true , owns:false, service:"Litbox"}, {img:"widow", name: "Minerva", wants:false , owns: true, service: "Litbox"}, {img: "jacobee", name: "Jacobee",  service: "Litbox", wants:false , owns: true}];
        const ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({miDataSource: ds2.cloneWithRows(matchedUsers), displayList: true});
        break;
      default:
        console.log("No users were found");
    }
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

  toggleDisplayList(toggle){
    if(toggle){
      //getMatchedUsers then displayList
      this.getMatchedUsers(this.props.title);
    } else {
      this.setState({displayList: toggle});
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

  _renderListView(){
    if(this.state.displayList){
      return(
        <ListView
          dataSource={this.state.miDataSource}
          renderRow={(data) => <MatchedInterestRow {...data}/>}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      );
    }
  }

  _renderMatchGist(){
    let hasMatchedUsers = false;
    for (var i = 0; i < this.state.servicesWithMatchedUsers.length;  i++) {
      if(this.props.title == this.state.servicesWithMatchedUsers[i]){
        hasMatchedUsers = true;
      }
    }
    if(hasMatchedUsers){
      return(
        <View style={styles.matchGistContainer}>
          <Text style={styles.gistText}>{"3 matches"}</Text>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.toggleDisplayList(this.state.displayList ? false : true)}>
            <View>
              <Text style={styles.seeMoreText}>{"see more"}</Text>
            </View>
          </TouchableHighlight>
        </View>
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
           <View style={styles.contentContainer}>
             {this._renderLogo()}
             <Text style={styles.text}>{this.props.title}</Text>
           </View>

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

         <View>
         {/* renders see more button and # matches */}
         { this._renderMatchGist()}
         </View>
         {/* Matched User Rows*/}
          <ScrollView>
            { this._renderListView() }
          </ScrollView>

     </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGrey
  },
  matchedUsersContainer:{
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    backgroundColor: "white"
  },
  matchGistContainer:{
    marginTop: -10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGrey
  },
  gistText:{
    fontSize: 18,
    fontWeight: "500",
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
    fontSize: 18,
    fontWeight: "bold"
  },
  infoText: {
    color: colors.snowWhite,
    marginLeft: 25,
    textAlign: "left",
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
  seeMoreText:{
    fontSize: 16,
    color: colors.accent
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
  contentContainer:{
    alignItems: "center",
    flexDirection: "row",
    marginTop: 12
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
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
})



module.exports = Row
