// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import * as XMLParser from 'xml2js';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class ZIPCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      valid: false,
      submitText: "Search"
    };
    this.values = ["", "", "", "", ""];
    this.zipCache = {};
  }

  findCity(zip) {
    const _this = this;

    // If the user has already searched for this zip code, re-populate it
    if (this.zipCache[zip]) {
      this.setState({
        loading: false,
        submitText: "Continue",
        city: this.zipCache[zip].city,
        state: this.zipCache[zip].state
      });
      return;
    }

    // Display loading indicator
    this.setState({ loading: true });

    // Set up query string
    var base = "http://production.shippingapis.com/ShippingAPI.dll?API=CityStateLookup&XML=",
        query = "<CityStateLookupRequest USERID='980PAYPE5322'><ZipCode ID='0'><Zip5>" + zip + "</Zip5></ZipCode></CityStateLookupRequest>";

    // Instantiate client
    this.client = new XMLHttpRequest();
    this.client.onload = this.handler;

    // Handle a successful search
    this.client.onSuccess = (data) => {
      _this.setState({
        loading: false,
        submitText: "Continue",
        city: data.city,
        state: data.state
      });

      // Cache the search response
      _this.zipCache[zip] = { city: data.city, state: data.state };
    }

    // Handle a failed search
    this.client.onFailure = (err) => {
      _this.setState({
        loading: false,
        city: "No match",
        state: "🙄",
        submitText: "Enter my city manually"/* + <Entypo name={"chevron-thin-right"} size={20} color={colors.white} /> */
      });
      _this.props.induceState({ zipCode: zip });
    }

    // Submit the query
    this.client.open("GET", base + query);
    this.client.send();
  }

  handler() {
    if (this.status === 200 && this.responseText != null) {
      XMLParser.parseString(this.responseText, (err, res) => {
        console.log("XML --> JSON:", res);
        if (err) {
          this.onFailure("Error parsing XML");
        } else if (res.CityStateLookupResponse.ZipCode[0].Error) {
          this.onFailure("Invalid ZIP");
        } else {
          var city = res.CityStateLookupResponse.ZipCode[0].City[0],
              state = res.CityStateLookupResponse.ZipCode[0].State[0];
          city = city.charAt(0) + city.slice(1).toLowerCase();
          this.onSuccess({ city: city, state: state });
        }
      });
    } else {
      this.onFailure();
    }
  }

  validateAndReturnZIP() {
    for (var i in this.values)
      if (this.values[i] === "")
        return null;
    return this.values.join("");
  }

  handleSubmit() {
    if (this.state.submitText === "Search") {
      this.findCity(zip);
    } else if (this.state.submitText === "Continue") {
      this.props.induceState({ zip: this.state.zip, city: this.state.city, state: this.state.state });
      this.props.nextPage();
    } else if (this.state.submitText === "Enter my city manually") {
      this.props.induceState({ zip: this.state.zip });
      this.props.nextPage({ destination: "city" });
    }
  }

  handleChangeText(input) {
    // If a search request is already being processed, cancel it
    if (this.state.loading) {
      this.setState({ loading: false, submitText: "Enter a valid ZIP code" });
      this.client.abort();
    }

    // Clear matched city
    this.setState({ city: null, state: null });

    // Update value
    this.values[this.state.index] = input;

    // Focus next TextInput
    if (this.state.index !== 4 && input !== "") {
      this.refs[this.state.index].blur();
      this.refs[this.state.index + 1].focus();
    } else if (this.state.index !== 0 && input === "" && this.values[this.state.index] === "") {
      this.refs[this.state.index].blur();
      this.refs[this.state.index - 1].focus();
    }

    // Update state
    var zip = this.validateAndReturnZIP();
    this.setState({ zip: zip, submitText: (zip) ? "Search" : "Enter a valid ZIP code" });

    // Start searching if input is complete
    if (zip && zip.length === 5) this.findCity(zip);
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "What's your ZIP code?" }
          </Text>
        </View>

        <View style={styles.textInputWrap}>
          <TextInput ref="0" onFocus={() => this.setState({ index: 0 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="1" onFocus={() => this.setState({ index: 1 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="2" onFocus={() => this.setState({ index: 2 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="3" onFocus={() => this.setState({ index: 3 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="4" onFocus={() => this.setState({ index: 4 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
        </View>

        { (this.state.city && this.state.state)
            ? <Text style={{ fontFamily: 'Roboto', fontSize: 20, fontWeight: '200', color: colors.white, textAlign: 'center', paddingTop: 15 }}>
                <Entypo name={"location-pin"} size={20} color={colors.white} />
                { "  " + this.state.city + ", " + this.state.state }
              </Text>
            : null }

        { (this.state.loading)
            ? <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', color: colors.white, textAlign: 'center', paddingTop: 15 }}>
                { "Searching..." }
              </Text>
            : null }

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
    width: 45,
    height: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: colors.white,
    textAlign: 'center',
    marginLeft: 1, marginRight: 1,
  }
});
