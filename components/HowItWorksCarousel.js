import React from 'react'
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import Carousel from 'react-native-carousel'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'

const dims = Dimensions.get('window')

class HowItWorksCarousel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {activePage: 0}

    this.pages = [
      {
        icon: "compass",
        title: "Explore Subscriptions",
        body: "Hop on a friend's subscription or broadcast your own. Just tell us how much and how often, we'll handle the rest."
      },
      {
        icon: "credit",
        title: "Pay via Payper",
        body: "Subscription details (login info, credentials, etc.) are securely transferred after payment has been initated. Payper has no transaction fees!"
      },
      {
        icon: "bell",
        title: "Forget About It",
        body: "Sit back and enjoy your subscription - we'll notify you when it's nearing renewal."
      }
    ]
  }

  componentDidMount() {
    setInterval(() => this.setState({activePage: this.carousel.state.activePage}), 100)
  }

  render() {
    return (
      <View>

        { /* Swipable Pages */ }
        <Carousel ref={(ref) => (this.carousel) ? null : this.carousel = ref} animate={false} hideIndicators>
          {
            this.pages.map((page, i) => {
              return(
                <View key={page.title} style={{width: dims.width, justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', borderTopRightRadius: 6, borderTopLeftRadius: 6, paddingLeft: 14, paddingTop: 10, paddingBottom: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)', width: dims.width * 0.85}}>
                    <Entypo name={page.icon} size={22} color={colors.deepBlue} />
                    <Text style={{fontSize: 18, fontWeight: '400', paddingLeft: 10}}>
                      {page.title}
                    </Text>
                  </View>
                  <View style={{borderBottomRightRadius: 6, borderBottomLeftRadius: 6, padding: 12, backgroundColor: colors.lightGrey, width: dims.width * 0.85}}>
                    <Text style={{fontSize: 15, fontWeight: '300'}}>
                      {page.body}
                    </Text>
                  </View>
                </View>
              )
            })
          }
        </Carousel>

        { /* Pagination Indicators */ }
        <View style={{flexDirection: 'row',  backgroundColor: 'transparent', justifyContent: "center", alignItems: "center"}}>
          {
            this.pages.map((page, i) => {
              return(
                <Text key={page.title} style={{fontSize: 24, color: (this.state.activePage === i) ? 'rgb(97, 97, 97)' : colors.medGrey}}>
                  {"•"}
                </Text>
              )
            })
          }
        </View>

      </View>
    )
  }
}

module.exports = HowItWorksCarousel
