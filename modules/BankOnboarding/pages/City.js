// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Dimensions, TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import getShortenedStateName from '../../../helpers/ShortenedStateList';
import * as Validate from '../../../helpers/Validate';
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
    this.state = { location: null };
  }

  componentDidMount() {
    this.props.induceState(this.refs);
  }

  setCity(data) {
    var addressComponents = data.address_components, location = {};

    for (var i in addressComponents) {
      const currComponent = addressComponents[i];
      for (var ii in currComponent.types) {
        const currType = currComponent.types[ii];
        if (currType === "locality") location.city = currComponent.long_name;
        else if (currType === "administrative_area_level_1") location.state = currComponent.short_name;
        else if (currType === "country") location.country = currComponent.long_name;
      }
    }

    this.setState({ location: location }, () => this.props.induceState({
      city: this.state.location.city,
      state: this.state.location.state,
      country: this.state.location.country
    }));
  }

  handleChangeText(text) {
    if (StringMaster5000.checkIf(text).isEmpty) this.setState({ location: null });
  }

  render() {
    return (
      <View style={styles.wrap}>
        <GooglePlacesAutocomplete
          ref={"cityInput"}
          styles={autocompleteStyles}
          textInputProps={{ onChangeText: (text) => this.handleChangeText(text), placeholderTextColor: colors.white, autoCorrect: false }}
          placeholder={"What's your billing address' city?"}
          minLength={1}
          listViewDisplayed={true}
          fetchDetails={true}
          onPress={(data, details) => this.setCity(details)}
          query={{ key: 'AIzaSyDosLKF0_VpVu8f5gYo2Pon60Ii8XpMZ_8', language: 'en', types: '(cities)', components: 'country:us' }}
          nearbyPlacesAPI={'GooglePlacesSearch'}
          GooglePlacesSearchQuery={{ rankby: 'distance' }} />

        <StickyView onlyStickWhen={this.state.location !== null}>
          <ContinueButton text={(this.state.location) ? "Continue" : "Please select a city"} onPress={(this.state.location) ? () => this.props.nextPage() : () => console.log("Must select a city first...")} />
        </StickyView>
      </View>
    );
  }
}

const autocompleteStyles = StyleSheet.create({
  container: {
    flex: 1.0,
    width: dimensions.width
  },
  textInputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  textInput: {
    backgroundColor: 'transparent',
    color: colors.white
  },
  description: { color: colors.white },
  poweredContainer: { opacity: 0 }
});

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    width: dimensions.width,
    backgroundColor: colors.richBlack,
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});
