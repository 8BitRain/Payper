// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as StringMaster5000 from '../../../helpers/StringMaster5000';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class City extends React.Component {
  constructor(props) {
    super(props);
    this.state = { street: "" };
  }

  handleChangeText(input) {
    this.setState({ street: input });
  }

  handleSubmit() {
    if (StringMaster5000.checkIf(this.state.street).isEmpty) return;
    this.props.induceState(this.state);
    this.props.nextPage();
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "Enter your street address" }
          </Text>
          <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', color: colors.white, textAlign: 'center', paddingTop: 15 }}>
            <Entypo name={"location-pin"} size={20} color={colors.white} />
            { "  " + this.props.city + ", " + this.props.state }
          </Text>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder={"e.g. 1 North Avenue"}
            placeholderTextColor={colors.lightGrey}
            autoCapitalize={"words"} autofocus autoCorrect={false}
            onChangeText={(input) => this.handleChangeText(input)} />
        </View>

        <StickyView>
          <ContinueButton text={(this.state.street) ? "Continue" : "Enter an address"} onPress={(this.state.street) ? () => this.handleSubmit() : () => console.log("Must enter an address first...")} />
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
  inputWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    height: 55,
    width: dimensions.width * 0.75,
    marginTop: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    color: colors.white
  }
});
