import React from 'react'
import {View, StyleSheet, Text, StatusBar, ScrollView, TextInput, TouchableHighlight, Dimensions} from 'react-native'
import {TextArea, Header} from '../../components'
import {colors} from '../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {connect} from 'react-redux'
import * as dispatchers from '../Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: dims.width * 0.9,
    backgroundColor: colors.lightGrey,
    marginTop: 14,
    height: 44,
    borderRadius: 4
  },
  iconWrap: {
    flex: 0.14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    height: 26,
    width: 1,
    backgroundColor: colors.medGrey
  },
  input: {
    color: colors.deepBlue,
    paddingLeft: 8,
    flex: 0.86,
    height: 44
  },
  moreInfo: {
    width: dims.width * 0.9,
    marginTop: 10,
    padding: 4,
    fontSize: 16,
    color: colors.slateGrey,
    textAlign: 'center'
  },
})

class Contact extends React.Component {
  constructor(props) {
    super(props)

    this.state = props.state || {
      emailInput: this.props.currentUser.decryptedEmail,
      phoneInput: this.props.currentUser.decryptedPhone,
      inputIsValid: false
    }

    this.validateInput = this.validateInput.bind(this)
  }

  validateInput(input) {
    let inputIsValid = true
    this.setState({inputIsValid})
  }

  componentDidMount() {
    this.props.induceState(this.state, this.props.title)
  }

  render() {
    return(
      <View style={styles.container}>

        { /* Email input */ }
        <View style={styles.inputWrap}>
          <View style={styles.iconWrap}>
            <EvilIcons name={"envelope"} size={32} color={colors.accent} />
          </View>
          <View style={styles.divider} />
          <TextInput
            ref={"emailInput"}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
            defaultValue={this.state.emailInput}
            placeholder={"Email Address"}
            placeholderTextColor={colors.slateGrey}
            style={styles.input}
            onChangeText={(input) => this.setState({emailInput: input}, () => this.props.induceState(this.state, this.props.title))} />
        </View>

        { /* Phone input */ }
        <View style={styles.inputWrap}>
          <View style={styles.iconWrap}>
            <Text style={{fontSize: 16, color: colors.accent}}>
              {"1+"}
            </Text>
          </View>
          <View style={styles.divider} />
          <TextInput
            ref={"phoneInput"}
            autoCorrect={false}
            keyboardType={"number-pad"}
            maxLength={10}
            defaultValue={this.state.phoneInput}
            placeholder={"Phone Number"}
            placeholderTextColor={colors.slateGrey}
            returnKeyType={"done"}
            style={styles.input}
            onSubmitEditing={() => this.submit()}
            onChangeText={(input) => this.setState({phoneInput: input}, () => this.props.induceState(this.state, this.props.title))} />
        </View>

        <Text style={styles.moreInfo}>
          {"We won't share your contact information with anyone."}
        </Text>
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(Contact)
