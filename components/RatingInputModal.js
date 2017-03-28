import React from 'react'
import {View, Text, Modal, TouchableHighlight, TouchableWithoutFeedback, StyleSheet, Dimensions, Animated, Easing} from 'react-native'
import {ContinueButton} from './'
import {colors} from '../globalStyles'
import {rateUser} from '../helpers/lambda'
import Entypo from 'react-native-vector-icons/Entypo'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.88)'
  },
  promptWrap: {
    width: dims.width * 0.7,
    padding: 10
  },
  starsWrap: {
    flexDirection: 'row'
  },
  prompt: {
    color: colors.deepBlue,
    fontSize: 16,
    textAlign: 'center'
  },
  continueButtonWrap: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    padding: 18,
    borderColor: colors.lightGrey,
    borderTopWidth: 1
  }
})

class RatingInputModal extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      continueButtonWrap: {
        opacity: new Animated.Value(0),
        height: new Animated.Value(0)
      }
    }

    this.state = {
      rating: 0
    }

    this.submit = this.submit.bind(this)
  }

  submit() {
    rateUser({
      token: this.props.currentUser.token,
      ratedID: this.props.user.uid,
      rating: this.state.rating
    })

    this.props.onSubmit(this.state.rating)
  }

  updateRating(rating) {
    this.setState({rating})

    if (this.AV.continueButtonWrap.height._value !== 0) return

    let animations = [
      Animated.timing(this.AV.continueButtonWrap.height, {
        toValue: 60,
        duration: 170
      }),
      Animated.timing(this.AV.continueButtonWrap.opacity, {
        toValue: 1,
        duration: 100
      })
    ]

    Animated.sequence(animations).start()
  }

  renderStars() {
    let stars = []

    for (var i = 1; i <= 5; i++) {
      const index = i

      stars.push(
        <TouchableHighlight
          key={index}
          activeOpacity={0.75}
          underlayColor={'transparent'}
          style={{padding: 3}}
          onPress={() => this.updateRating(index)}>
          <Entypo
            size={dims.width * 0.075}
            name={(this.state.rating >= index) ? "star" : "star-outlined"}
            color={(this.state.rating >= index) ? colors.alertYellow : colors.slateGrey} />
        </TouchableHighlight>
      )
    }

    return stars
  }

  render() {
    return(
      <Modal visible={this.props.visible} animationType={'slide'} transparent>
        <View style={styles.container}>

          <TouchableWithoutFeedback onPress={this.props.cancel}>
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
          </TouchableWithoutFeedback>

          <View style={{width: dims.width * 0.85, backgroundColor: colors.snowWhite, borderRadius: 5, borderWidth: 1, borderColor: colors.lightGrey}}>
            <View style={{padding: 10, borderBottomWidth: 1, borderColor: colors.medGrey}}>
              <Text style={styles.prompt}>
                {`How would you rate your experience with ${this.props.user.firstName}?`}
              </Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10}}>
              {this.renderStars()}
            </View>

            <Animated.View style={[{justifyContent: 'flex-start', alignItems: 'center'}, this.AV.continueButtonWrap]}>
              <ContinueButton customText={"Rate"} onPress={this.submit} containerStyles={{width: dims.width * 0.6}} />
            </Animated.View>
          </View>

        </View>
      </Modal>
    )
  }
}

module.exports = RatingInputModal
