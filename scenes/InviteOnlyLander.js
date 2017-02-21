import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {setInAsyncStorage} from '../helpers/asyncStorage'
import {colors} from '../globalStyles'
import Button from 'react-native-button'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.snowWhite,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'red',
  }
})

class InviteOnlyLander extends React.Component {
  grantAccess() {
    setInAsyncStorage('hasAccess', 'yes')
  }

  revokeAccess() {
    setInAsyncStorage('hasAccess', '')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{'Invite Only Lander'}</Text>
        <Button onPress={() => this.grantAccess()}>
          {'Grant Access'}
        </Button>
        <Button onPress={() => this.revokeAccess()}>
          {'Revoke Access'}
        </Button>
      </View>
    )
  }
}

module.exports = InviteOnlyLander
