import React from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {CastCard} from '../../components/Broadcasts'
import {colors} from '../../globalStyles'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.deepBlue,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

class CastCardMockup extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <CastCard broadcast={{
          amount: 10,
          casterID: 'id',
          createdAt: 1488505717125,
          detailsOfAgreement: "Deets",
          freq: "MONTHLY",
          memberLimit: 1,
          memberIDs: "",
          open: true,
          renewal: true,
          secret: "ENCRYPTED",
          tag: "Netflix",
          title: "Netflix Subscription",
          type: "World",
          caster: {
            profilePic: "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/17022387_1372970839390041_35582023932744800_n.jpg?oh=8b8e3db2a5ebf88078d02d6dd69b624e&oe=596C7172",
            username: "@Brady-Sheridan",
            firstName: "Brady",
            lastName: "Sheridan"
          }
        }} />
      </View>
    )
  }
}

module.exports = CastCardMockup
