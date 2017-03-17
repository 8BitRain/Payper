import React from 'react'
import {View, Text} from 'react-native'
import {colors} from '../../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

class SpotsAvailable extends React.Component {
  constructor(props) {
    super(props)
    this.members = props.broadcast.memberIDs.split(",")
    this.spotsAvailable = props.broadcast.memberLimit - this.members.length
  }

  renderSpotBubbles() {
    let arr = []

    for (var i = 0; i < this.props.broadcast.memberLimit; i++) {
      arr.push(
        <View
          key={i}
          style={{
            width: 17,
            height: 17,
            borderRadius: 10,
            marginRight: 4,
            backgroundColor: (this.members[i]) ? 'rgb(87, 85, 85)' : colors.medGrey
          }} />
      )
    }

    return(
      <View style={{flexDirection: 'row'}}>
        {arr}
      </View>
    )
  }

  render() {
    return(
      <View>
        {this.renderSpotBubbles()}
        <Text style={{color: colors.deepBlue, fontWeight: '400', fontSize: 16, paddingTop: 5}}>
          {`${this.spotsAvailable} spot${(this.spotsAvailable === 1) ? '' : 's'} available.`}
        </Text>
      </View>
    )
  }
}

module.exports = SpotsAvailable
