import React from 'react'
import moment from 'moment'
import {
  View, TouchableHighlight, TouchableWithoutFeedback, Text, Dimensions,
  StyleSheet, Animated, Modal, TextInput, Keyboard, Alert,
  ListView, RecyclerViewBackedScrollView
} from 'react-native'
import { colors } from '../../../globalStyles'
import { StickyView } from '../../../components'
import { UserRow } from './index'
import { VibrancyView } from 'react-native-blur'
import { UserPic } from '../../../components'
import * as SetMaster5000 from '../../../helpers/SetMaster5000'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import dismissKeyboard from 'react-native-dismiss-keyboard'
const dims = Dimensions.get('window')

class UserSearchField extends React.Component {
  constructor(props) {
    super(props)

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.AV = {
      opacity: new Animated.Value(1),
      height: new Animated.Value(90),
      valueOpacity: new Animated.Value(0),
      valueHeight: new Animated.Value(0),
      valuePaddingBottom: new Animated.Value(0)
    }

    // TODO: Filter contacts so they only appear in one list.
    let { payperContacts, nativeContacts, globalUserList } = this.props.currentUser
    this.allContacts = payperContacts.concat(nativeContacts, globalUserList)
    this.allContactsMap = SetMaster5000.arrayToMap(this.allContacts)
    this.filteredContactsMap = {}

    this.state = {
      ...this.props,
      focused: false,
      hidden: false,
      touchable: true,
      selectedUsers: [],
      selectionMap: {},
      dataSource: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(this.allContactsMap)
    }
  }

  componentWillMount() {
    this.props.induceFieldRef(this)
  }

  hide() {
    this.setState({hidden: true, touchable: false})

    let animations = [
      Animated.timing(this.AV.height, {
        toValue: 0,
        duration: 180
      }),
      Animated.timing(this.AV.opacity, {
        toValue: 0,
        duration: 150
      })
    ]

    Animated.parallel(animations).start(() => this.setState({touchable: true}))
  }

  show() {
    this.setState({hidden: false, touchable: false})

    let animations = [
      Animated.timing(this.AV.height, {
        toValue: 90,
        duration: 180
      }),
      Animated.timing(this.AV.opacity, {
        toValue: 1,
        duration: 150
      })
    ]

    Animated.parallel(animations).start(() => this.setState({touchable: true}))
  }

  toggle() {
    this.setState({focused: !this.state.focused}, () => {
      this.props.toggleFieldFocus(this.state.title)
    })
  }

  showValue() {
    let animations = [
      Animated.timing(this.AV.valueOpacity, {
        toValue: 1,
        duration: 110
      }),
      Animated.timing(this.AV.valueHeight, {
        toValue: 32,
        duration: 140
      }),
      Animated.timing(this.AV.valuePaddingBottom, {
        toValue: 13,
        duration: 140
      })
    ]

    Animated.parallel(animations).start()
  }

  hideValue() {
    let animations = [
      Animated.timing(this.AV.valueOpacity, {
        toValue: 0,
        duration: 110
      }),
      Animated.timing(this.AV.valueHeight, {
        toValue: 0,
        duration: 140
      }),
      Animated.timing(this.AV.valuePaddingBottom, {
        toValue: 0,
        duration: 140
      })
    ]

    Animated.parallel(animations).start()
  }

  submit() {
    let {setValue} = this.props
    this.toggle()
  }

  onChangeText(input) {
    this.setState(input)
  }

  toggleSelect(user) {
    let {selectedUsers, selectionMap} = this.state
    let alreadySelected = selectedUsers.includes(user)

    // Add or remove user preview
    if (alreadySelected) {
      let index = selectedUsers.indexOf(user)
      selectedUsers.splice(index, 1)
    } else {
      selectedUsers.push(user)
    }

    // Update state and show or hide user preview list
    this.setState(this.state, () => (this.state.selectedUsers.length === 0) ? this.hideValue() : this.showValue())
  }

  filterContacts(query) {
    this.setState({ query: query })
    let filtered = SetMaster5000.filterContacts(this.allContacts, query)
    this.filteredContactsMap = SetMaster5000.arrayToMap(filtered)
    if (filtered.length > 0) this.setState({ dataSource: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(this.filteredContactsMap) })
  }

