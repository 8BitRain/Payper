import React from 'react'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {View, Text, Modal, ListView, RecyclerViewBackedScrollView, TouchableHighlight, Dimensions, Alert, ActionSheetIOS} from 'react-native'
import {colors} from '../../globalStyles'
import {IAVWebView, Header} from '../../components'
import {deleteBankAccountAlert} from '../../helpers/alerts'
import {deleteBankAccount} from '../../helpers/lambda'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import * as dispatchers from '../Main/MainState'

const dims = Dimensions.get('window')
const styles = {
  wrap: {
    backgroundColor: colors.snowWhite,
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
}

class BankAccountsModal extends React.Component {
  constructor(props) {
    super(props)

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = {
      rows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections({}),
      IAVModalVisible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.bankAccount !== this.props.currentUser.bankAccount)
      this.generateRows(nextProps.currentUser)
  }

  componentDidMount() {
    this.generateRows(this.props.currentUser)
  }

  generateRows(currentUser) {
    let rows = { "My Bank Accounts": (currentUser.bankAccount && currentUser.bankAccount.name) ? [currentUser.bankAccount] : [{name: "None. Add one now!", notTouchable: true}] }
    this.setState({rows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(rows)})
  }

  deleteBankAccount(bankAccount) {
    deleteBankAccountAlert({
      currentUser: this.props.currentUser,
      onConfirm: () => {
        this.props.updateCurrentUser({bankAccount: null})
        this.props.currentUser.bankAccount = null
        this.generateRows(this.props.currentUser)
        deleteBankAccount({token: this.props.currentUser.token})
      }
    })
  }

  onlyAllowOneBankAccount() {
    let {bankAccount} = this.props.currentUser
    let message = "Payper only supports one bank account at a time. You must delete '" + bankAccount.name + "' before you can add a new account."
    Alert.alert("Sorry, but...", message)
  }

  toggleIAVModal() {
    this.setState({IAVModalVisible: !this.state.IAVModalVisible})
  }

  toggleBankAccountMenu(bankAccount) {
    let options = ["Delete", "Cancel"]

    ActionSheetIOS.showActionSheetWithOptions({
      title: bankAccount.name,
      options: options,
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0
    }, (buttonIndex) => (buttonIndex === 0) ? this.deleteBankAccount() : null)
  }

  renderRow(rowData) {
    return(
      <TouchableHighlight
        onPress={() => (rowData.notTouchable) ? null : this.toggleBankAccountMenu(rowData)}
        underlayColor={'transparent'}
        activeOpacity={0.75}>
        <View style={{width: dims.width, flexDirection: 'row', justifyContent: 'space-between', padding: 12, paddingTop: 14, paddingBottom: 14}}>
          <Text style={{fontSize: 18}}>{rowData.name}</Text>
          {(rowData.notTouchable)
            ? null
            : <EvilIcons name={"trash"} color={colors.carminePink} size={28} /> }
        </View>
      </TouchableHighlight>
    )
  }

  renderSectionHeader(sectionData, sectionTitle) {
    if (sectionTitle.length === 0) {
      return(
        <View style={{height: 0}} />
      )
    } else {
      return(
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 8, backgroundColor: colors.medGrey}}>
          <Text style={{color: colors.deepBlue}}>{ sectionTitle }</Text>
        </View>
      )
    }
  }

  render() {
    let { bankAccount } = this.props.currentUser

    return(
      <View style={styles.wrap}>
        <Header showTitle showBackButton title="Bank Accounts" />
        <View style={{height: 20}} />

        { /* 'Add a bank account' button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={() => (bankAccount && bankAccount.name) ? this.onlyAllowOneBankAccount() : Actions.IAV()}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <EvilIcons name={"plus"} color={colors.accent} size={38} />
            <Text style={{fontSize: 20, color: colors.accent, paddingLeft: 4}}>
              {"Add a bank account"}
            </Text>
          </View>
        </TouchableHighlight>

        { /* Bank account list */ }
        <ListView
          style={{marginTop: 18}}
          dataSource={this.state.rows}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          enableEmptySections />

        { /* IAVWebView modal
        <Modal animationType={"slide"} visible={this.state.IAVModalVisible}>
          <View style={{flex: 1.0, backgroundColor: colors.accent}}>
            <IAVWebView refreshable currentUser={this.props.currentUser} toggleModal={() => this.toggleIAVModal()} />
          </View>
        </Modal> */ }
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentUser: (input) => dispatch(dispatchers.setCurrentUser(input)),
    updateCurrentUser: (input) => dispatch(dispatchers.updateCurrentUser(input))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(BankAccountsModal)
