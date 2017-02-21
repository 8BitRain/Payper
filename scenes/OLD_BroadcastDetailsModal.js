import React from 'react'
import {View, Text, StyleSheet, Platform, StatusBar, TouchableHighlight, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Header} from '../components'
import {colors} from '../globalStyles'
import {formatFrequency} from '../helpers/utils'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 27 : 7
  },
  row: {
    width: dims.width * 0.85,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    shadowColor: colors.slateGrey,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  title: {
    fontSize: 22,
    color: colors.deepBlue
  },
  username: {
    fontSize: 18,
    color: colors.accent
  },
  joinButton: {
    padding: 8,
    paddingLeft: 20, paddingRight: 20,
    backgroundColor: colors.lightGrey,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 5
  },
  joinText: {
    fontSize: 20,
    color: colors.deepBlue
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 27 : 7,
    paddingLeft: 12
  },
  optionsButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 32 : 12,
    paddingRight: 22
  }
})

class BroadcastDetailsModal extends React.Component {
  constructor(props) {
    super(props)
    this.spotsAvailable = props.memberLimit - props.memberIDs.split(",").length
    this.showOptions = this.showOptions.bind(this)
  }

  showOptions() {
    alert("TODO: Implement cross platform action sheets")
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />

        { /* Back button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={Actions.pop}
          style={styles.backButton}>
          <EvilIcons name={"chevron-left"} size={45} color={colors.maastrichtBlue} />
        </TouchableHighlight>

        { /* Options button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={this.showOptions}
          style={styles.optionsButton}>
          <Entypo name={"dots-three-horizontal"} size={22} color={colors.maastrichtBlue} />
        </TouchableHighlight>

        { /* Icon */ }
        <View style={styles.icon}>
          <FontAwesome name={"tv"} size={26} color={colors.deepBlue} style={{backgroundColor: 'transparent'}} />
        </View>
        <View style={{height: 18}} />

        { /* Title */ }
        <Text style={styles.title}>{this.props.title}</Text>

        { /* Broadcast owner's username */ }
        <Text style={styles.username}>{this.props.caster.username}</Text>
        <View style={{height: 18}} />

        { /* Amount, frequency, spot availability, join button */ }
        <View style={styles.row}>
          <View>
            <Text style={{fontSize: 16}}>
              <Text style={{color: colors.gradientGreen}}>{`$${this.props.amount}`}</Text>
              {" per "}
              <Text style={{color: colors.dodgerBlue}}>{formatFrequency(this.props.frequency)}</Text>
            </Text>
            <Text style={{fontSize: 16}}>
              {`${this.spotsAvailable} spot${(this.spotsAvailable === 1) ? '' : 's'} available.`}
            </Text>
          </View>

          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={'transparent'}
            onPress={() => alert("test")}>
            <View style={styles.joinButton}>
              <Text style={styles.joinText}>{"Join"}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{height: 18}} />

        { /* Memo */ }
        <View style={{width: dims.width * 0.85}}>
          <Text style={styles.memoTitle}>{"Memo"}</Text>
          <Text style={styles.memoBody}>{this.props.memo}</Text>
        </View>
        <View style={{height: 18}} />

        { /* Hidden info */ }
        <View style={{width: dims.width * 0.85}}>
          <Text style={styles.memoTitle}>{"Hidden Info"}</Text>
          <Text style={styles.memoBody}>{this.props.hiddenInfo}</Text>
        </View>
      </View>
    )
  }
}

module.exports = BroadcastDetailsModal
