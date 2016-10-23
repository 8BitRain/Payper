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
    this.state = { date: this.props.dob };
  }

  handleSubmit() {
    var splitDate = this.state.date.split("-");
    var parsedDate = { date: splitDate[2], month: splitDate[1], year: splitDate[0] };
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

        <View style={styles.inputWrap}>
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
  input: {
    height: 55,
    width: dimensions.width * 0.75,
    marginTop: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    color: colors.white
  }
});
