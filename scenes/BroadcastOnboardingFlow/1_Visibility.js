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

        { /* Check List */ }
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Checklist
            ref={ref => this.checklist = ref}
            state={this.props.state}
            checkboxes={["Anyone", "Local", "Friends of Friends", "Friends"]}
            cascadeSelection
            onChange={this.onChecklistChange} />
        </View>

      </View>
    )
  }
}

module.exports = Visibility
