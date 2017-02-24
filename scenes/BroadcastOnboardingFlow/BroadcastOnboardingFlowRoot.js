import React from 'react'
import {View, Animated, StyleSheet, Text, Alert} from 'react-native'
import {colors} from '../../globalStyles'
import {
  Header,
  ContinueButton
} from '../../components'
import {
  Visibility,
  Title,
  Amount,
  Spots,
  Tags,
  DetailsOfAgreement,
  Secret
} from './'
import Button from 'react-native-button'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.snowWhite
  },
  innerContentWrap: {
    flex: 1
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
      substates: {}
    }

    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
  }

  componentWillMount() {
    this.pages = [
      {
        title: "Broadcast Visibility",
        invalidInputMessage: "You must check at least one of the boxes.",
        reactComponent: <Visibility ref={ref => this.VisibilityPage = ref} induceState={this.induceState.bind(this)} />,
        validateInput: (substate) => {
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
        reactComponent: <Amount induceState={this.induceState.bind(this)} />,
        validateInput: (input) => {
          return true
        }
      },
      {
        title: "Spots",
        reactComponent: <Spots induceState={this.induceState.bind(this)} />,
        validateInput: (input) => {
          return true
        }
      },
      {
        title: "Tags",
        reactComponent: <Tags induceState={this.induceState.bind(this)} />,
        validateInput: (input) => {
          return true
        }
      },
      {
        title: "Details of Agreement",
        reactComponent: <DetailsOfAgreement induceState={this.induceState.bind(this)} />,
        validateInput: (input) => {
          return true
        }
      },
      {
        title: "Secret",
        reactComponent: <Secret induceState={this.induceState.bind(this)} />,
        validateInput: (input) => {
          return true
        }
      }
    ]
  }

  induceState(substate, pageTitle) {
    this.state.substates[pageTitle] = substate
    this.setState(this.state)
  }

  next() {
    if (this.state.index === this.pages.length - 1 || !this.state.canPaginate)
      return

    let currPage = this.pages[this.state.index]
    let inputIsValid = currPage.validateInput(this.state.substates[currPage.title])
    if (!inputIsValid) {
      Alert.alert('Invalid Input', currPage.invalidInputMessage)
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
        <View style={{alignItems: 'center', marginTop: 15, marginBottom: 30}}>
          <ContinueButton onPress={this.next} />
        </View>
      </View>
    )
  }
}

module.exports = BroadcastOnboardingFlowRoot
