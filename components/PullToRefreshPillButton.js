import React from 'react'
import {View, TouchableHighlight, Text, StyleSheet, Animated} from 'react-native'
import {colors} from '../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 2, paddingBottom: 2,
    paddingLeft: 4, paddingRight: 12,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
    shadowColor: colors.slateGrey,
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowOffset: {height: 0, width: 0}
  },
  text: {
    fontSize: 14,
    color: colors.deepBlue,
    fontWeight: '400'
  }
})

class PullToRefreshPillButton extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      opacity: new Animated.Value(0)
    }
  }

  componentWillMount() {
    Animated.timing(this.AV.opacity, {
      toValue: 1,
      duration: 300
    }).start()
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={this.props.onPress}>
        <Animated.View style={[styles.container, {opacity: this.AV.opacity}]}>
          <EvilIcons name={"chevron-up"} size={30} color={colors.accent} style={{marginTop: 2, overflow: 'hidden'}} />
          <Text style={styles.text}>{"Pull to Refresh"}</Text>
        </Animated.View>
      </TouchableHighlight>
    )
  }
}

module.exports = PullToRefreshPillButton
