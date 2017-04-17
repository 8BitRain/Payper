import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions, Modal} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Header, ProfilePic, Wallet, PhotoUploader} from '../../components'
import {deleteUser} from '../../helpers/lambda'
import {deleteAccountAlert} from '../../helpers/alerts'
import {stylizePhoneNumber} from '../../helpers/utils'
import {colors} from '../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Button from 'react-native-button'
import {connect} from 'react-redux'
import * as dispatchers from '../Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  },
  shadow: {
    shadowColor: colors.slateGrey,
    shadowOpacity: 0.7,
    shadowRadius: 1,
    shadowOffset: {height: 0, width: 0}
  }
})

class MyProfileModal extends React.Component {
  constructor(props) {
    super(props)

    this.deleteUser = this.deleteUser.bind(this)
  }

  deleteUser() {
    deleteAccountAlert({
      onConfirm: () => {
        deleteUser({token: this.props.currentUser.token})
        this.props.currentUser.destroy()
        Actions.Lander({type: 'reset'})
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Header */ }
        <Header showTitle showBackButton title="My Profile" />

        { /* Name / Username */ }
        <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 15, width: dims.width * 0.92}}>

          { /* Profile pic, name, username */ }
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ProfilePic currentUser={this.props.currentUser} size={58} />
            <View style={{width: 10}} />
            <View>
              <Text style={{fontSize: 24, color: colors.deepBlue}}>
                {`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}
              </Text>
              <Text style={{fontSize: 16, color: colors.accent}}>
                {this.props.currentUser.username}
              </Text>
            </View>
          </View>

          { /* Spacer
          <View style={{height: 15}} />
          */ }

          { /* Upload profile pic button
          <View style={[styles.shadow, {borderRadius: 4}]}>
            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={() => this.setState({photoUploaderModalIsVisible: true})}>
              <View style={{width: dims.width * 0.72, height: 40, flexDirection: 'row'}}>
                <View style={{flex: 0.2, backgroundColor: colors.lightGrey, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 4, borderBottomLeftRadius: 4}}>
                  <EvilIcons name={"camera"} size={28} color={colors.accent} />
                </View>
                <View style={{flex: 0.75, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 4, borderBottomRightRadius: 4}}>
                  <Text style={{fontSize: 16, fontWeight: '400', color: colors.snowWhite}}>
                    {"Upload Profile Picture"}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
          */ }
        </View>

        { /* Email */ }
        <View style={{paddingTop: 8, paddingBottom: 8, width: this.props.width, borderColor: colors.medGrey, borderBottomWidth: 1, paddingLeft: dims.width * 0.06, paddingRight: dims.width * 0.06}}>
          <View style={{width: dims.width * 0.88, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700'}}>
              {"Email"}
            </Text>
            <EvilIcons name={"envelope"} size={32} color={colors.accent} />
          </View>

          <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, alignItems: 'center', flexWrap: 'wrap'}}>
            {this.props.currentUser.decryptedEmail}
          </Text>
        </View>

        { /* Phone number */ }
        <View style={{paddingTop: 8, paddingBottom: 8, width: this.props.width, borderColor: colors.medGrey, borderBottomWidth: 1, paddingLeft: dims.width * 0.06, paddingRight: dims.width * 0.06}}>
          <View style={{width: dims.width * 0.88, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700'}}>
              {"Phone Number"}
            </Text>
            <Entypo name={"phone"} size={28} color={colors.accent} />
          </View>

          <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, alignItems: 'center', flexWrap: 'wrap'}}>
            {stylizePhoneNumber(this.props.currentUser.decryptedPhone).stylizedPhone}
          </Text>
        </View>

        { /* Wallet */ }
        <Wallet currentUser={this.props.currentUser} />

        { /* Delete account button */ }
        <View style={[styles.shadow, {borderRadius: 4, marginTop: 12}]}>
          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={colors.lightGrey}
            onPress={this.deleteUser}>
            <View style={{width: dims.width * 0.72, height: 40, borderRadius: 4, flexDirection: 'row', backgroundColor: colors.carminePink, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 16, fontWeight: '400', color: colors.snowWhite}}>
              {"Delete Account"}
              </Text>
            </View>
          </TouchableHighlight>
        </View>

        { /* Photo Uploader Modal
        <Modal animationType={"slide"} transparent={false} visible={this.state.photoUploaderModalIsVisible}>
          <Header
            showTitle
            showBackButton
            title="Upload Photo" />
          <PhotoUploader
            currentUser={this.props.currentUser}
            title={"PhotoUploader"}
            brand={"photo"}
            index={1}
            insteadOfUpload={(img) => this.setState({
              profilePic: img,
              photoUploaderModalIsVisible: false
            })} />
        </Modal>
        */ }

      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentUser: (input) => dispatch(dispatchers.setCurrentUser(input)),
    updateCurrentUser: (input) => dispatch(dispatchers.updateCurrentUser(input))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(MyProfileModal)
