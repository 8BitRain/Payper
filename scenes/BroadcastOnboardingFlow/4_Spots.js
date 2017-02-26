import React from 'react'
import {View, Text, StyleSheet, Slider, Dimensions} from 'react-native'
import {colors} from '../../globalStyles'
import {InfoBox} from '../../components'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  sliderWrap: {
    paddingTop: 20,
    width: dims.width * 0.85
  },
  stepValuesWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 6
  },
  stepValue: {
    fontSize: 16
  },
  stepDivider: {
    width: 1,
    height: 10,
    borderRadius: 1.75,
    backgroundColor: colors.medGrey
  }
})

class Spots extends React.Component {
  constructor(props) {
    super(props)

    this.state = props.state || {
      spotsInput: 2
    }

    this.onSliderValueChange = this.onSliderValueChange.bind(this)
  }

  onSliderValueChange(value) {
    this.setState({spotsInput: value}, () => this.props.induceState(this.state, this.props.title))
  }

  render() {
    return(
      <View style={styles.container}>

        { /* Info Box */ }
        <InfoBox text={"Your cast's spot limit determines how many users are allowed to join."} />

        { /* Slider with step labels */ }
        <View style={styles.sliderWrap}>
          <View style={styles.stepValuesWrap}>
            <View style={styles.stepDivider} />
            <Text style={[styles.stepValue, {color: (Math.round(this.state.spotsInput) === 1) ? colors.accent : colors.slateGrey}]}>
              {"1"}
            </Text>
            <View style={styles.stepDivider} />
            <Text style={[styles.stepValue, {color: (Math.round(this.state.spotsInput) === 2) ? colors.accent : colors.slateGrey}]}>
              {"2"}
            </Text>
            <View style={styles.stepDivider} />
            <Text style={[styles.stepValue, {color: (Math.round(this.state.spotsInput) === 3) ? colors.accent : colors.slateGrey}]}>
              {"3"}
            </Text>
            <View style={styles.stepDivider} />
          </View>

          <Slider
            style={styles.slider}
            value={this.state.spotsInput}
            minimumValue={1}
            maximumValue={3}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.slateGrey}
            onValueChange={this.onSliderValueChange} />
        </View>

      </View>
    )
  }
}

module.exports = Spots
