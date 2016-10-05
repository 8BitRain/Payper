// Dependencies
import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import moment from 'moment';
import Carousel from 'react-native-carousel';
import carousel from '../styles/carousel';
import container from '../styles/container';

// Components
import Dummy from '../../../components/PaymentCards/Dummy';

const dimensions = Dimensions.get('window');

export default class ImageCarousel extends React.Component {
  render() {
    var imgWidth = dimensions.width - 50;
    var imgHeight = 165 / 350;
        imgHeight *= imgWidth;
    return(
      <Carousel hideIndicators={true} animate={true} delay={2750} width={dimensions.width}>
        <View style={[carousel.container, container.image]}>
          <Dummy
            out
            style={{padding: 30}}
            payment={{
              amount: '10',
              confirmed: true,
              created_at: 1471468155170,
              nextPayment: moment().add(1, 'hour'),
              purpose: 'Wifi',
              payments: '10',
              paymentsMade: Math.floor(10 * Math.random()),
              recip_id: "",
              recip_name: "Brady Marada",
              recip_pic: "",
              sender_id: "",
              sender_name: "Brady Sheridan",
              sender_pic: "",
              type: "pay",
              token: "",
              invite: false,
              info: "",
            }}
            callbackMenu={() => alert("I'm just a dummy!")} />
        </View>
        <View style={[carousel.container, container.image]}>
          <Dummy
            out
            style={{padding: 30}}
            payment={{
              amount: '35',
              confirmed: true,
              created_at: 1471468155170,
              nextPayment: moment().add(14, 'hours'),
              purpose: 'Beer club',
              payments: '8',
              paymentsMade: Math.floor(8 * Math.random()),
              recip_id: "",
              recip_name: "Vash Smith",
              recip_pic: "",
              sender_id: "",
              sender_name: "Brady Sheridan",
              sender_pic: "",
              type: "pay",
              token: "",
              invite: false,
              info: "",
            }}
            callbackMenu={() => alert("I'm just a dummy!")} />
        </View>
        <View style={[carousel.container, container.image]}>
          <Dummy
            out
            style={{padding: 30}}
            payment={{
              amount: '346.50',
              confirmed: true,
              created_at: 1471468155170,
              nextPayment: moment().add(5, 'days').add(22, 'hours'),
              purpose: 'Rent baby!',
              payments: '12',
              paymentsMade: Math.floor(12 * Math.random()),
              recip_id: "",
              recip_name: "Luke Khan",
              recip_pic: "",
              sender_id: "",
              sender_name: "Brady Sheirdan",
              sender_pic: "",
              type: "pay",
              token: "",
              invite: false,
              info: "",
            }}
            callbackMenu={() => alert("I'm just a dummy!")} />
        </View>
        <View style={[carousel.container, container.image]}>
          <Dummy
            out
            style={{padding: 30}}
            payment={{
              amount: '6',
              confirmed: true,
              created_at: 1471468155170,
              nextPayment: moment().add(2, 'weeks').add(13, 'hours'),
              purpose: 'Spotify family plan',
              payments: '12',
              paymentsMade: Math.floor(12 * Math.random()),
              recip_id: "",
              recip_name: "Mohsin Odell",
              recip_pic: "",
              sender_id: "",
              sender_name: "Brady Sheridan",
              sender_pic: "",
              type: "pay",
              token: "",
              invite: false,
              info: "",
            }}
            callbackMenu={() => alert("I'm just a dummy!")} />
        </View>
      </Carousel>
    );
  }
};
