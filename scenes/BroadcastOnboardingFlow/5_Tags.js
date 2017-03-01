import React from 'react'
import {View, Text, StyleSheet, Slider, Dimensions} from 'react-native'
import {colors} from '../../globalStyles'
import {DropdownList} from '../../components'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
})

class Tags extends React.Component {
  constructor(props) {
    super(props)

    this.data = []

    for (var cat in props.tags) {
      let data = props.tags[cat]
      this.data.push({category: data.displayName, rows: data})
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <DropdownList
          induceState={(substate) => this.props.induceState(substate, this.props.title)}
          state={this.props.state}
          data={this.data} />
      </View>
    )
  }
}

module.exports = Tags
