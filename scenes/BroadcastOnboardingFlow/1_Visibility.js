import React from 'react'
import {View, StyleSheet, Text, Dimensions} from 'react-native'
import {colors} from '../../globalStyles'
import {
  Checklist,
  InfoBox
} from '../../components'
import Entypo from 'react-native-vector-icons/Entypo'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
})

class Visibility extends React.Component {
  constructor(props) {
    super(props)
    this.onChecklistChange = this.onChecklistChange.bind(this)
  }

  onChecklistChange(checkboxes) {
    this.props.induceState({checkboxes}, this.props.title) // update state in root
  }

  render() {
    return(
      <View style={styles.container}>

        { /* Info Box */ }
        <InfoBox text={"Broadcast visibility determines who can see and join your cast."} />

        { /* Check List */ }
        <View style={{paddingTop: 10}}>
          <Checklist
            ref={ref => this.checklist = ref}
            state={this.props.state}
            checkboxes={["Anyone", "Local", "Friends"]}
            cascadeSelection
            onChange={this.onChecklistChange} />
        </View>

      </View>
    )
  }
}

module.exports = Visibility
