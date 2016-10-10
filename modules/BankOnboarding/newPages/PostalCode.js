// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class PostalCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { index: 0, valid: false };
    this.values = ["", "", "", "", ""];
  }

  validate() {
    for (var i in this.values) if (this.values[i] === "")
      return false;

    return true;
  }

  handleSubmit() {
    var str = "";

    for (var i in this.values)
      if (this.values[i] === "") return false;
      else str += this.values[i];

    this.props.induceState({ postalCode: str });
    this.props.nextPage();
  }

  handleChangeText(input) {
    this.values[this.state.index] = input;
    this.setState({ valid: this.validate() });
    if (this.state.index === 4 || input === "") return;
    this.refs[this.state.index].blur();
    this.refs[this.state.index + 1].focus();
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "What's your postal code?" }
          </Text>
        </View>

        <View style={styles.textInputWrap}>
          <TextInput ref="0" onFocus={() => this.setState({ index: 0 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="1" onFocus={() => this.setState({ index: 1 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="2" onFocus={() => this.setState({ index: 2 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="3" onFocus={() => this.setState({ index: 3 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="4" onFocus={() => this.setState({ index: 4 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
        </View>

        <StickyView>
          <ContinueButton text={(this.state.valid) ? "Continue" : "Enter a postal code"} onPress={() => this.handleSubmit()} />
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
    flex: 1.0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: dimensions.width,
    paddingTop: 20
  },
  textInput: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: colors.white,
    textAlign: 'center',
    marginLeft: 1, marginRight: 1,
  }
});
