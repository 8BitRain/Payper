import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableHighlight, Dimensions, Image } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../../styles/colors'
const dims = Dimensions.get('window')

let imageDims = {
  width: 56,
  height: 56
}

class PayCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      progbarDims: {},
      profPicDims: {},
      amountDims: {}
    }
  }

  layoutProfPic(e) {
    this.setState({ profPicDims: e.nativeEvent.layout })
  }

  layoutAmount(e) {
    this.setState({ amountDims: e.nativeEvent.layout })
  }

  getInitials() {
    let { name } = this.props
    let buffer = name.split(" ").map((name) => name.charAt(0))
    let initials = buffer.join("")
    return initials
  }

  render() {
    let { dummy, pic, name, purpose, amount, frequency, next, incoming, status, payments, paymentsMade } = this.props

    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={colors.richBlack}
        onPress={() => (dummy) ? null : Actions.PaymentDetails(this.props)}>

        <View style={[styles.wrap, {paddingTop: 5, marginBottom: 10, paddingBottom: 5, borderBottomWidth: 0.0, borderBottomColor: colors.turqouise}]}>
          <View style={{flexDirection: 'column', flex: 1.0}}>
            <View style={{flexDirection: 'row'}}>

              { /* Profile pic */ }
              <View style={{justifyContent: 'center', padding: 10}} onLayout={(e) => this.layoutProfPic(e)}>
                <View style={styles.imageWrap}>
                  {(pic)
                    ? <Image style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2}} source={{uri: pic}} />
                    : <View style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.turqouise, fontSize: 18, fontWeight: '900', fontFamily: "Montserrat"}}>
                          {this.getInitials()}
                        </Text>
                      </View> }
                </View>
              </View>

              { /* Name and payment purpose */ }
              <View style={{justifyContent: 'center', paddingLeft: 6}}>
                <Text style={{color: colors.turqouise, fontSize: 22, fontWeight: '800', fontFamily: "Montserrat"}}>
                  {name}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <EvilIcons name={"tag"} size={22} color={colors.snow} />
                  <Text style={{color: colors.snow, fontSize: 14, fontFamily: 'Montserrat'}}>
                    {purpose}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row', paddingBottom: 10}}>

              { /* Payment amount */ }
              <View style={{width: this.state.profPicDims.width || null, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} onLayout={(e) => this.layoutAmount(e)}>
                <Text style={[styles.amountText, {color: (incoming) ? colors.alertGreen : colors.pastelRed, fontSize: 14, fontFamily: 'Montserrat'}]}>
                  {(incoming) ? "+" : "-"}
                </Text>
                <Text style={[styles.amountText, {color: (incoming) ? colors.alertGreen : colors.pastelRed, fontSize: 14, fontFamily: 'Montserrat', alignSelf: 'flex-start', paddingTop: 3}]}>
                  {"$"}
                </Text>
                <Text style={[styles.amountText, {color: (incoming) ? colors.alertGreen : colors.pastelRed,   fontFamily: 'Montserrat', fontSize: (amount > 999) ? 16 : 20}]}>
                  {amount}
                </Text>
              </View>

              { /* Frequency and next payment */ }
              <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'flex-end'}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.freqAndNextPaymentWrap}>
                    <EvilIcons name={"calendar"} size={22} color={colors.slateGrey} />
                    <Text style={[styles.freqAndNextPaymentText, {paddingLeft: 3}]}>
                      {frequency}
                    </Text>
                    <Entypo name={"hour-glass"} size={13} color={colors.slateGrey} style={{paddingLeft: 3}} />
                    <Text style={[styles.freqAndNextPaymentText, {paddingLeft: 3}]}>
                      {next}
                    </Text>
                  </View>
                </View>

                { /* Progress bar */ }
                <View style={{flexDirection: 'row'}}>
                  <View style={[styles.progbarBackground, styles.shadow]} onLayout={(e) => this.setState({ progbarDims: e.nativeEvent.layout })}>
                    <View style={[styles.progbarForeground, {width: this.state.progbarDims.width * ((paymentsMade > 0) ? (paymentsMade / payments) : 0) || 0}]} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          { /* Chevron */ }
          <View style={{padding: 25}}>
            <Entypo name={"chevron-thin-right"} color={colors.snow} size={20} style={{alignSelf: 'flex-start'}} />
          </View>

          { /* Notice indiciator (if need be) */ }
          <View style={{position: 'absolute', top: 0, right: 0, padding: 8}}>
            {(status.indexOf("pending") === -1)
              ? null
              : <EvilIcons name={"exclamation"} color={colors.alertYellow} size={24} /> }
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = {
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.richBlack,
    width: dims.width,
    alignItems: 'center',
    paddingLeft: 15
  },
  imageWrap: {
    width: imageDims.width,
    height: imageDims.height,
    borderRadius: imageDims.width / 2,
    borderBottomColor: colors.slateGrey,
    backgroundColor: colors.snow,
    shadowColor: colors.snow,
    shadowOpacity: .2,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  amountText: {
    color: colors.alertGreen,
    fontSize: 20,
    fontWeight: '300',
    fontFamily: 'Montserrat'
  },

  freqAndNextPaymentWrap: {
    flexDirection: 'row',
    flex: 0.9,
    paddingBottom: 4
  },
  freqAndNextPaymentText: {
    color: colors.slateGrey,
    fontSize: 14,
    fontFamily: 'Montserrat'
  },

  progbarBackground: {
    flexDirection: 'row',
    flex: 0.9,
    height: 7,
    borderRadius: 5,
    backgroundColor: colors.slateGrey,

    shadowColor: colors.slateGrey,
    shadowOpacity: 0,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  progbarForeground: {
    backgroundColor: colors.turqouise,
    borderRadius: 5
  }
}

module.exports = PayCard
