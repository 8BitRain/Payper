import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions, Modal} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Header, ProfilePic, Wallet, PhotoUploader} from '../../components'
import {colors} from '../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Button from 'react-native-button'
import {connect} from 'react-redux'
import * as dispatchers from '../Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  render() {
    return (
      <View style={styles.container}>

        { /* Header */ }
        <Header showTitle showBackButton title="My Profile" />

        { /* Name / Username */ }
        <View style={{justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.medGrey, paddingBottom: 15, paddingTop: 15}}>

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

          { /* Spacer */ }
          <View style={{height: 15}} />

          { /* Upload profile pic button */ }
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
        </View>

        { /* Wallet */ }
        <Wallet currentUser={this.props.currentUser} />

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