  renderSectionHeader(sectionData, sectionTitle) {
    return(
      <View style={{width: dims.width * 0.9, padding: 5, backgroundColor: colors.snowWhite, borderBottomWidth: 1, borderColor: colors.lightGrey}}>
        <Text style={{color: colors.deepBlue, fontSize: 16}}>
          {sectionTitle}
        </Text>
      </View>
    )
  }

  renderRow(user) {
    return <UserRow user={user} toggleSelect={() => this.toggleSelect(user)} />
  }

  render() {
    let {
      iconName, title, complete, dayValue, monthValue, yearValue, placeholder,
      textInputProps, offsetTop
    } = this.props

    let {
      focused, hidden, touchable, input, selectedUsers
    } = this.state

    let {
      opacity, height,
      valueOpacity, valueHeight, valuePaddingBottom
    } = this.AV

    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'transparent'}
        onPress={() => this.toggle()}>
        <Animated.View
          style={{
            height: height,
            opacity: opacity,
            borderBottomWidth: (hidden) ? 0 : 1,
            width: dims.width * 0.9, borderColor: colors.medGrey
          }}>

          { /* Icon, title, and plus/minus */ }
          <View style={{flex: 1.0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <EvilIcons name={iconName} size={32} color={colors.accent} />

            <Text style={{fontSize: 18, color: colors.deepBlue, paddingLeft: 10}}>
              {title}
            </Text>

            <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center'}}>
              <EvilIcons name={(focused) ? "minus" : "plus"} size={28} color={colors.slateGrey} />
            </View>
          </View>

          { /* Value */ }
          <Animated.View style={{paddingBottom: valuePaddingBottom, height: valueHeight, opacity: valueOpacity, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            { /* (filler) */ }
            <EvilIcons name={iconName} size={32} color={'transparent'} />

            { /* Previews for selected users */ }
            {selectedUsers.map((user, i) => <UserPic width={30} height={30} marginLeft={4} user={user} key={user.uid || user.phone} />)}
          </Animated.View>

          { /* Input modal */ }
          <Modal visible={this.state.focused} animationType={"slide"} transparent={true}>
            { /* Touching background dismisses field */ }
            <TouchableWithoutFeedback onPress={() => this.toggle()}>
              <Animated.View style={{height: offsetTop + height._value, width: dims.width}} />
            </TouchableWithoutFeedback>

            { /* Contact ListView */ }
            <ListView
              keyboardShouldPersistTaps
              style={{backgroundColor: colors.snowWhite}}
              contentContainerStyle={{width: dims.width, alignItems: 'center'}}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
              renderSectionHeader={this.renderSectionHeader.bind(this)}
              renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
              renderFooter={() => <View style={{height: 75}} />}
              keyboardDismissMode={"on-drag"}
              enableEmptySections />

            { /* Input sticks to top of keyboard */ }
            <StickyView duration={0}>
              <View style={{flexDirection: 'row', width: dims.width, backgroundColor: colors.lightGrey}}>
                { /* Cancel button */ }
                <TouchableHighlight
                  activeOpacity={0.65}
                  underlayColor={'transparent'}
                  onPress={() => this.toggle()}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{justifyContent: 'center', alignItems: 'center', padding: 8}}>
                    <EvilIcons name={"close-o"} size={30} color={colors.carminePink} />
                    <View style={{position: 'absolute', top: 4, bottom: 4, right: 0, width: 1, backgroundColor: colors.medGrey}} />
                  </View>
                </TouchableHighlight>

                { /* Input field */ }
                <TextInput
                  ref={ref => this.inputField = ref}
                  placeholderTextColor={colors.slateGrey}
                  blurOnSubmit={false}
                  autoFocus={true}
                  style={{flex: 0.65, height: 50, paddingLeft: 10, paddingRight: 10, textAlign: 'center'}}
                  {...textInputProps}
                  onChangeText={(input) => this.filterContacts(input)}
                  onSubmitEditing={() => this.submit()} />

                { /* Submit button */ }
                <TouchableHighlight
                  activeOpacity={0.65}
                  underlayColor={'transparent'}
                  onPress={() => this.submit()}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{justifyContent: 'center', alignItems: 'center', padding: 8}}>
                    <EvilIcons name={"check"} size={30} color={colors.gradientGreen} />
                    <View style={{position: 'absolute', top: 4, bottom: 4, left: 0, width: 1, backgroundColor: colors.medGrey}} />
                  </View>
                </TouchableHighlight>
              </View>
            </StickyView>
          </Modal>
        </Animated.View>
      </TouchableHighlight>
    )
  }
}

module.exports = UserSearchField
