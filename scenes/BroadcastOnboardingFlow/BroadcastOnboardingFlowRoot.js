import React from 'react'
import {View, Animated, StyleSheet, Text, Alert, Keyboard, TouchableHighlight} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../globalStyles'
import {
  Header,
  ContinueButton,
  StickyView
} from '../../components'
import {
  Visibility,
  Title,
  AmountAndFrequency,
  Spots,
  Tags,
  DetailsOfAgreement,
  Secret
} from './'
import {formatBroadcast} from '../../helpers'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import Button from 'react-native-button'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {connect} from 'react-redux'
import * as dispatchers from '../Main/MainState'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.snowWhite
  },
  innerContentWrap: {
    flex: 1
  },
  hideKeyboardWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    borderColor: colors.medGrey,
    borderTopWidth: 1,
    borderBottomWidth: 1
  }
})

class BroadcastOnboardingFlowRoot extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      opacity: new Animated.Value(1)
    }

    this.state = {
      index: 0,
      visibilityState: null,
      canPaginate: true,
      substates: {},
      keyboardIsVisible: false
    }

    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
  }

  componentWillMount() {
    this.KeyboardListener = Keyboard.addListener("keyboardWillShow", () => this.setState({keyboardIsVisible: true}))
    this.KeyboardListener = Keyboard.addListener("keyboardWillHide", () => this.setState({keyboardIsVisible: false}))

    this.pages = [
      {
        title: "Broadcast Visibility",
        invalidInputMessage: "You must check at least one of the boxes.",
        reactComponent: <Visibility ref={ref => this.VisibilityPage = ref} induceState={this.induceState.bind(this)} />,
        validateInput: (substate) => {
          if (!substate) return false
          let {checkboxes} = substate
          let valid = false
          for (var i in checkboxes)
            if (true === checkboxes[i].selected)
              valid = true
          return valid
        }
      },
      {
        title: "Title",
        invalidInputMessage: "You must enter a broadcast title.",
        reactComponent: <Title induceState={this.induceState.bind(this)} />,
        validateInput: (substate) => {
          if (!substate) return false
          return substate.inputIsValid
        }
      },
      {
        title: "Amount and Frequency",
        invalidInputMessage: "You must enter a valid amount between $1 and $3,000.",
        reactComponent: <AmountAndFrequency induceState={this.induceState.bind(this)} />,
        validateInput: (substate) => {
          if (!substate) return false
          return substate.amountInputIsValid
        }
      },
      {
        title: "Member Limit",
        reactComponent: <Spots induceState={this.induceState.bind(this)} />,
        validateInput: (substate) => {
          return true
        }
      },
      {
        title: "Tags",
        invalidInputMessage: "You must select a tag.",
        reactComponent: <Tags induceState={this.induceState.bind(this)} tags={this.props.currentUser.tags} />,
        validateInput: (substate) => {
          if (!substate) return false
          return Object.keys(substate.selectedTags).length > 0
        }
      },
      {
        title: "Details of Agreement",
        invalidInputMessage: "Your cast's Details of Agreement must be between 1 and 140 characters.",
        reactComponent: <DetailsOfAgreement induceState={this.induceState.bind(this)} />,
        validateInput: (substate) => {
          if (!substate) return false
          return substate.inputIsValid
        }
      },
      {
        title: "Secret",
        invalidInputMessage: "Your cast's Secret must be between 1 and 140 characters.",
        reactComponent: <Secret induceState={this.induceState.bind(this)} />,
        validateInput: (substate) => {
          if (!substate) return false
          return substate.inputIsValid
        }
      }
    ]
  }

  componentWillUnmount() {
    this.KeyboardListener = Keyboard.removeListener("keyboardWillShow")
    this.KeyboardListener = Keyboard.removeListener("keyboardWillHide")
  }

  induceState(substate, pageTitle) {
    this.state.substates[pageTitle] = substate
    this.setState(this.state)
  }

  submit() {

    // Convert onboarding state to formatted broadcast JSON
    let broadcast = formatBroadcast(this.state.substates, this.props.currentUser)

    // Update current user's meFeed data source
    let meFeed = this.props.currentUser.meFeed || {}
    if (!meFeed["My Broadcasts"]) meFeed["My Broadcasts"] = {}
    meFeed["My Broadcasts"] = Object.assign({}, broadcast, meFeed["My Broadcasts"])
    this.props.updateCurrentUser({meFeed: meFeed})

    // Page back to Main view and switch to 'Me' tab
    Actions.pop()
    setTimeout(() => Actions.refresh({test: 'val'}), 1000)
  }

  next() {
    if (!this.state.canPaginate) return

    let currPage = this.pages[this.state.index]
    let inputIsValid = currPage.validateInput(this.state.substates[currPage.title])
    if (!inputIsValid) {
      Alert.alert('Invalid Input', currPage.invalidInputMessage)
      return
    }

    if (this.state.index === this.pages.length - 1) {
      this.submit()
      return
    }

    this.fadeOut(() => {
      this.setState({index: this.state.index + 1}, () => {
        this.fadeIn()
      })
    })
  }

  prev() {
    if (this.state.index === 0 || !this.state.canPaginate)
      return

    this.fadeOut(() => {
      this.setState({index: this.state.index - 1}, () => {
        this.fadeIn()
      })
    })
  }

  fadeOut(onComplete) {
    this.setState({canPaginate: false})

    Animated.timing(this.AV.opacity, {
      toValue: 0,
      duration: 100
    }).start(() => {
      this.setState({canPaginate: true})
      if (onComplete) onComplete()
    })
  }

  fadeIn(onComplete) {
    this.setState({canPaginate: false})

    Animated.timing(this.AV.opacity, {
      toValue: 1,
      duration: 100
    }).start(() => {
      this.setState({canPaginate: true})
      if (onComplete) onComplete()
    })
  }

  render() {
    let currPage = this.pages[this.state.index]
    let currPageTitle = currPage.title
    let currPageState = this.state.substates[currPageTitle]

    return(
      <View style={styles.container}>

        { /* Header */ }
        <Header
          showTitle
          showBackButton
          onBack={(this.state.index > 0) ? this.prev : null}
          title={this.pages[this.state.index].title} />

        { /* Page-specific content */ }
        <Animated.View style={[{opacity: this.AV.opacity}, styles.innerContentWrap]}>
          {React.cloneElement(currPage.reactComponent, {
            state: currPageState,
            title: currPageTitle,
            next: this.next,
            prev: this.prev
          })}
        </Animated.View>

        { /* Continue button */ }
        <View style={{alignItems: 'center', paddingTop: 22.5, paddingBottom: 22.5, borderTopWidth: 1, borderColor: colors.lightGrey}}>
          <ContinueButton onPress={this.next} />
        </View>

        { /* Hide keyboard button */ }
        <StickyView>
          {(this.state.keyboardIsVisible)
            ? <TouchableHighlight underlayColor={'transparent'} activeOpacity={0.75} onPress={() => dismissKeyboard()}>
                <View style={styles.hideKeyboardWrap}>
                  <EvilIcons name={"chevron-down"} color={colors.slateGrey} size={28} />
                </View>
              </TouchableHighlight>
            : null}
        </StickyView>

      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentUser: (input) => dispatch(dispatchers.setCurrentUser(input)),
    updateCurrentUser: (input) => dispatch(dispatchers.updateCurrentUser(input))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(BroadcastOnboardingFlowRoot)
