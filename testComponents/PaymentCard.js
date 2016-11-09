import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableHighlight, Dimensions, Image } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import colors from '../styles/colors'
const dims = Dimensions.get('window')

let imageDims = {
  width: 56,
  height: 56
}

class PaymentCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      progbarDims: {},
      profPicDims: {},
      amountDims: {}
    }

    this.details = {
      pic: "https://scontent-ord1-1.xx.fbcdn.net/t31.0-8/15000684_1250241661662960_1895438605245811540_o.jpg",
      name: "Brady Sheridan",
      purpose: "Spotify Family Plan",
      amount: 999,
      frequency: "Monthly",
      next: "Nov 13th",
      incoming: false,
      status: "Active",
      payments: 10,
      paymentsMade: 7,
      timeline: [
        {
          timestamp: "Jan 13th",
          amount: 10,
          bankAccount: "",
          transferStatus: "arrived",
          id: "1"
        },
        {
          timestamp: "Dec 13th",
          amount: 10,
          bankAccount: "",
          transferStatus: "arrived",
          id: "2"
        },
        {
          timestamp: "Nov 13th",
          amount: 10,
          bankAccount: "",
          transferStatus: "arrived",
          id: "3"
        },
        {
          timestamp: "Oct 13th",
          amount: 10,
          bankAccount: "",
          transferStatus: "arrived",
          id: "4"
        },
        {
          timestamp: "Sep 13th",
          amount: 10,
          bankAccount: "",
          transferStatus: "arrived",
          id: "5"
        }
      ]
    }
  }

  layoutProfPic(e) {
    console.log("image wrap layout\n", e.nativeEvent.layout)
    this.setState({ profPicDims: e.nativeEvent.layout })
  }

  layoutAmount(e) {
    console.log("amount wrap layout\n", e.nativeEvent.layout)
    this.setState({ amountDims: e.nativeEvent.layout })
  }

  render() {
    let { pic, name, purpose, amount, frequency, next, incoming } = this.details

    return(

      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={colors.mintCream}
        onPress={() => Actions.PaymentDetails(this.details)}>

        <View style={styles.wrap}>
          <View style={{flexDirection: 'column', flex: 1.0}}>
            <View style={{flexDirection: 'row'}}>

              { /* Profile pic */ }
              <View style={{justifyContent: 'center', padding: 10}} onLayout={(e) => this.layoutProfPic(e)}>
                <View style={styles.imageWrap}>
                  <Image style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2}} source={{uri: pic}} />
                </View>
              </View>

              { /* Name and payment purpose */ }
              <View style={{flex: 0.85, justifyContent: 'center'}}>
                <Text style={{color: colors.deepBlue, fontSize: 22, fontWeight: '200'}}>
                  {name}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <EvilIcons name={"pencil"} size={22} color={colors.slateGrey} />
                  <Text style={{color: colors.slateGrey, fontSize: 14}}>
                    {purpose}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row', paddingBottom: 10}}>

              { /* Payment amount */ }
              <View style={{width: this.state.profPicDims.width || null, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} onLayout={(e) => this.layoutAmount(e)}>
                <Text style={[styles.amountText, {color: (incoming) ? colors.alertGreen : colors.alertRed, fontSize: 14}]}>
                  {(incoming) ? "+" : "-"}
                </Text>
                <Text style={[styles.amountText, {color: (incoming) ? colors.alertGreen : colors.alertRed, fontSize: 14, alignSelf: 'flex-start', paddingTop: 3}]}>
                  {"$"}
                </Text>
                <Text style={[styles.amountText, {color: (incoming) ? colors.alertGreen : colors.alertRed, fontSize: (amount > 999) ? 16 : 20}]}>
                  {amount}
                </Text>
              </View>

              { /* Frequency and next payment */ }
              <View style={{flex: 1.0, flexDirection: 'column'}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.freqAndNextPaymentWrap}>
                    <EvilIcons name={"calendar"} size={22} color={colors.maastrichtBlue} />
                    <Text style={[styles.freqAndNextPaymentText, {paddingLeft: 3}]}>
                      {frequency}
                    </Text>
                    <Entypo name={"hour-glass"} size={17} color={colors.maastrichtBlue} style={{paddingLeft: 3}} />
                    <Text style={[styles.freqAndNextPaymentText, {paddingLeft: 3}]}>
                      {next}
                    </Text>
                  </View>
                </View>

                { /* Progress bar */ }
                <View style={{flexDirection: 'row'}}>
                  <View style={[styles.progbarBackground, styles.shadow]} onLayout={(e) => this.setState({ progbarDims: e.nativeEvent.layout })}>
                    <View style={[styles.progbarForeground, {width: this.state.progbarDims.width * 0.6 || 0}]} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          { /* Chevron */ }
          <View style={{justifyContent: 'center', paddingRight: 15}}>
            <Entypo name={"chevron-thin-right"} size={18} color={colors.slateGrey} />
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = {
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.mintCream,
    width: dims.width,
    alignItems: 'center',
    paddingLeft: 15
  },
  imageWrap: {
    width: imageDims.width,
    height: imageDims.height,
    borderRadius: imageDims.width / 2,
    shadowColor: colors.slateGrey,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  amountText: {
    color: colors.alertGreen,
    fontSize: 20,
    fontWeight: '200'
  },

  freqAndNextPaymentWrap: {
    flexDirection: 'row',
    flex: 0.9,
    paddingBottom: 4
  },
  freqAndNextPaymentText: {
    color: colors.maastrichtBlue,
    fontSize: 14
  },

  progbarBackground: {
    flexDirection: 'row',
    flex: 0.9,
    height: 7,
    borderRadius: 5,
    backgroundColor: colors.slateGrey,

    shadowColor: colors.slateGrey,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  progbarForeground: {
    backgroundColor: colors.maastrichtBlue,
    borderRadius: 5
  }
}

module.exports = PaymentCard
