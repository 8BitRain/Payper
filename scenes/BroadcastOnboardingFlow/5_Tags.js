import React from 'react'
import * as _ from 'lodash'
import {View, Text, StyleSheet, Slider, Dimensions, TextInput, TouchableOpacity, ScrollView, Keyboard, Animated} from 'react-native'
import {colors} from '../../globalStyles'
import {DropdownList, TextInputWithIcon, PredictiveTextInput, InfoBox} from '../../components'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  tagWrap: {
    padding: 12,
    width: dims.width * 0.94,
    borderBottomWidth: 1,
    borderColor: colors.medGrey,
    alignSelf: 'center',
    backgroundColor: colors.snowWhite
  },
  tagText: {
    fontSize: 14,
    color: colors.deepBlue,
    backgroundColor: colors.snowWhite
  }
})

class Tags extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      infoBox: {
        height: new Animated.Value(130),
        opacity: new Animated.Value(1)
      }
    }

    this.state = props.state || {
      inputIsValid: false,
      query: "",
      keyboardHeight: 0
    }

    this.tags = []

    for (var cat in this.props.tags) {
      let tags = this.props.tags[cat]
      for (var tag in tags)
        if ("displayName" !== tag)
          this.tags.push(tag)
    }

    this.filterData = this.filterData.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
  }

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
      this.hideInfoBox()
      this.setState({keyboardHeight: e.endCoordinates.height})
    })

    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (e) => {
      this.showInfoBox()
      this.setState({keyboardHeight: e.endCoordinates.height})
    })
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  hideInfoBox() {
    let animations = [
      Animated.timing(this.AV.infoBox.opacity, {
        toValue: 0,
        duration: 160
      }),
      Animated.timing(this.AV.infoBox.height, {
        toValue: 0,
        duration: 180
      })
    ]

    Animated.parallel(animations).start()
  }

  showInfoBox() {
    let animations = [
      Animated.timing(this.AV.infoBox.opacity, {
        toValue: 1,
        duration: 160
      }),
      Animated.timing(this.AV.infoBox.height, {
        toValue: 130,
        duration: 180
      })
    ]

    Animated.parallel(animations).start()
  }

  filterData() {
    const query = this.state.query
    return _.filter(this.tags, function(tag) {return query !== "" && tag.indexOf(query) >= 0})
  }

  onChangeText(text) {
    this.setState({
      query: text,
      inputIsValid: text.length > 0
    }, () => this.props.induceState(this.state, this.props.title))
  }

  render() {
    let filteredData = this.filterData()

    return(
      <View style={styles.container}>

        { /* Info box */ }
        <Animated.View style={[this.AV.infoBox]}>
          <InfoBox text={"Your broadcast's tag is a label that makes it easier for users to find you. (ex. 'netflix')"} />
        </Animated.View>

        { /* Text input */ }
        <View style={{alignSelf: 'center', paddingBottom: 10}}>
          <TextInputWithIcon
            onChangeText={this.onChangeText}
            inputIsValid={this.state.inputIsValid}
            textInputProps={{
              autoCapitalize: "none",
              autoCorrect: "none",
              autoFocus: false,
              returnKeyType: "done",
              defaultValue: this.state.query,
              placeholder: `Tag your broadcast (ex. "netflix")`,
              placeholderTextColor: colors.slateGrey
            }}
            iconProps={{
              name: "pencil",
              color: colors.accent,
              size: 30
            }} />
        </View>

        { /* Suggestions */ }
        <ScrollView keyboardShouldPersistTaps>
          {filteredData.map((tag, i) => (
            <TouchableOpacity key={Math.random()} onPress={() => this.onChangeText(tag)} underlayColor={colors.snowWhite}>
              <View style={styles.tagWrap}>
                <Text style={styles.tagText}>
                  {tag}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={{height: this.state.keyboardHeight}} />
        </ScrollView>

      </View>
    )
  }
}

module.exports = Tags
