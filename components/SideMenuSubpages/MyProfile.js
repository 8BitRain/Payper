import React from 'react'
import { View, Text, Image, ListView, RecyclerViewBackedScrollView, Dimensions, TouchableHighlight, Alert, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { FBLoginManager } from 'NativeModules'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {PhotoUploader} from '../'
let dims = Dimensions.get('window')
let imageDims = { width: 56, height: 56 }
import { colors } from '../../globalStyles'

class MyProfile extends React.Component {
  constructor(props) {
    super(props)

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = {
      rows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections({}),
      modalVisible: false,
      optimisticallyRenderedImage: null
    }
  }

  deleteAccount() {
    var { currentUser } = this.props

    let message = "Are you sure you'd like to delete your account? This can't be undone."
    Alert.alert("Wait!", message, [
      {text: 'Cancel', onPress: () => null, style: 'cancel'},
      {text: 'Yes', onPress: () => confirm()},
    ])

    function confirm() {
      FBLoginManager.logOut()
      Actions.pop()
      Actions.LandingScreenViewContainer()
      currentUser.delete()
    }
  }

  componentDidMount() {
    let rows = this.generateRowData(this.props.currentUser)
    this.setState({rows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(rows)})
  }

  generateRowData(currentUser) {
    let rows = {
      "Profile Details": [
        {key: "Display Name", val: currentUser.first_name + " " + currentUser.last_name},
        {key: "Username", val: currentUser.username},
        {key: "Email", val: currentUser.decryptedEmail},
        {key: "Phone Number", val: currentUser.decryptedPhone},
        {key: "Delete my account", val: "asdf"}
      ]
    }

    return rows
  }

  renderSectionHeader(sectionData, sectionTitle) {
    if (sectionTitle.length === 0) {
      return(
        <View style={{height: 0}} />
      )
    } else {
      return(
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 8, backgroundColor: colors.medGrey}}>
          <Text style={{color: colors.deepBlue}}>{ sectionTitle }</Text>
        </View>
      )
    }
  }

  renderRow(params) {
    let { key, val } = params

    if (key === "Delete my account") {
      return(
        <TouchableHighlight activeOpacity={0.8} underlayColor={'transparent'}
          onPress={() => this.deleteAccount()}>
          <View style={{flexDirection: 'column', borderColor: colors.slateGrey, borderBottomWidth: 1.0}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
              <Text style={{color: colors.deepBlue}}>
                { key }
              </Text>
              <EvilIcons name={"trash"} color={colors.carminePink} size={26} />
            </View>
          </View>
        </TouchableHighlight>
      )
    } else {
      return(
        <View style={{flexDirection: 'column', borderColor: colors.slateGrey, borderBottomWidth: 1.0}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
            <Text style={{color: colors.deepBlue}}>
              { key }
            </Text>
            <Text style={{color: colors.deepBlue}}>
              { val }
            </Text>
          </View>
        </View>
      )
    }
  }

  togglePhotoUploader(visible){
    this.setState({
      modalVisible: visible
    })
  }

  setOptimisticallyRenderedImage(url){
    this.setState({
      optimisticallyRenderedImage: url
    });
    console.log("setOptimisticallyRenderedImage FIRED");
  }

  _renderPicWithInitials(initials){
    return(
      <View style={styles.imageWrap}>
          { /*Profile pic with initials*/ }
          <TouchableHighlight activeOpacity={0.8} underlayColor={'transparent'}
            style={{position: "absolute", top: 0}}
            onPress={() => this.togglePhotoUploader(true)}>
            <View style={{flex: 1, marginBottom: 10}}>
              <View style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
                  {initials}
                </Text>
              </View>
              <Text style={{color: colors.accent, fontSize: 14, fontWeight: '200', textAlign: "center", backgroundColor: "transparent", width: 100, alignSelf: 'center', marginTop: 5}}>
                {"add photo"}
              </Text>
            </View>
          </TouchableHighlight>
      </View>
    )
  }

  _renderProfilePic(profile_pic){
    return(
      <View style={styles.imageWrap}>
          { /*Profile pic with initials*/ }
          <TouchableHighlight activeOpacity={0.8} underlayColor={'transparent'}
            style={{position: "absolute", top: 0}}
            onPress={() => this.togglePhotoUploader(true)}>
            <View style={{flex: 1, marginBottom: 10}}>
            {this.state.optimisticallyRenderedImage ? <Image style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2}} source={{uri: this.state.optimisticallyRenderedImage}} /> :
               <Image style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2}} source={{uri: profile_pic}} />}
              <Text style={{color: colors.accent, fontSize: 14, fontWeight: '200', textAlign: "center", backgroundColor: "transparent", width: 100, alignSelf: 'center', marginTop: 5}}>
                {"change photo"}
              </Text>
            </View>
          </TouchableHighlight>
      </View>
    )
  }

  render() {
    let { first_name, last_name, username, profile_pic } = this.props.currentUser
    let name = first_name + " " + last_name
    let initialsBuffer = name.split(" ").map((name) => name.charAt(0))
    let initials = initialsBuffer.join("")

    return(
      <View style={styles.wrap}>

        { /* Header */ }
        <View style={{flexDirection: 'column', alignItems: 'center', paddingBottom: 15}}>
          <View style={{marginBottom: 15}}>
            { console.log("Profile_Pic Url:", profile_pic)}
            {(profile_pic)
              ? this._renderProfilePic(profile_pic)
              : this._renderPicWithInitials(initials) }
          </View>
          <Text style={{color: colors.deepBlue, fontSize: 22, fontWeight: '200', paddingTop: 8, textAlign: 'center', backgroundColor: 'transparent'}}>
            {name}
          </Text>
          <Text style={{color: colors.accent, fontSize: 16, fontWeight: '200', paddingTop: 4, textAlign: 'center', backgroundColor: 'transparent'}}>
            {username}
          </Text>
        </View>

        { /* Profile details */ }
        <ListView
          style={{width: dims.width, backgroundColor: 'transparent'}}
          dataSource={this.state.rows}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderFooter={() => <View style={{height: 90}} />}
          enableEmptySections />

          { /*Photo Uploader Modal*/ }
          <Modal
           animationType={"slide"}
           transparent={false}
           visible={this.state.modalVisible}>
           <View style={{overflow: 'hidden'}}>
               <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
               <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
                 <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
                   {"Photo Upload"}
                 </Text>

                 <TouchableHighlight
                   activeOpacity={0.75}
                   underlayColor={'transparent'}
                   style={{position: 'absolute', top: 0, left: 0, bottom: 0, padding: 14, paddingTop: 30, justifyContent: 'center'}}
                   onPress={() => this.togglePhotoUploader(false)}>
                   <EvilIcons name={"close"} color={colors.snowWhite} size={24} />
                 </TouchableHighlight>
               </View>
             </View>
           <PhotoUploader
           toggleModal={(value) => this.togglePhotoUploader(value)}
           setOptimisticallyRenderedImage={(url) => this.setOptimisticallyRenderedImage(url)}
           title={"PhotoUploader"}
           brand={"photo"} index={1} {...this.props}/>
          </Modal>

      </View>


    )
  }
}

const styles = {
  wrap: {
    backgroundColor: colors.snowWhite,
    paddingTop: 20,
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  imageWrap: {
    width: imageDims.width,
    height: imageDims.height,
    borderRadius: imageDims.width / 2,
    shadowColor: colors.slateGrey,
    shadowOpacity: 1.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
}

module.exports = MyProfile
