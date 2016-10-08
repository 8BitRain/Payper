// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Dimensions, TextInput } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class LegalName extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 28, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "Is this your legal name?" }
          </Text>
          <TextInput style={{ width: 100, height: 30, backgroundColor: 'red' }} autofocus />
        </View>

        <StickyView>
          <ContinueButton text={"Yes"} onPress={() => this.props.nextPage()} />
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
    alignItems: 'center',
    paddingTop: 80
  }
});
