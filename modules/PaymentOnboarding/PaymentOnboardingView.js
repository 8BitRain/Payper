import React from 'react'
import { View, ScrollView, Animated, StatusBar, Image, TouchableHighlight, Text, Dimensions, Modal, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { colors } from '../../globalStyles'
import { StickyView } from '../../components'
import { Field } from './subcomponents'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

class PaymentOnboardingView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      fields: [
        {
          title: "Who?",
          iconName: "user",
          complete: false,
          value: null,
          invalidityAlert: "Please select one or more users.",
          textInputProps: {
            placeholder: "Search by name or username",
            keyboardType: "default",
            autoCapitalize: "words",
            autoCorrect: false
          }
        },
        {
          title: "How much?",
          iconName: "credit-card",
          complete: false,
          value: null,
          invalidityAlert: "Please enter a valid USD amount between $1 and $3,000.",
          textInputProps: {
            placeholder: "$0.00",
            keyboardType: "numeric",
            autoCorrect: false
          }
        },
        {
          title: "How often?",
          iconName: "clock",
          complete: false,
          value: null,
          invalidityAlert: "Please enter a valid number greater than or equal to 1.",
          textInputProps: {
            placeholder: "Monthly or weekly?",
            keyboardType: "number-pad",
            autoCorrect: false
          }
        },
        {
          title: "How long?",
          iconName: "calendar",
          complete: false,
          value: null,
          invalidityAlert: "Please enter a valid frequency (monthly or weekly).",
          textInputProps: {
            placeholder: "0 months",
            keyboardType: "numeric",
            autoCorrect: false
          }
        },
        {
          title: "What for?",
          iconName: "pencil",
          complete: false,
          value: null,
          invalidityAlert: "Please enter a valid payment purpose.",
          textInputProps: {
            placeholder: "ex. Spotify Family Plan",
            keyboardType: "default",
            autoCapitalize: "words",
            autoCorrect: false
          }
        }
      ]
    }

    this.fieldRefs = {}
    this.induceFieldRef = this.induceFieldRef.bind(this)
    this.toggleFieldFocus = this.toggleFieldFocus.bind(this)
  }

  induceFieldRef(ref) {
    let title = ref.props.title
    this.fieldRefs[title] = ref
  }

  toggleModal() {
    this.setState({modalVisible: true})
  }

  toggleFieldFocus(title) {
    let fieldIsFocused = this.fieldRefs[title].state.focused

    for (var k of Object.keys(this.fieldRefs)) {
      if (k === title) continue
      let curr = this.fieldRefs[k]
      if (fieldIsFocused) curr.hide()
      else curr.show()
    }
  }

  render() {
    return(
      <View style={{flex: 1.0, flexDirection: 'column'}}>
        <StatusBar barStyle={"light-content"} />

        { /* Header */ }
        <View style={{overflow: 'hidden'}}>
          <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />

          <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
            <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
              {"New Payment Series"}
            </Text>

            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => Actions.pop()}
              style={{position: 'absolute', top: 18, bottom: 0, left: 0, padding: 14, justifyContent: 'center'}}>
              <EvilIcons name={"chevron-left"} size={36} color={colors.lightGrey} />
            </TouchableHighlight>
          </View>
        </View>

        { /* Fields */ }
        <ScrollView
          keyboardShouldPersistTaps
          contentContainerStyle={{alignItems: 'center'}}>
          {this.state.fields.map((data, i) =>
            <Field
              {...data}
              key={data.title}
              induceFieldRef={this.induceFieldRef}
              toggleFieldFocus={this.toggleFieldFocus}
              toggle />
          )}
        </ScrollView>
      </View>
    )
  }
}

module.exports = PaymentOnboardingView
