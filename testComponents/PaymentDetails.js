import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableHighlight, Dimensions, Image, ListView, DataSource, RecyclerViewBackedScrollView, StatusBar, Animated, Easing } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import colors from '../styles/colors'
const dims = Dimensions.get('window')

class PaymentDetails extends React.Component {
  constructor(props) {
    super(props)

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = {
      rows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections([]),
      detailRows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections([]),
      timelineRows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections([])
    }

    this.animatedValues = {}
  }

  componentDidMount() {
    let detailRows = this.generateDetailRows()
    let timelineRows = this.generateTimelineRows()
    let allRows = Object.assign({}, detailRows, timelineRows)
    console.log("allRows", allRows)

    this.setState({
      rows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(allRows)
    }, () => console.log("animatedValues", this.animatedValues))
  }

  generateDetailRows() {
    let rows = {
      "Payment Details": [
        {key: "Current Payment", val: this.props.paymentsMade + " of " + this.props.payments},
        {key: "Status", val: this.props.status},
        {key: "Next Payment", val: this.props.next},
        {key: "Purpose", val: this.props.purpose},
        {key: "Amount", val: "$" + this.props.amount},
        {key: "Frequency", val: this.props.frequency}
      ]
    }

    return rows
  }

  generateTimelineRows() {
    let map = {"Payment Timeline": []}
    let rows = map["Payment Timeline"]

    this.props.timeline.map(row => {
      this.animatedValues[row.id] = {height: new Animated.Value(1)}
      rows.push(row)
    })

    return map
  }

  renderRow(rowData, sectionTitle) {
    if (sectionTitle === 'Payment Timeline') return this.renderTimelineRow(rowData)
    else return this.renderDetailRow(rowData)
  }

  renderDetailRow(params) {
    let { key, val } = params

    return(
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderColor: colors.slateGrey, borderBottomWidth: 1.0}}>
        <Text style={{color: colors.deepBlue}}>{ key }</Text>
        <Text style={{color: colors.deepBlue}}>{ val }</Text>
      </View>
    )
  }

  renderTimelineRow(params) {
    let { timestamp, amount, status, bankAccount, id } = params
    console.log("renderTimelineRow params", params)
    return(
      <View>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={colors.mintCream}
          onPress={() => (this.animatedValues[id].height._value === 1) ? this.expand(id) : this.shrink(id)}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderColor: colors.slateGrey, borderBottomWidth: 1.0}}>
            <Text style={{color: colors.deepBlue}}>{ timestamp }</Text>
            <Text style={{color: colors.deepBlue}}>{ "$" + amount }</Text>
          </View>
        </TouchableHighlight>
        <Animated.View style={{height: this.animatedValues[id].height}}>
          <View style={{flex: 1.0, flexDirection: 'column', overflow: 'hidden', margin: 8}}>
            <Text style={{color: colors.deepBlue}}>
              {"Bank account: " + bankAccount}
            </Text>
          </View>
        </Animated.View>
      </View>
    )
  }

  renderSectionHeader(sectionData, sectionTitle) {
    return(
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 8, backgroundColor: colors.gainsboro}}>
        <Text style={{color: colors.deepBlue}}>{ sectionTitle }</Text>
      </View>
    )
  }

  expand(id) {
    let valToExpand = this.animatedValues[id].height
    Animated.timing(valToExpand, {
      toValue: 100,
      duration: 350,
      easing: Easing.elastic(0.2)
    }).start()
  }

  shrink(id) {
    let valToShrink = this.animatedValues[id].height
    Animated.timing(valToShrink, {
      toValue: 1,
      duration: 350,
      easing: Easing.elastic(0.2)
    }).start()
  }

  render() {
    let { pic, name, purpose, amount, frequency, next, incoming } = this.props

    return(
      <View style={styles.wrap}>
        <StatusBar barStyle='default' />

        { /* Back chevron profile pic, and action sheet toggler */ }
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: dims.width, padding: 30}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={colors.mintCream}
            onPress={() => Actions.pop()}>
            <Entypo name={"chevron-thin-left"} size={22} color={colors.slateGrey} />
          </TouchableHighlight>

          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Image style={{width: 55, height: 55, borderRadius: 27.5}} source={{uri: pic}} />
            <Text style={{color: colors.deepBlue, fontSize: 22, fontWeight: '200', paddingTop: 4, textAlign: 'center'}}>
              {name}
            </Text>
          </View>

          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={colors.mintCream}
            onPress={() => console.log("Showing action sheet...")}>
            <Entypo name={"dots-three-horizontal"} size={22} color={colors.slateGrey} />
          </TouchableHighlight>
        </View>

        { /* Payment details and timeline */ }
        <ListView
          style={{width: dims.width, backgroundColor: 'transparent'}}
          dataSource={this.state.rows}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          enableEmptySections />
      </View>
    )
  }
}

const styles = {
  wrap: {
    backgroundColor: colors.mintCream,
    paddingTop: 20,
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
}

module.exports = PaymentDetails
