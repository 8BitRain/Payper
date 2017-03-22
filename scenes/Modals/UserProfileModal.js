import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions, Modal} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Header, ProfilePic, Wallet, Rating} from '../../components'
import {deleteUser} from '../../helpers/lambda'
import {deleteAccountAlert} from '../../helpers/alerts'
import {colors} from '../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
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

class UserProfileModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Header */ }
        <Header showTitle showBackButton title={`${this.props.user.firstName} ${this.props.user.lastName}`} />

        { /* Profile pic, name, username, rating */ }
        <View style={{justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.medGrey, paddingBottom: 5, paddingTop: 15, width: dims.width * 0.92}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ProfilePic currentUser={this.props.user} size={50} />
            <View style={{width: 10}} />
            <View>
              <Text style={{fontSize: 24, color: colors.deepBlue}}>
                {`${this.props.user.firstName} ${this.props.user.lastName}`}
              </Text>
              <Text style={{fontSize: 16, color: colors.accent}}>
                {this.props.user.username}
              </Text>
            </View>
          </View>

          <Rating avgRating={this.props.user.avgRating} numRatings={this.props.user.numRatings} />
        </View>

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

module.exports = connect(mapStateToProps, mapDispatchToProps)(UserProfileModal)
