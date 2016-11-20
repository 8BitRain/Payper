// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import {colors} from '../../../globalStyles';
const dimensions = Dimensions.get('window');

export default class DateOfBirth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: (this.props.dob) ? this.props.dob : "01011994",
      index0Focused: false,
      index1Focused: false,
      index2Focused: false,
      validationError: false,
      birthdayCake: false,
      validationError: false,
      index: 0,
    };

    this.day = "";
    this.month = "";
    this.year = "";
    this.dates = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.values = ["", "", ""];
    this.initalizedFromCache = false;
  }

  componentDidMount() {
    this.props.induceState(this.refs);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dob && !this.initalizedFromCache) {
      let buffer = [nextProps.dob.year, nextProps.dob.month, nextProps.dob.date];
      let dob = buffer.join("-");
      this.setState({ date: dob });
      this.initalizedFromCache = true;
    }
  }

  handleChangeText(input) {
  // Handle resetting validation message
  this.setState({validationError: false})
  console.log(input);
  // Update value
  this.values[this.state.index] = input;
  switch (this.state.index) {
    case 0:
      this.month = input;
      break;
    case 1:
      this.day = input;
      break;
    case 2:
      this.year = input;
      if (input.length == 4) this.setState({birthdayCake: true});
      break;
  }

  //Celebrate Birth!

  }

  validateDate(input, type){
    console.log(input);
    console.log(Number(input));
    if(input.includes(" ")){
      throw "A blank space is not an acceptable form of input";
    }
    if(Number(input) < 1 ){
      throw "An input value less than 1 was entered";
    }
    if(Number(input) < 10 && input.length != 2){
      console.log("Value: " + input)
      return "0" + input;
    }
    if(type == "day"){
      if(Number(input) > 31){
        throw "Day values must be between 1 and 31"
      }
    }
    if(type == "month"){
      if(Number(input) > 12){
        throw "Month values must be between 1 and 12"
      }
    }
    if(type == "year" && input.length != 4){
      console.log("input length ")
      throw "Year must be 4 digits"
    }
    return input;
  }


  handleSubmit() {
    //var splitDate = this.state.date.split("-");
    //Validation on
    try{
      var date = this.validateDate(this.day, "day");
      var month = this.validateDate(this.month, "month");
      var year = this.validateDate(this.year, "year");
    }catch(err){
      console.log(err);
      this.setState({validationError: true});
      return;
    }
    this.setState({date: date + month + year})
    var parsedDate = { date: date, month: month, year: year };
    console.log(parsedDate);
    this.props.induceState({ dob: parsedDate });
    this.props.nextPage();
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '400', color: colors.white, textAlign: 'center' }}>
            { "When were you born?" }
          </Text>
        </View>

        <View style={styles.textInputWrap}>
          <TextInput ref="dateInput" defaultValue={this.values[0]} onFocus={() => this.setState({ index: 0, index0Focused: true, validationError: false })} maxLength={2} keyboardType={'number-pad'} placeholder={(this.state.index0Focused) ? null : "Month"} placeholderTextColor={colors.deepBlue} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e) } />
          <Text style={styles.dateDash}>-</Text>
          <TextInput ref="1" defaultValue={this.values[1]} onFocus={() => this.setState({ index: 1, index1Focused: true, validationError: false })} maxLength={2} keyboardType={'number-pad'} placeholder={(this.state.index1Focused) ? null : "Day"} placeholderTextColor={colors.deepBlue} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <Text style={styles.dateDash}>-</Text>
          <TextInput ref="2" defaultValue={this.values[2]} onFocus={() => this.setState({ index: 2, index2Focused: true, validationError: false })} maxLength={4} keyboardType={'number-pad'} placeholder={(this.state.index2Focused) ? null : "Year"} placeholderTextColor={colors.deepBlue} style={styles.textInput}  onChangeText={(e) => this.handleChangeText(e)} />
        </View>

        <View style={{flexDirection: "row"}}>
         <Text style={styles.birthdayText}>You were born on </Text>
         {Number(this.month) ? <Text style={styles.birthdayText}> {this.dates[parseInt(this.month)] }</Text> : null}
         {Number(this.day) ? <Text style={styles.birthdayText}> {parseInt(this.day)}</Text> : null}
         {Number(this.year) ? <View style={{flexDirection: "row"}}><Text style={styles.birthdayText}> {parseInt(this.year)} </Text></View> : null}
        </View>

        {this.state.birthdayCake && this.year ?  <Text style={styles.birthdayTextEmoji}>🎉</Text> : null}

        <StickyView>
          <ContinueButton text={(this.state.validationError) ? "Please enter a valid date of birth" : "Continue"} onPress={() => this.handleSubmit()} />
        </StickyView>
      </View>
    );
  }
}

const datePickerStyles = StyleSheet.create({
  dateInput: {
    height: 55,
    width: dimensions.width * 0.75,
    marginTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 0
  },
  dateText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 16,
    color: colors.white
  }
});

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    width: dimensions.width,
    backgroundColor: colors.snowWhite,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20
  },
  inputWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  },
  input: {
    height: 55,
    width: dimensions.width * 0.75,
    marginTop: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    color: colors.white
  },
  dateDash:{
    color: colors.white,
    fontSize: 32,
    marginLeft: 2.5,
    marginRight: 2.5
  },
  birthdayText:{
    color: colors.white,
    fontSize: 20,
    marginTop: 25,
    textAlign: "center",
    fontFamily: "Roboto",
    fontWeight: "400"
  },

  birthdayTextEmoji:{
    fontSize: 48,
    marginTop: 20
  }
});
