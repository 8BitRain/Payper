// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Components
import DynamicHorizontalUserList from '../../../components/DynamicHorizontalUserList/DynamicHorizontalUserList';

// Stylesheets
import colors from '../../../styles/colors';

const dimensions = Dimensions.get('window');

class AmountAndDuration extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={styles.wrap}>
        { /* List of selected users */ }
        <DynamicHorizontalUserList
          contacts={this.props.selectedContacts}
          handleSelect={(user) => this._handleSelect(user)} />

        <Text onPress={() => this.props.prevPage()}>
          Prev
        </Text>
        <Text onPress={() => this.props.nextPage()}>
          Next
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    justifyContent: 'center',
    width: dimensions.width,
    backgroundColor: colors.white,
  },
});

export default AmountAndDuration;
