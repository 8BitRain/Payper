import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

let checklistColors = {
  selectedText: colors.deepBlue,
  selectedIcon: colors.gradientGreen,
  unselectedText: colors.slateGrey,
  unselectedIcon: colors.slateGrey,
  unpressableText: colors.mutedSlateGrey,
  unpressableIcon: colors.mutedGradientGreen
}

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingRight: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 5
  },
  text: {
    fontSize: 22,
    paddingLeft: 4
  }
})

class Checklist extends React.Component {
  constructor(props) {
    super(props)

    this.state = props.state || {
      checkboxes: this.formatCheckboxes(props.checkboxes)
    }
  }

  componentDidMount() {
    if (this.props.state) return // don't overwrite cached state

    // initalized checked boxes
    if (this.props.checkedIndices)
      for (i in this.props.checkedIndices)
        this.toggle(this.props.checkedIndices[i])
  }

  formatCheckboxes(checkboxNames) {
    let formattedCheckboxes = []

    for (var i in checkboxNames) {
      formattedCheckboxes.push({
        title: checkboxNames[i],
        selected: false,
        pressable: true
      })
    }

    return formattedCheckboxes
  }

  toggle(i) {
    let checkbox = this.state.checkboxes[i]
    checkbox.selected = !checkbox.selected

    // Select boxes underneath this one if Checklist has the
    // 'cascadeSelection' prop
    if (this.props.cascadeSelection && i < this.state.checkboxes.length - 1) {
      for (var j = i + 1; j < this.state.checkboxes.length; j++) {
        let curr = this.state.checkboxes[j]
        curr.pressable = !checkbox.selected
        curr.selected = checkbox.selected
      }
    }

    this.setState(this.state)
  }

  render() {
    return(
      <View>
        {
          this.state.checkboxes.map((o, i) => {
            return(
              <TouchableHighlight
                key={o.title}
                activeOpacity={(o.pressable) ? 0.75 : 1}
                underlayColor={'transparent'}
                onPress={() => (o.pressable) ? this.toggle(i) : null}>
                <View style={styles.row}>
                  <EvilIcons
                    size={37}
                    name={(o.selected) ? "check" : "plus"}
                    color={(o.pressable)
                      ? (o.selected) ? checklistColors.selectedIcon : checklistColors.unselectedIcon
                      : checklistColors.unpressableIcon
                    } />
                  <Text style={[styles.text, {
                    color: (o.pressable)
                      ? (o.selected) ? checklistColors.selectedText : checklistColors.unselectedText
                      : checklistColors.unpressableText
                  }]}>
                    {o.title}
                  </Text>
                </View>
              </TouchableHighlight>
            )
          })
        }
      </View>
    )
  }
}

module.exports = Checklist
