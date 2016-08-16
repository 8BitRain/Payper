// Dependencies
import React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Actions } from 'react-native-router-flux';

// Helpers
import * as Lambda from '../../services/Lambda';

// Stylesheets
import colors from '../../styles/colors';

const height = 80;

class FundingSource extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <TouchableHighlight
        onPress={() => console.log("Pressed funding source.")}
        underlayColor={'transparent'}
        opacity={0.7}>
        <View style={{height: height, flex: 1.0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'transparent'}} onPress={() => options.callback()}>

          { /* Active? */ }
          <TouchableHighlight
            style={{height: height, flex: 0.17}}
            underlayColor={'transparent'}
            onPress={() => alert('yo')}
            activeOpacity={0.7}>

            <View style={{flex: 1.0, backgroundColor: (this.props.fundingSource.active) ? colors.alertYellow : colors.white, justifyContent: 'center', alignItems: 'center'}}>
              <Entypo name={(this.props.fundingSource.active) ? "star" : "star-outlined" } size={22.5} color={(this.props.fundingSource.active) ? colors.white : colors.alertYellow} />
              { (this.props.fundingSource.active) ? <Text style={{color: (this.props.fundingSource.active) ? colors.white : colors.alertYellow}}>Active</Text> : null }
            </View>

          </TouchableHighlight>

          { /* Info */ }
          <View style={{height: height, flex: 0.73, backgroundColor: colors.darkGrey, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 15, paddingRight: 15, borderBottomWidth: 0.5, borderBottomColor: colors.accent}}>
            <Text style={{color: colors.accent, fontSize: 16, padding: 0.5}}>{ this.props.fundingSource.name }</Text>
            <Text style={{color: colors.white, fontSize: 14, padding: 0.5}}>Bank: { this.props.fundingSource.bank }</Text>
            <Text style={{color: colors.white, fontSize: 14, padding: 0.5}}>Account Number: { this.props.fundingSource.accountNumber }</Text>
          </View>

        </View>
      </TouchableHighlight>
    );
  }
}

export default FundingSource;
