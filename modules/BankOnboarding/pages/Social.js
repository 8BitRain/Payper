// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class Social extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      submitText: "Continue",
      input: ""
    };
  }

  componentDidMount() {
    this.props.induceState(this.refs);
  }

  handleChangeText(input) {
    this.setState({ input: input });
  }

  handleSubmit() {
    let isValid = (this.props.requireAllDigits) ? this.state.input.length === 9 : this.state.input.length === 4;
    if (!isValid) {
      this.setState({
        submitText: (this.props.requireAllDigits) ? "Enter all 9 digits" : "Enter all 4 digits"
      });
      return;
    }

    this.setState({ submitText: "Just a moment..." });
    this.props.induceState({ ssn: this.state.input }, (success) => {
      this.setState({ submitText: "Continue" });
    });

    // Pagination is handled in BankOnboardingView.createDwollaCustomer()'s
    // callback functions
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            {(this.props.requireAllDigits) ? "What's your social?" : "What are the last four\ndigits of your social?"}
          </Text>
        </View>

        <View style={styles.textInputWrap}>
          <TextInput
            ref={"ssnInput"}
            placeholder="e.g. 1234"
            placeholderTextColor={colors.lightGrey}
            style={styles.textInput}
            maxLength={(this.props.requireAllDigits) ? 9 : 4}
            keyboardType={'number-pad'}
            onChangeText={(input) => this.handleChangeText(input)} />
        </View>

        <StickyView>
          <ContinueButton text={this.state.submitText} onPress={() => this.handleSubmit()} />
        </StickyView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    width: dimensions.width,
    backgroundColor: colors.richBlack,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  textInputWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: dimensions.width,
    paddingTop: 20
  },
  textInput: {
    height: 55,
    width: dimensions.width * 0.75,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: colors.white,
    textAlign: 'center'
  }
});
