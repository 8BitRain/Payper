import React from 'react'
import * as _ from 'lodash'
import {View, Text, StyleSheet, Dimensions, ListView, RecyclerViewBackedScrollView, TouchableHighlight, Animated} from 'react-native'
import Contacts from 'react-native-contacts'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {TextInputWithIcon, ContinueButton} from '../components'
import {handleNativeContacts} from '../helpers/dataHandlers'
import {colors} from '../globalStyles'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: dims.width,
    padding: 10,
    borderTopWidth: 1,
    borderColor: colors.medGrey
  },
  selectedNumsWrap: {
    flexDirection: 'row',
    width: dims.width,
    alignItems: 'center',
    paddingLeft: 8, paddingRight: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey
  }
})

class Invite extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      selectedNumsWrap: {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0)
      },
      successIndicator: {right: new Animated.Value(-1 * dims.width)}
    }

    this.emptyDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true
    })

    this.state = {
      contacts: [],
      filteredContacts: [],
      dataSource: this.emptyDataSource.cloneWithRows([]),
      filteredDataSource: this.emptyDataSource.cloneWithRows([]),
      selectedNums: []
    }

    this.submit = this.submit.bind(this)
    this.filter = this.filter.bind(this)
    this.select = this.select.bind(this)
    this.renderRow = this.renderRow.bind(this)
  }

  componentDidMount() {
    Contacts.getAll((err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        this.props.closeModal()
        return
      }

      let formattedContacts = handleNativeContacts(contacts)

      this.setState({
        contacts: formattedContacts,
        dataSource: this.emptyDataSource.cloneWithRows(formattedContacts)
      })
    })
  }

  submit() {
    if (this.state.selectedNums.length < 1) {
      alert("You must select at least one contact.")
      return
    }

    this.showSuccessAnimation(() => {
      this.props.induceState({selectedNums: this.state.selectedNums}, /*shouldSubmit?*/true)
      this.props.closeModal()
    })
  }

  showSuccessAnimation(cb) {
    let animations = [
      Animated.spring(this.AV.successIndicator.right, {
        toValue: 0,
        duration: 300
      }),
      Animated.spring(this.AV.successIndicator.right, {
        toValue: dims.width,
        duration: 150
      })
    ]

    Animated.sequence(animations).start(() => cb())
  }

  filter(query) {
    let filteredContacts = _.filter(this.state.contacts, function(o) {
      return o.queryable.indexOf(query) >= 0
    })

    this.setState({
      filteredContacts,
      filteredDataSource: this.emptyDataSource.cloneWithRows(filteredContacts)
    })
  }

  select(rowData) {
    let {selectedNums} = this.state
    let {phone} = rowData
    let key = rowData.phone.concat(":").concat(rowData.initials)
    if (selectedNums.includes(key)) selectedNums.splice(selectedNums.indexOf(key), 1)
    else selectedNums.push(key)
    this.animateSelectedNums()
    this.setState(this.state)
  }

  animateSelectedNums() {
    if (this.state.selectedNums.length === 1) {
      let animations = [
        Animated.timing(this.AV.selectedNumsWrap.height, {
          toValue: 62,
          duration: 140
        }),
        Animated.timing(this.AV.selectedNumsWrap.opacity, {
          toValue: 1,
          duration: 180
        })
      ]

      Animated.parallel(animations).start()
    } else if (this.state.selectedNums.length === 0) {
      let animations = [
        Animated.timing(this.AV.selectedNumsWrap.height, {
          toValue: 0,
          duration: 180
        }),
        Animated.timing(this.AV.selectedNumsWrap.opacity, {
          toValue: 0,
          duration: 140
        })
      ]

      Animated.parallel(animations).start()
    }
  }

  renderRow(rowData, sectionID, rowID) {
    let key = rowData.phone.concat(":").concat(rowData.initials)

    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={() => this.select(rowData)}>
        <View style={styles.rowWrap}>
          <View style={{flex: 0.2}}>
            <View style={{width: 45, height: 45, borderRadius: 22.5, borderWidth: 1, borderColor: colors.medGrey, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 15, fontWeight: '500', color: colors.maastrichtBlue}}>
                {`${rowData.initials}`}
              </Text>
            </View>
          </View>
          <View style={{flex: 0.6}}>
            <Text style={{fontSize: 18, fontWeight: '500', color: colors.deepBlue}}>
              {`${rowData.firstName} ${rowData.lastName}`}
            </Text>
            <Text style={{fontSize: 14, color: colors.gradientGreen}}>
              {`${rowData.stylizedPhone}`}
            </Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
            <EvilIcons
              size={30}
              name={this.state.selectedNums.includes(key) ? 'check' : 'plus'}
              color={this.state.selectedNums.includes(key) ? colors.gradientGreen : colors.slateGrey} />
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Search Bar */ }
        <View style={{flex: 0.15, marginTop: -8, justifyContent: 'center', alignItems: 'center'}}>
          <TextInputWithIcon
            onChangeText={(query) => this.filter(query)}
            inputIsValid={this.state.selectedNums.length >= 2}
            textInputProps={{
              autoCorrect: false,
              autoCapitalize: "words",
              autoFocus: true,
              returnKeyType: "done",
              placeholder: "Search by name or number",
              placeholderTextColor: colors.slateGrey
            }}
            iconProps={{
              name: "search",
              color: colors.accent,
              size: 30
            }} />
        </View>

        { /* Contact List */ }
        <View style={{flex: 0.7, justifyContent: 'center', alignItems: 'center'}}>
          <Animated.View style={[styles.selectedNumsWrap, this.AV.selectedNumsWrap]}>
            {this.state.selectedNums.map((o, i) => {
              return(
                <TouchableHighlight
                  key={i}
                  activeOpacity={0.75}
                  underlayColor={'transparent'}
                  onPress={() => {
                    this.state.selectedNums.splice(i, 1)
                    this.animateSelectedNums()
                    this.setState(this.state)
                  }}>
                  <View style={{marginLeft: 8, width: 45, height: 45, borderRadius: 22.5, borderWidth: 1, borderColor: colors.medGrey, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 15, fontWeight: '500', color: colors.maastrichtBlue}}>
                      {o.split(":")[1]}
                    </Text>
                  </View>
                </TouchableHighlight>
              )
            })}
          </Animated.View>

          <ListView
            enableEmptySections
            keyboardDismissMode={'on-drag'}
            dataSource={(this.state.filteredContacts.length > 0) ? this.state.filteredDataSource : this.state.dataSource}
            renderRow={this.renderRow}
            renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props} />} />
        </View>

        { /* Continue Button */ }
        <View style={{flex: 0.15, width: dims.width, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.snowWhite, borderTopWidth: 1, borderColor: colors.medGrey}}>
          <ContinueButton onPress={this.submit} customText={"Invite"} />
        </View>

        { /* Success Indicator */ }
        <Animated.View style={[{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          width: dims.width,
          top: 0,
          bottom: 0
        }, this.AV.successIndicator]}>
          <View style={{
            width: 140,
            height: 140,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.medGrey
          }}>
            <EvilIcons name={"check"} color={colors.snowWhite} size={56} />
          </View>
        </Animated.View>
      </View>
    )
  }
}

module.exports = Invite
