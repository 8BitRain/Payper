// Dependencies
import React from 'react';
import { View, Text } from 'react-native';

// Helper functions
import * as Lambda from '../../services/Lambda';

// Custom stylesheets
import colors from '../../styles/colors';

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <Text>{this.props.currentUser.uid}</Text>
      </View>
    );
  }
}

export default Profile;
