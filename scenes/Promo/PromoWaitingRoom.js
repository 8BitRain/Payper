import React from 'react'
import {View, StyleSheet, Text, Dimensions, Image} from 'react-native'
import {colors} from '../../globalStyles'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.snowWhite,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profilePicWrap: {
    width: dims.width * 0.37,
    height: dims.width * 0.37,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 9,
    overflow: 'hidden'
  }
})

class PromoWaitingRoom extends React.Component {
  render() {
    console.log(this.props.userData)

    return (
      <View style={styles.container}>

        { /* Profile pic */ }
        <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.profilePicWrap}>
            {(this.props.userData.profile_pic)
              ? <Image source={{uri: this.props.userData.profile_pic}} style={{width: dims.width * 0.37, height: dims.width * 0.37}} />
              : <View style={styles.profilePic} /> }
          </View>
        </View>

        { /* Welcome message */ }
        <View style={{flex: 0.6, width: dims.width * 0.85}}>
          <View style={styles.letterWrap}>
            <Text style={{fontSize: 22, fontWeight: '600', color: colors.accent, textAlign: 'left'}}>
              {`${this.props.userData.first_name},`}
            </Text>

            <View style={{height: 18}} />

            <Text style={{fontSize: 20, fontWeight: '400', color: colors.deepBlue}}>
              {`We're working hard on getting Payper out as quickly as possible. We'll notify you with your free subscription when we're ready to go!`}
            </Text>

            <View style={{height: 18}} />

            <Text style={{fontSize: 20, fontWeight: '500', color: colors.deepBlue, textAlign: 'left'}}>
              {`Sincerely,`}
            </Text>
            <Text style={{fontSize: 20, fontWeight: '500', color: colors.accent, textAlign: 'left'}}>
              {`The Payper Team`}
            </Text>
          </View>
        </View>

      </View>
    )
  }
}

module.exports = PromoWaitingRoom
