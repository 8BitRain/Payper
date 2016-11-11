import React from 'react';
import moment from 'moment';
import { View } from 'react-native';
import { PayCard } from '../../../components/PayCard';

export default class PaymentCards extends React.Component {
  constructor(props) {
    super(props);

    this.payments = [
      {
        pic: "https://s3.amazonaws.com/payper-landerpics/ameera.jpg",
        name: "Ameera Johnson",
        username: "@Ameera-Johnson",
        purpose: "Internet & cable",
        amount: 35,
        frequency: "Monthly",
        nextTimestamp: moment().add(1, 'month').valueOf(),
        next: moment().add(1, 'month').format("MMM D"),
        incoming: true,
        status: "active",
        payments: 12,
        paymentsMade: 8,
        pid: "1",
        token: "asdf1",
        paymentType: "payment"
      },
      {
        pic: "https://s3.amazonaws.com/payper-landerpics/diane.jpg",
        name: "Diane Xue",
        username: "@Diane-Xue",
        purpose: "Rent",
        amount: 450,
        frequency: "Monthly",
        nextTimestamp: moment().add(3, 'days').valueOf(),
        next: moment().add(3, 'days').format("MMM D"),
        incoming: true,
        status: "active",
        payments: 12,
        paymentsMade: 10,
        pid: "2",
        token: "asdf2",
        paymentType: "payment"
      },
      {
        pic: "https://s3.amazonaws.com/payper-landerpics/mo.jpg",
        name: "Mohsin Khan",
        username: "@Mohsin-Khan",
        purpose: "Spotify family plan",
        amount: 5,
        frequency: "Monthly",
        nextTimestamp: moment().add(3, 'weeks').valueOf(),
        next: moment().add(3, 'weeks').format("MMM D"),
        incoming: false,
        status: "active",
        payments: 12,
        paymentsMade: 3,
        pid: "3",
        token: "asdf3",
        paymentType: "request"
      },
      {
        pic: "https://s3.amazonaws.com/payper-landerpics/eric.jpg",
        name: "Eric Smith",
        username: "@Eric-Smith",
        purpose: "Wine of the week",
        amount: 10,
        frequency: "Weekly",
        nextTimestamp: moment().add(5, 'days').valueOf(),
        next: moment().add(5, 'days').format("MMM D"),
        incoming: true,
        status: "active",
        payments: 12,
        paymentsMade: 6,
        pid: "4",
        token: "asdf4",
        paymentType: "payment"
      }
    ];
  }

  render() {
    return(
      <View style={{flex: 1.0}}>
        {
          this.payments.map((payment) => <PayCard {...payment} dummy key={Math.random()} />)
        }
      </View>
    );
  }
};
