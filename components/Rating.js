import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import Entypo from 'react-native-vector-icons/Entypo'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    width: dims.width
  },
  starsWrap: {
    flexDirection: 'row'
  },
  text: {
    fontSize: 14,
    color: colors.deepBlue,
    paddingLeft: 4
  }
})

class Rating extends React.Component {
  renderStars(rating) {
    let stars = []

    for (var i = 1; i <= 5; i++) stars.push(
      <View key={`star${i}`}>
        <Entypo name={(i <= rating) ? "star" : "star-outlined"} size={20} color={colors.alertYellow} />
      </View>
    )

    return stars
  }

  render() {
    return(
      <View style={[styles.container, this.props.containerStyles || {}]}>
        <View style={styles.starsWrap}>
          {this.renderStars(this.props.avgRating)}
        </View>
        <Text style={styles.text}>
          {`(${this.props.numRatings})`}
        </Text>
      </View>
    )
  }
}

module.exports = Rating
