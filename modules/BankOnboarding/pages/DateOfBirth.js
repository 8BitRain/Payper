// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class DateOfBirth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: (this.props.dob) ? this.props.dob : "01011994",
      index: 0
    };
    this.values = ["", "", "", "", "", "", "", ""];
    this.initalizedFromCache = false;
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
    // Update value
    this.values[this.state.index] = input;

    // Focus next TextInput
    console.log(this.state.index);
    if (this.state.index !== 7 && input !== "") {
      this.refs[this.state.index].blur();
      this.refs[this.state.index + 1].focus();
    } else if (this.state.index !== 0 && input === "" && this.values[this.state.index] === "") {
      this.refs[this.state.index].blur();
      this.refs[this.state.index - 1].focus();
    }

    // Update dob
    var date = this.validateAndReturnDOB();
    this.setState({ date: date });
  }

  validateAndReturnDOB() {
    for (var i in this.values)
      if (this.values[i] === "")
        return null;
    return this.values.join("");
  }

  handleSubmit() {
    console.log(this.state.date);
    //var splitDate = this.state.date.split("-");
    var date = this.state.date[0] + this.state.date[1];
    var month = this.state.date[2] + this.state.date[3];
    var year = this.state.date[4] + this.state.date[5] + this.state.date[6] + this.state.date[7];

    var parsedDate = { date: date, month: month, year: year };
    console.log(parsedDate);
    this.props.induceState({ dob: parsedDate });
    this.props.nextPage();
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "When were you born?" }
          </Text>
        </View>

        {/*<View style={styles.inputWrap}>
          <DatePicker
            date={this.state.date}
            mode={"date"}
            format={"YYYY-MM-DD"}
            minDate={(new Date().getFullYear() - 200) + "-01-01"}
            maxDate={(new Date().getFullYear() - 10) + "-01-01"}
            confirmBtnText={"Confirm"}
            cancelBtnText={"Cancel"}
            customStyles={datePickerStyles}
            showIcon={false}
            onDateChange={date => this.setState({ date: date })} />
        </View>*/}
        <View style={styles.textInputWrap}>
          <TextInput ref="0" defaultValue={this.values[0]} onFocus={() => this.setState({ index: 0 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="1" defaultValue={this.values[1]} onFocus={() => this.setState({ index: 1 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <Text style={styles.dateDash}>-</Text>
          <TextInput ref="2" defaultValue={this.values[2]} onFocus={() => this.setState({ index: 2 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="3" defaultValue={this.values[3]} onFocus={() => this.setState({ index: 3 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <Text style={styles.dateDash}>-</Text>
          <TextInput ref="4" defaultValue={this.values[4]} onFocus={() => this.setState({ index: 4 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="5" defaultValue={this.values[5]} onFocus={() => this.setState({ index: 5 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="6" defaultValue={this.values[6]} onFocus={() => this.setState({ index: 6 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
          <TextInput ref="7" defaultValue={this.values[7]} onFocus={() => this.setState({ index: 7 })} maxLength={1} keyboardType={'number-pad'} style={styles.textInput} onChangeText={(e) => this.handleChangeText(e)} />
        </View>

        <StickyView>
          <ContinueButton text={"Continue"} onPress={() => this.handleSubmit()} />
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
    fontWeight: '100',
    fontSize: 16,
    color: colors.white
  }
});

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    width: dimensions.width,
    backgroundColor: colors.richBlack,
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
    width: dimensions.width * 0.10,
    height: dimensions.width * 0.10,
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
    fontSize: 32
  }
});
