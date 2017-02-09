import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableHighlight, Dimensions, Image, Animated, Easing } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { parsePaymentDetails } from './helpers'
import { colors } from '../../globalStyles'
const dims = Dimensions.get('window')

let imageDims = {
  width: 56,
  height: 56
}

class PayCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      details: parsePaymentDetails(this.props),
      progbarDims: {},
      profPicDims: {},
      amountDims: {},
      animatedValues: {
        progbarWidth: new Animated.Value(0)
      }
    }

    this.layoutProgbarForeground = this.layoutProgbarForeground.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps === this.props) return
    let details = parsePaymentDetails(nextProps)

    // Ternary conditional is needed because,
    // without it, the progbar width value is overwritten when layoutProgbar is
    // called from within the render function.
    this.setState({details}, () => (this.state.progbarDims.width) ? this.layoutProgbarForeground() : null)
  }

  layoutProfPic(e) {
    this.setState({ profPicDims: e.nativeEvent.layout })
  }

  layoutAmount(e) {
    this.setState({ amountDims: e.nativeEvent.layout })
  }

  layoutProgbarBackground(e) {
    this.setState({ progbarDims: e.nativeEvent.layout }, () => {
      setTimeout(() => this.layoutProgbarForeground(), Math.random() * 250)
    })
  }

  layoutProgbarForeground() {
    let { purpose, payments, paymentsMade } = this.state.details
    let { progbarDims } = this.state
    let percentageComplete = (paymentsMade > 0) ? (paymentsMade / payments) : 0
    let foregroundWidth = (percentageComplete > 0) ? progbarDims.width * percentageComplete : 0
    if (typeof foregroundWidth === 'number') this.animateProgbar({toValue: foregroundWidth})
  }

  animateProgbar(config) {
    let { toValue } = config
    let { progbarWidth } = this.state.animatedValues

    Animated.spring(progbarWidth, {
      toValue: toValue,
      duration: 200
    }).start()
  }

  render() {
    let { dummy, pic, name, purpose, amount, incoming, next, frequency, status, payments, paymentsMade } = this.state.details
    let { progbarWidth } = this.state.animatedValues
    let initialsBuffer = name.split(" ").map((name) => name.charAt(0))
    let initials = initialsBuffer.join("")

    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'transparent'}
        onPress={() => (dummy) ? null : Actions.PaymentDetails(this.state.details)}>

        <View style={[styles.wrap, {paddingTop: 5, paddingBottom: 5}]}>
          <View style={{flexDirection: 'column', flex: 1.0}}>
            <View style={{flexDirection: 'row'}}>

              { /* Profile pic */ }
              <View style={{justifyContent: 'center', padding: 10}} onLayout={(e) => this.layoutProfPic(e)}>
                <View style={styles.imageWrap}>
                  {(pic)
                    ? <Image style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2}} source={{uri: pic}} />
                    : <View style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
                          {initials}
                        </Text>
                      </View> }
                </View>
              </View>

              { /* Name and payment purpose */ }
              <View style={{justifyContent: 'center', paddingLeft: 6}}>
                <Text style={{color: colors.deepBlue, fontSize: 22, fontWeight: '400'}}>
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
              <View style={{flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} onLayout={(e) => this.layoutAmount(e)}>
                <Text style={[styles.amountText, {color: (incoming) ? colors.alertGreen : colors.carminePink, fontSize: 14}]}>
                  {(incoming) ? "+" : "-"}
                </Text>
                <Text style={[styles.amountText, {color: (incoming) ? colors.alertGreen : colors.carminePink, fontSize: 14, alignSelf: 'flex-start', paddingTop: (status.indexOf("pending") >= 0) ? 8 : 3}]}>
                  {"$"}
                </Text>
                <Text style={[styles.amountText, {color: (incoming) ? colors.alertGreen : colors.carminePink, fontSize: (amount > 999) ? 16 : 20}]}>
                  {amount}
                </Text>
              </View>

              { /* Frequency and next payment */ }
              <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'flex-end'}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.freqAndNextPaymentWrap}>
                    <EvilIcons name={"calendar"} size={22} color={colors.maastrichtBlue} />
                    <Text style={[styles.freqAndNextPaymentText, {paddingLeft: 3}]}>
                      {(frequency === "Weekly")
                        ? "Per week"
                        : (frequency === "Monthly")
                          ? "Per month"
                          : "Per undefined" }
                    </Text>
                    <Entypo name={"hour-glass"} size={13} color={colors.maastrichtBlue} style={{paddingLeft: 3, paddingTop: 1}} />
                    <Text style={[styles.freqAndNextPaymentText, {paddingLeft: 3}]}>
                      {next}
                    </Text>
                  </View>
                </View>

                { /* Progress bar or '(!) PENDING' */
                  (status.indexOf("pending") >= 0)
                    ? <View style={{flexDirection: 'row', padding: 4, borderRadius: 4, overflow: 'hidden', backgroundColor: 'rgba(238, 116, 116, 0.5)'}}>
                        <EvilIcons name={"exclamation"} color={colors.carminePink} size={20} />
                        <View style={{width: 4}} />
                        <Text style={{fontSize: 14, color: colors.snowWhite}}>{"Pending"}</Text>
                      </View>
                    : <View style={{flexDirection: 'row'}}>
                        <View style={[styles.progbarBackground, styles.shadow]} onLayout={(e) => this.layoutProgbarBackground(e)}>
                          <Animated.View style={[styles.progbarForeground, {width: progbarWidth}]} />
                        </View>
                      </View> }
              </View>
            </View>
          </View>

          { /* Chevron */ }
          <View style={{padding: 10}}>
            <Entypo name={"chevron-thin-right"} color={colors.slateGrey} size={20} style={{alignSelf: 'flex-start'}} />
          </View>

          { /* Notice indiciator (if need be) */ }
          <View style={{position: 'absolute', top: 0, right: 0, padding: 8}}>
            {(paymentsMade === payments)
              ? <EvilIcons name={"check"} color={colors.alertGreen} size={24} />
              : (!status || status.indexOf("pending") === -1)
                ? null
                : <EvilIcons name={"exclamation"} color={colors.alertRed} size={24} /> }
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = {
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.snowWhite,
    width: dims.width * 0.94,
    alignItems: 'center',
    paddingLeft: 15,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 10,
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0.25,
      width: 0.25
    }
  },
  imageWrap: {
    width: imageDims.width,
    height: imageDims.height,
    borderRadius: imageDims.width / 2,
    shadowColor: colors.slateGrey,
    shadowOpacity: 1.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  amountText: {
    color: colors.alertGreen,
    fontSize: 20,
    fontWeight: '400'
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
    backgroundColor: colors.medGrey
  },
  progbarForeground: {
    backgroundColor: colors.accent,
    borderRadius: 5
  }
}

module.exports = PayCard
