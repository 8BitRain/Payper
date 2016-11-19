import React from 'react'
import moment from 'moment'
import { Actions } from 'react-native-router-flux'
import { View, TouchableHighlight, ListView, ScrollView, RecyclerViewBackedScrollView, Dimensions, Animated, Easing, StatusBar, Text, Image, Modal } from 'react-native'
import { VibrancyView } from "react-native-blur"
import Drawer from 'react-native-drawer'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

import { colors } from '../../globalStyles'
import { SideMenu, PayCard } from '../../components'
import { CreatePaymentView } from '../../modules'
const dims = Dimensions.get('window')

class NewMainView extends React.Component {
  constructor(props) {
    super(props)

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    let plusAngleInterpolator = new Animated.Value(0)
    let chevronAngleInterpolator = new Animated.Value(0)
    this.animatedValues = {
      chevronAngleInterpolator: chevronAngleInterpolator,
      chevronAngle: chevronAngleInterpolator.interpolate({
        inputRange: [0, 150],
        outputRange: ['0deg', '180deg']
      }),
      plusAngleInterpolator: plusAngleInterpolator,
      plusAngle: plusAngleInterpolator.interpolate({
        inputRange: [0, 150],
        outputRange: ['0deg', '135deg']
      }),
      filterMenuHeight: new Animated.Value(1)
    }

    this.state = {
      all: this.EMPTY_DATA_SOURCE.cloneWithRows([]),
      inc: this.EMPTY_DATA_SOURCE.cloneWithRows([]),
      out: this.EMPTY_DATA_SOURCE.cloneWithRows([]),
      drawerOpen: false,
      filterMenuOpen: false,
      createPaymentModalVisible: false,
      activeFilter: "All"
    }
  }

