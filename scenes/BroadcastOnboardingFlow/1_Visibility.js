import React from 'react'
import {View, StyleSheet, Text, Dimensions} from 'react-native'
import {colors} from '../../globalStyles'
import {
  Checklist
} from '../../components'
import Entypo from 'react-native-vector-icons/Entypo'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  infoWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 4,
    width: dims.width * 0.85
  },
  infoText: {
    marginTop: 6,
    fontSize: 17,
    color: colors.deepBlue,
    textAlign: 'center',
    flexWrap: 'wrap'
  }
})

class Visibility extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    this.props.induceState(this.checklist.state, this.props.title)
  }

  render() {
    return(
      <View style={styles.container}>

        <View style={styles.infoWrap}>
          <Entypo name={"info-with-circle"} color={colors.accent} size={22} />
          <Text style={styles.infoText}>
            {"Broadcast visibility determines who can see and join your cast."}
          </Text>
        </View>

        <View style={{paddingTop: 10}}>
          <Checklist
            ref={ref => this.checklist = ref}
            state={this.props.state}
            checkedIndices={[0]}
            checkboxes={["Anyone", "Local", "Friends"]}
            cascadeSelection />
        </View>
      </View>
    )
  }
}

module.exports = Visibility
