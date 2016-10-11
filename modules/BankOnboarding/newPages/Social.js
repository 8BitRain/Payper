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
    this.state = { index: 0, submitText: "Continue" };
    this.values = ["", "", "", ""];
  }

  handleChangeText(input) {
    // Update value
    this.values[this.state.index] = input;

    // Focus next TextInput
    if (this.state.index !== 3 && input !== "") {
      this.refs[this.state.index].blur();
      this.refs[this.state.index + 1].focus();
    } else if (this.state.index !== 0 && input === "" && this.values[this.state.index] === "") {
      this.refs[this.state.index].blur();
      this.refs[this.state.index - 1].focus();
    }

    // Update state
    this.setState({ ssn: this.values.join("") });
  }

  handleSubmit() {
    for (var i in this.values)
      if (this.values[i] === "") {
        this.setState({ submitText: "Enter all 4 digits" });
        return;
      }
    this.props.induceState({ ssn: this.values.join("") });
    this.props.nextPage();
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "What are the last four\ndigits of your social?" }
          </Text>
        </View>

        <View style={styles.textInputWrap}>
          <TextInput ref="0" onFocus={() => this.setState({ index: 0 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="1" onFocus={() => this.setState({ index: 1 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="2" onFocus={() => this.setState({ index: 2 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="3" onFocus={() => this.setState({ index: 3 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
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
    width: dimensions.width * 0.15,
    height: dimensions.width * 0.15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: colors.white,
    textAlign: 'center',
    marginLeft: 1, marginRight: 1,
  }
});
