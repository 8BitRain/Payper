import React from 'react'
import {Firebase} from '../../helpers'
import {View, StyleSheet, Dimensions, Text} from 'react-native'
import {colors} from '../../globalStyles'
import {ProfilePic} from '../'
import {connect} from 'react-redux'
import * as dispatchers from '../../scenes/Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: dims.width * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.medGrey
  }
})

class DisputesFeedRow extends React.Component {
  constructor(props) {
    super(props)
    props.dispute.status = props.dispute.status.charAt(0).toUpperCase().concat(props.dispute.status.substring(1, props.dispute.length))
  }

  render() {
    return(
      <View style={styles.container}>
        <ProfilePic currentUser={this.props.dispute.caster} size={48} />

        <View style={{paddingLeft: 12}}>
          <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '600'}}>
            {this.props.dispute.title}
          </Text>
          <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '400'}}>
            {this.props.dispute.caster.username}
          </Text>
          <Text style={{color: colors.deepBlue, fontSize: 14, fontWeight: '400'}}>
            {`Status: ${this.props.dispute.status}`}
          </Text>
        </View>
      </View>
    )
  }
}

module.exports = DisputesFeedRow
