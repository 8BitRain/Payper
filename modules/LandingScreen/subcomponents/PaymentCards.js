// Dependencies
import React from 'react';
import { View, Text, Image, Dimensions, Animated, Easing } from 'react-native';
import moment from 'moment';
import colors from '../../../styles/colors';

// Components
import Dummy from '../../../components/PaymentCards/Dummy';

const dimensions = Dimensions.get('window');

export default class PaymentCards extends React.Component {
  constructor(props) {
    super(props);

    this.payments = {
      "ameera": {
        amount: '35',
        confirmed: true,
        created_at: 1471468155170,
        nextPayment: moment().add(1, 'hour').valueOf(),
        purpose: 'Internet & cable',
        payments: '12',
        paymentsMade: Math.floor(12 * Math.random()),
        recip_id: "",
        recip_name: "Ameera Johnson",
        recip_pic: "https://s3.amazonaws.com/payper-landerpics/ameera.jpg",
        sender_id: "",
        sender_name: "Brady Sheridan",
        sender_pic: "",
        type: "pay",
        token: "",
        invite: false,
        info: ""
      },
      "diane": {
        amount: '346.50',
        confirmed: true,
        created_at: 1471468155170,
        nextPayment: moment().add(5, 'days').add(22, 'hours').valueOf(),
        purpose: 'Rent',
        payments: '9',
        paymentsMade: Math.floor(9 * Math.random()),
        recip_id: "",
        recip_name: "Diane Xue",
        recip_pic: "https://s3.amazonaws.com/payper-landerpics/diane.jpg",
        sender_id: "",
        sender_name: "Brady Sheirdan",
        sender_pic: "",
        type: "pay",
        token: "",
        invite: false,
        info: ""
      },
      "mohsin": {
        amount: '7.50',
        confirmed: true,
        created_at: 1471468155170,
        nextPayment: moment().add(14, 'hours').valueOf(),
        purpose: 'Tidal family plan',
        payments: '8',
        paymentsMade: Math.floor(8 * Math.random()),
        recip_id: "",
        recip_name: "Mohsin Khan",
        recip_pic: "https://s3.amazonaws.com/payper-landerpics/mo.jpg",
        sender_id: "",
        sender_name: "Brady Sheridan",
        sender_pic: "",
        type: "pay",
        token: "",
        invite: false,
        info: ""
      },
      "eric": {
        amount: '8',
        confirmed: true,
        created_at: 1471468155170,
        nextPayment: moment().add(2, 'weeks').add(13, 'hours').valueOf(),
        purpose: 'Wine of the month',
        payments: '6',
        paymentsMade: Math.floor(6 * Math.random()),
        recip_id: "",
        recip_name: "Eric Smith",
        recip_pic: "https://s3.amazonaws.com/payper-landerpics/eric.jpg",
        sender_id: "",
        sender_name: "Brady Sheridan",
        sender_pic: "",
        type: "pay",
        token: "",
        invite: false,
        info: ""
      }
    };
  }

  animateProgBar() {
    console.log("animateProgBar was invoked...")
  }

  render() {
    return(
      <View style={{ flex: 1.0, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        <View onPress={() => alert('yo')} style={{ justifyContent: 'center', borderBottomWidth: 1.0, borderColor: colors.lightGrey }}>
          <Dummy
            out
            style={{padding: 30}}
            payment={this.payments["ameera"]}
            callbackMenu={() => { return false }} />
        </View>
        <View style={{ justifyContent: 'center', borderBottomWidth: 1.0, borderColor: colors.lightGrey }}>
          <Dummy
            out
            style={{padding: 30}}
            payment={this.payments["mohsin"]}
            callbackMenu={() => { return false }} />
        </View>
        <View style={{ justifyContent: 'center', borderBottomWidth: 1.0, borderColor: colors.lightGrey }}>
          <Dummy
            out
            style={{padding: 30}}
            payment={this.payments["diane"]}
            callbackMenu={() => { return false }} />
        </View>
        <View style={{ justifyContent: 'center', borderBottomWidth: 1.0, borderColor: colors.lightGrey }}>
          <Dummy
            out
            style={{padding: 30}}
            payment={this.payments["eric"]}
            callbackMenu={() => { return false }} />
        </View>
      </View>
    );
  }
};
