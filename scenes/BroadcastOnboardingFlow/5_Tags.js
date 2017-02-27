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
  render() {
    return(
      <View style={styles.container}>
        <DropdownList
          induceState={(substate) => this.props.induceState(substate, this.props.title)}
          state={this.props.state}
          data={
            [
              {
                category: "Category 1",
                rows: [{title: "Row 1.1"}, {title: "Row 1.2"}]
              },
              {
                category: "Category 2",
                rows: [{title: "Row 2.1"}, {title: "Row 2.2"}, {title: "Row 2.3"}, {title: "Row 2.4"}]
              }
            ]
          } />
      </View>
    )
  }
}

module.exports = Tags
