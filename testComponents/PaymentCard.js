import React from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
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
      imageWrapDims: {}
    }
  }

  render() {
    return(
      <View style={styles.wrap}>
        <View style={{flexDirection: 'row'}}>
          <View style={{justifyContent: 'center', borderWidth: 0.0, borderColor: 'yellow', padding: 14}} onLayout={(e) => this.setState({ imageWrapDims: e.nativeEvent.layout })}>
            <View style={styles.imageWrap}>
              <Image style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2}} source={{uri: 'https://scontent-ord1-1.xx.fbcdn.net/t31.0-8/15000684_1250241661662960_1895438605245811540_o.jpg'}} />
            </View>
          </View>
          <View style={{flex: 0.85, justifyContent: 'center', borderWidth: 0.0, borderColor: 'pink'}}>
            <Text style={{color: colors.deepBlue, fontSize: 22, fontWeight: '200'}}>
              {"Brady Sheridan"}
            </Text>
            <Text style={{color: colors.slateGrey, fontSize: 14}}>
              {"Next payment: Nov 13 at 1:00am"}
            </Text>
          </View>
          <View style={{flex: 0.15, justifyContent: 'center', borderWidth: 0.0, borderColor: 'pink'}}>
            <Entypo name={"chevron-thin-right"} size={18} color={colors.slateGrey} />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: this.state.imageWrapDims.width || 0, flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={[styles.amountText, {fontSize: 14, paddingTop: 5}]}>
              {"+"}
            </Text>
            <Text style={[styles.amountText, {fontSize: 14, paddingBottom: 7}]}>
              {"$"}
            </Text>
            <Text style={styles.amountText}>
              {"10"}
            </Text>
          </View>
          <View style={{flex: 1.0, flexDirection: 'column', paddingRight: 20}}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.frequencyAndPurposeWrap}>
              <EvilIcons name={"calendar"} size={22} color={colors.maastrichtBlue} />
                <Text style={[styles.frequencyAndPurposeText, {paddingLeft: 3}]}>
                  {"Monthly"}
                </Text>
                <EvilIcons name={"pencil"} size={22} color={colors.maastrichtBlue} style={{paddingLeft: 4}} />
                <Text style={[styles.frequencyAndPurposeText, {paddingLeft: 3}]}>
                  {"Spotify Family Plan"}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.progbarBackground, styles.shadow]} onLayout={(e) => this.setState({ progbarDims: e.nativeEvent.layout })}>
                <View style={[styles.progbarForeground, {width: this.state.progbarDims.width * 0.6 || 0}]} />
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = {
  wrap: {
    flexDirection: 'column',
    backgroundColor: colors.mintCream,
    width: dims.width,
    height: 130
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
    fontSize: 24,
    fontWeight: '200'
  },

  frequencyAndPurposeWrap: {
    flexDirection: 'row',
    flex: 0.9,
    paddingBottom: 4
  },
  frequencyAndPurposeText: {
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
