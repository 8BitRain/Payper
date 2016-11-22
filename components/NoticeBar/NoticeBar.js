import React from 'react'
import { View, Text, TouchableHighlight, Animated, Easing, Dimensions } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import styles from './styles'
import { colors } from '../../globalStyles'
const dims = Dimensions.get('window')

class NoticeBar extends React.Component {
  constructor(props) {
    super(props)

    this.messages = {
      "awaitingMicrodepositVerification": "Press to verify your bank account.",
      "bank": "Press to add your bank account.",
      "retry": "We failed to verify your identity. Press to try again.",
      "document": "We need additional documents to verify your identity. Press to upload.",
      "suspended": "We failed to verify your identity and have frozen your account. Please contact support at support@getpayper.io.",
      "documentReceived": "We received your document and will verify it shortly." ,
      "documentProcessing": "We're sending your document to our partner, Dwolla, for identity verification.",
      "documentSuccess": "We successfully verified your identity! Press to add your bank account.",
      "documentFailure": "We were unable to verify your identity with the documents that were submitted. Please try uploading again."
    }

    this.notPressableStatuses = {
      "suspended": true,
      "documentReceived": true,
      "documentProcessing": true
    }

    this.state = {
      notPressable: this.notPressableStatuses[this.props.dwollaCustomerStatus]
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dwollaCustomerStatus !== this.props.dwollaCustomerStatus)
  //     this.setState({notPressable: this.notPressableStatuses[nextProps.dwollaCustomerStatus]})
  // }

  // componentDidMount() {
  //   this.show()
  // }

  // show() {
  //   Animated.timing(this.offsetX, {
  //     toValue: 0,
  //     duration: 400,
  //     easing: Easing.elastic(1.25)
  //   }).start()
  // }
  //
  // hide() {
  //   Animated.timing(this.offsetX, {
  //     toValue: -dims.width,
  //     duration: 400,
  //     easing: Easing.elastic(1.25)
  //   }).start()
  // }

  handlePress() {
    if (this.state.notPressable) return
    this.props.onPress()
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={(this.state.notPressable) ? 1.0 : 0.8}
        underlayColor={'transparent'}
        onPress={() => this.handlePress()}>
        <View style={styles.wrap}>
          <View style={{flex: 1.0, alignItems: 'center'}}>


            { /* Icon*/ }
            <FontAwesome name={(this.props.dwollaCustomerStatus) ? "shield" : "bank"} size={26} color={colors.snowWhite} style={{padding: 5, alignSelf: 'center'}} />

            { /* Text */ }
            <Text style={[styles.text, {textAlign: 'center'}]}>
              { this.messages[(this.props.dwollaCustomerStatus !== "verified") ? this.props.dwollaCustomerStatus : this.props.onboardingState] }
            </Text>


            { /* Chevron */
              (this.state.notPressable)
                ? null
                : <EvilIcons name={"chevron-right"} color={colors.snowWhite} size={36} style={{padding: 2}} /> }

          </View>
        </View>

      </TouchableHighlight>
    )
  }
}

module.exports = NoticeBar
