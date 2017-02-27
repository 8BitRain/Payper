/*


  NOTE: MOCK DATA
  -----------------------------------------------------------------------------
  {
    "Category 1": [
      {title: "Service 1.1"},
      {title: "Service 1.2"},
      {title: "Service 1.3"}
    ],
    "Category 2": [
      {title: "Service 2.1"},
      {title: "Service 2.2"},
      {title: "Service 2.3"}
    ]
  }


*/

import React from 'react'
import {View, TouchableHighlight, Text, Dimensions, StyleSheet, Animated, ScrollView} from 'react-native'
import {colors} from '../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    width: dims.width
  },
  category: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: dims.width,
    padding: 10,
    paddingLeft: 14,
    paddingRight: 14,
    borderColor: colors.medGrey,
    borderBottomWidth: 1
  },
  categoryText: {
    fontSize: 16,
    color: colors.deepBlue
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 14,
    paddingRight: 14,
    borderColor: colors.lightGrey,
    borderBottomWidth: 1
  },
  rowText: {
    fontSize: 16,
    color: colors.maastrichtBlue
  }
})

class Row extends React.Component {
  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={() => this.props.toggle(this.props.category, this.props.title)}>
        <View style={styles.row}>
          <Text style={styles.rowText}>{this.props.title}</Text>
          <EvilIcons name={(this.props.selected) ? "check" : "plus"} size={26} color={(this.props.selected) ? colors.gradientGreen : colors.slateGrey} />
        </View>
      </TouchableHighlight>
    )
  }
}

class Category extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      rowsHeight: new Animated.Value(0),
      rowsOpacity: new Animated.Value(0)
    }

    this.state = {
      rowsAreVisible: false
    }

    this.toggle = this.toggle.bind(this)
    this.showRows = this.showRows.bind(this)
    this.hideRows = this.hideRows.bind(this)
  }

  toggle() {
    this.setState({rowsAreVisible: !this.state.rowsAreVisible}, () => {
      if (this.state.rowsAreVisible) this.showRows()
      else this.hideRows()
    })
  }

  showRows() {
    let animations = [
      Animated.timing(this.AV.rowsHeight, {
        toValue: this.props.rows.length * 50,
        duration: 100
      }),
      Animated.timing(this.AV.rowsOpacity, {
        toValue: 1,
        duration: 65
      })
    ]

    Animated.sequence(animations).start()
  }

  hideRows() {
    let animations = [
      Animated.timing(this.AV.rowsOpacity, {
        toValue: 0,
        duration: 65
      }),
      Animated.timing(this.AV.rowsHeight, {
        toValue: 0,
        duration: 100
      })
    ]

    Animated.sequence(animations).start()
  }

  render() {
    return(
      <View>

        { /* Category (title and chevron) */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={this.toggle}>
          <View style={styles.category}>
            <Text style={styles.categoryText}>{this.props.category}</Text>
            <EvilIcons name={(this.state.rowsAreVisible) ? "chevron-up" : "chevron-down"} size={30} color={colors.slateGrey} />
          </View>
        </TouchableHighlight>

        { /* Rows */ }
        <Animated.View style={{height: this.AV.rowsHeight, opacity: this.AV.rowsOpacity, overflow: 'hidden'}}>
          {this.props.rows.map((o, i) => <Row {...o} key={i} category={this.props.category} toggle={this.props.toggle} />)}
        </Animated.View>

      </View>
    )
  }
}

class DropdownList extends React.Component {
  constructor(props) {
    super(props)

    if (!props.data)
      throw "DropdownList expected 'data' prop."

    this.state = props.state || {
      selectedTags: {},
      data: props.data
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle(category, row) {
    for (var i in this.state.data) {
      let curr = this.state.data[i]
      if (curr.category === category) {
        for (var j in curr.rows) {
          let currRow = curr.rows[j]
          if (currRow.title === row) {
            if (currRow.selected) {
              delete this.state.selectedTags[currRow.title]
              currRow.selected = false
            } else {
              this.state.selectedTags[currRow.title] = true
              currRow.selected = true
            }
          }
        }
      }
    }

    this.setState(this.state, () => (this.props.induceState) ? this.props.induceState(this.state) : null)
  }

  render() {
    return(
      <ScrollView style={styles.container}>
        {this.state.data.map((o, i) => <Category {...o} key={i} toggle={this.toggle} />)}
      </ScrollView>
    )
  }
}

module.exports = DropdownList