  componentWillMount() {
    // Reattach listeners if they're already active
    if (this.props.currentUser.endpoints) this.props.currentUser.stopListening()
    this.props.currentUser.startListening((updates) => this.props.updateCurrentUser(updates))

    // Get decrypted email and phone attributes
    this.props.currentUser.decrypt((updates) => this.props.updateCurrentUser(updates))

    // Prompt user for contact access
    this.props.currentUser.getNativeContacts((updates) => this.props.updateCurrentUser(updates))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.paymentFlow)
      this.generatePayCards(nextProps.currentUser.paymentFlow)

  }

  generatePriorityContent() {
    let priorityContent = [
      {
        type: "priorityContent",
        reactComponent: <Text style={{color: 'red', padding: 15}}>{"An example of priority content"}</Text>
      }
    ]

    return priorityContent
  }

  generatePayCards(payFlow) {
    let inc = (payFlow.in) ? payFlow.in : []
    let out = (payFlow.out) ? payFlow.out : []
    let all = inc.concat(out)

    // Render priority content if need be
    if (false) {
      inc = this.generatePriorityContent().concat(inc)
      out = this.generatePriorityContent().concat(out)
      all = this.generatePriorityContent().concat(all)
    }

    this.setState({
      all: this.EMPTY_DATA_SOURCE.cloneWithRows(all),
      inc: this.EMPTY_DATA_SOURCE.cloneWithRows(inc),
      out: this.EMPTY_DATA_SOURCE.cloneWithRows(out)
    })
  }

  renderRow(rowData) {
    switch (rowData.type) {
      case "priorityContent": return rowData.reactComponent
      default: return <PayCard payment={rowData} currentUser={this.props.currentUser} />
    }
  }

  rotateToX() {
    let { plusAngleInterpolator } = this.animatedValues

    Animated.timing(plusAngleInterpolator, {
      toValue: 150,
      duration: 320,
      easing: Easing.elastic(1.0)
    }).start()
  }

  rotateToPlus() {
    let { plusAngleInterpolator } = this.animatedValues

    Animated.timing(plusAngleInterpolator, {
      toValue: 0,
      duration: 320,
      easing: Easing.elastic(1.0)
    }).start()
  }

  toggleFilterMenu() {
    let { chevronAngleInterpolator, filterMenuHeight } = this.animatedValues

    this.setState({filterMenuOpen: !this.state.filterMenuOpen}, () => {
      Animated.parallel([
        Animated.timing(chevronAngleInterpolator, {
          toValue: (this.state.filterMenuOpen) ? 150 : 0,
          duration: 150,
          easing: Easing.elastic(0.4)
        }),
        Animated.timing(filterMenuHeight, {
          toValue: (this.state.filterMenuOpen) ? 75 : 1,
          duration: 150,
          easing: Easing.elastic(0.4)
        })
      ]).start()
    })
  }

  toggleFilter(f) {
    this.setState({ activeFilter: f }, () => {
      this.toggleFilterMenu()
    })
  }

  render() {
    let { activeFilter } = this.state
    let dataSource = []
    switch (activeFilter) {
      case "Outgoing": dataSource = this.state.out; break;
      case "Incoming": dataSource = this.state.inc; break;
      case "All": dataSource = this.state.all; break;
    }

    return(
      <Drawer
        type={"overlay"}
        openDrawerOffset={dims.width * 0.275}
        ref={(ref) => this.drawer = ref}
        tapToClose
        tweenDuration={150}
        onOpenStart={() => this.rotateToX()}
        onCloseStart={() => this.rotateToPlus()}
        content={<SideMenu {...this.props} />}>

        <View style={{flex: 1.0, backgroundColor: colors.lightGrey}}>
          <StatusBar barStyle={"light-content"} />

          { /* Header */ }
          <View style={{overflow: 'hidden'}}>
            <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />

            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => this.toggleFilterMenu()}>
              <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
                  {this.state.activeFilter + " Payments"}
                </Text>

                <Animated.View style={{position: 'absolute', top: 0, right: 6, paddingTop: 24, backgroundColor: 'transparent'}}>
                  <Animated.View style={{ transform: [{ rotate: this.animatedValues.chevronAngle }] }}>
                    <EvilIcons name={"chevron-down"} size={34} color={colors.lightGrey} />
                  </Animated.View>
                </Animated.View>
              </View>
            </TouchableHighlight>
          </View>

          <Animated.View style={{height: this.animatedValues.filterMenuHeight, backgroundColor: colors.snowWhite, overflow: 'hidden'}}>
            <ScrollView horizontal contentContainerStyle={{flex: 1.0, paddingLeft: 12, paddingRight: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              { /* All */ }
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => this.toggleFilter('All')}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                  <EvilIcons name={"eye"} size={38} color={colors.accent} />
                  <Text style={{color: colors.maastrichtBlue, fontSize: 16}}>
                    {"All"}
                  </Text>
                </View>
              </TouchableHighlight>

              { /* Outgoing */ }
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => this.toggleFilter('Outgoing')}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                  <EvilIcons name={"arrow-up"} size={38} color={colors.accent} />
                  <Text style={{color: colors.maastrichtBlue, fontSize: 16}}>
                    {"Outgoing"}
                  </Text>
                </View>
              </TouchableHighlight>

              { /* Incoming */ }
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => this.toggleFilter('Incoming')}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                  <EvilIcons name={"arrow-down"} size={38} color={colors.accent} />
                  <Text style={{color: colors.maastrichtBlue, fontSize: 16}}>
                    {"Incoming"}
                  </Text>
                </View>
              </TouchableHighlight>

              { /* Soonest
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={colors.maastrichtBlue}
                onPress={() => this.toggleFilter('Soonest')}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                  <EvilIcons name={"calendar"} size={38} color={colors.accent} />
                  <Text style={{color: colors.maastrichtBlue, fontSize: 16}}>
                    {"Soonest"}
                  </Text>
                </View>
              </TouchableHighlight> */ }
            </ScrollView>
          </Animated.View>

          { /* Banner info and payment list */ }
          <ListView
            dataSource={dataSource}
            renderRow={this.renderRow.bind(this)}
            renderFooter={() => <View style={{height: 90}} />}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            enableEmptySections />

          { /* Footer */ }
          <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', borderTopWidth: 1.0, borderColor: colors.lightGrey, backgroundColor: 'rgba(255, 255, 255, 0.64)', justifyContent: 'space-between'}}>
            <VibrancyView blurType="light" style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} />

            { /* User button */ }
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => this.drawer.open()}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, paddingRight: 20}}>
                  <EvilIcons name={"chevron-left"} size={30} color={colors.slateGrey} style={{marginRight: -5}} />
                  <EvilIcons name={"user"} size={40} color={colors.accent} />
                </View>
              </TouchableHighlight>
            </View>

            { /* New payment button */ }
            <TouchableHighlight
              activeOpacity={0.85}
              underlayColor={'transparent'}
              onPress={() => this.setState({createPaymentModalVisible: true})}
              style={{padding: 14, paddingRight: 20}}>
              <Animated.View style={{justifyContent: 'center', alignItems: 'center', transform: [{ rotate: this.animatedValues.plusAngle }]}}>
                <EvilIcons name={"plus"} size={40} color={colors.accent} />
              </Animated.View>
            </TouchableHighlight>
          </View>

          { /* Create payment modal */ }
          <Modal animationType={"slide"} visible={this.state.createPaymentModalVisible}>

            <CreatePaymentView
              {...this.props}
              toggleModal={() => this.setState({createPaymentModalVisible: false})} />

          </Modal>
        </View>
      </Drawer>
    )
  }
}

module.exports = NewMainView
