import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions, Modal} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Header, ProfilePic, Wallet, Rating, DynamicList, BroadcastFeedSectionHeader, RatingInputModal} from '../../components'
import {AdminCard, CastCard, SubscriptionCard} from '../../components/Broadcasts'
import {BroadcastFeedEmptyState} from '../../components/EmptyStates'
import {Firebase} from '../../helpers'
import {deleteUser} from '../../helpers/lambda'
import {deleteAccountAlert} from '../../helpers/alerts'
import {handleUserBroadcasts, handleUserSubscribedBroadcasts} from '../../helpers/dataHandlers'
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
  listViewWrap: {
    flex: 1,
    width: dims.width,
    backgroundColor: colors.lightGrey,
    borderTopWidth: 1,
    borderColor: colors.medGrey
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

    this.state = {
      broadcasts: [],
      subscriptions: [],
      ratingModalVisible: false,
      canRate: (this.props.currentUser.rateableUsers) ? this.props.currentUser.rateableUsers[this.props.user.uid] : false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.rateableUsers !== this.props.currentUser.rateableUsers) {
      this.setState({canRate: nextProps.currentUser.rateableUsers[this.props.user.uid]})
    }
  }

  componentDidMount() {
    Firebase.get(`usernames/${this.props.user.username}`, (userData) => {
      let {uid} = userData
      this.setState({uid})

      Firebase.get(`userBroadcasts/${uid}`, (res) => {
        if (!res) return
        handleUserBroadcasts(res, (broadcasts) => this.setState({broadcasts}))
      })

      Firebase.get(`userSubscribedBroadcasts/${uid}`, (res) => {
        if (!res) return
        handleUserSubscribedBroadcasts(res, (subscriptions) => this.setState({subscriptions}))
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Header */ }
        <Header showTitle showBackButton title={`${this.props.user.firstName} ${this.props.user.lastName}`} />

        { /* Profile pic, name, username, rating */ }
        <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 5, paddingTop: 15, width: dims.width * 0.92}}>
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

          <TouchableHighlight
            activeOpacity={(this.state.canRate) ? 0.75 : 1}
            underlayColor={'transparent'}
            onPress={() => (this.state.canRate) ? this.setState({ratingModalVisible: true}) : null}>
            <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 4}}>
              <Rating
                avgRating={this.props.user.rating.avg}
                numRatings={this.props.user.rating.numRatings}
                containerStyles={{paddingBottom: 4}} />

              {(this.state.canRate)
                ? (this.props.currentUser.rateableUsers[this.props.user.uid].ratingGiven)
                  ? <Text>{`You gave ${this.props.user.firstName} ${this.props.currentUser.rateableUsers[this.props.user.uid].ratingGiven} stars.`}</Text>
                  : <Text>{"Press to rate."}</Text>
                : null }
            </View>
          </TouchableHighlight>
        </View>

        { /* Broadcasts */ }
        <View style={styles.listViewWrap}>
          <DynamicList
            refreshable={true}
            showPullToRefresh={true}
            shouldAnimateIn={false}
            data={{"Broadcasts": this.state.broadcasts, "Subscriptions": this.state.subscriptions}}
            renderRow={(rowData, sectionID, rowID) => {
              rowData.caster = this.props.user

              // If current user is owner of this cast show admin card
              if (rowData.casterID === this.props.currentUser.casterID)
                return <AdminCard broadcast={rowData} canViewCasterProfile={false} />

              // If current user is a member of this cast show subscription card
              if (rowData.members && rowData.members.indexOf(this.props.currentUser.uid >= 0))
                return <SubscriptionCard broadcast={rowData} canViewCasterProfile={false} />

              // Otherwise, show cast card
              else
                return <CastCard broadcast={rowData} canViewCasterProfile={false} />
            }}
            renderSectionHeader={(rowData, sectionID) => <BroadcastFeedSectionHeader sectionID={sectionID} />}
            renderEmptyState={() => <BroadcastFeedEmptyState />}
            renderFooter={() => <View style={{height: 25}} />} />
        </View>

        { /* Rating input modal */ }
        <RatingInputModal
          visible={this.state.ratingModalVisible}
          currentUser={this.props.currentUser}
          user={this.props.user}
          onSubmit={(rating) => this.setState({ratingModalVisible: false})}
          cancel={() => this.setState({ratingModalVisible: false})} />

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
