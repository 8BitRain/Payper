import React from 'react'
import {View, Animated, StyleSheet, Text, Alert, Keyboard, TouchableHighlight} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../globalStyles'
import {Firebase} from '../../helpers'
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
import {createBroadcast} from '../../helpers/lambda'
import {formatAfterOnboarding} from '../../helpers/broadcasts'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import Button from 'react-native-button'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {connect} from 'react-redux'
import * as dispatchers from '../Main/MainState'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  },
  innerContentWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hideKeyboardWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    borderColor: colors.medGrey,
    backgroundColor: colors.snowWhite,
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

    // Initialize title state
    if (props.castTitle) {
      this.state.substates["Title"] = {
        inputIsValid: true,
        titleInput: props.castTitle
      }
    }

    // Initialize tag state
    if (props.tag) {
      this.state.substates["Tags"] = {
        inputIsValid: true,
        query: props.tag
      }
    }

    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
  }

  componentWillMount() {

    // Initialize keyboard listeners
    this.KeyboardListener = Keyboard.addListener("keyboardWillShow", () => this.setState({keyboardIsVisible: true}))
    this.KeyboardListener = Keyboard.addListener("keyboardWillHide", () => this.setState({keyboardIsVisible: false}))

    // Get tag data from Firebase
    Firebase.get('Services', (val) => (val) ? this.setState({tags: val}) : null)

    // Configure page components
    this.pages = [
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
        title: "Who can subscribe?",
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
        title: "Amount and Frequency",
        invalidInputMessage: "You must enter a valid amount between $1 and $200.",
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
        reactComponent: <Tags induceState={this.induceState.bind(this)} />,
        validateInput: (substate) => {
          if (!substate) return false
          return substate.inputIsValid
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
    this.setState(this.state, () => console.log(this.state))
  }

  submit() {
    // TODO: Optimistically update

    // Send to backend
    let broadcast = formatAfterOnboarding(this.state.substates, this.props.currentUser)
    broadcast.token = this.props.currentUser.token
    createBroadcast(broadcast)

    // Page back to Main view and switch to 'Me' tab
    Actions.pop()
    setTimeout(() => Actions.refresh({newTab: 'Me'}))
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
          showNextButton={this.state.index < this.pages.length}
          title={this.pages[this.state.index].title}
          onBack={(this.state.index > 0) ? this.prev : null}
          onNext={this.next} />

        { /* Page-specific content */ }
        <Animated.View style={[{opacity: this.AV.opacity}, styles.innerContentWrap]}>
          {React.cloneElement(currPage.reactComponent, {
            state: currPageState,
            title: currPageTitle,
            next: this.next,
            prev: this.prev,
            tags: this.state.tags
          })}
        </Animated.View>

        { /* Continue button */ }
        <View style={{alignItems: 'center', paddingTop: 22.5, paddingBottom: 22.5, borderTopWidth: 1, borderColor: colors.lightGrey, backgroundColor: colors.snowWhite}}>
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
