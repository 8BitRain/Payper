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
import {colors} from '../../../globalStyles';
const dimensions = Dimensions.get('window');

export default class City extends React.Component {
  constructor(props) {
    super(props);
    this.state = { street: "" };
    this.initalizedFromCache = false;
  }

  componentDidMount() {
    this.props.induceState(this.refs);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.street && !this.initalizedFromCache) {
      this.setState({ street: nextProps.street });
      this.initalizedFromCache = true;
    }
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
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '400', color: colors.deepBlue, textAlign: 'center' }}>
            { "Enter your billing street address" }
          </Text>
          <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '400', color: colors.deepBlue, textAlign: 'center', paddingTop: 15 }}>
            <Entypo name={"location-pin"} size={20} color={colors.accent} />
            { "  " + this.props.city + ", " + this.props.state }
          </Text>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            ref={"streetInput"}
            style={styles.input}
            placeholder={"e.g. 1 North Avenue"}
            placeholderTextColor={colors.deepBlue}
            defaultValue={this.state.street}
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
    backgroundColor: colors.snowWhite,
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
    color: colors.deepBlue
  }
});
