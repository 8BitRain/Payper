import React from 'react'
import {View, Text, StyleSheet, Platform, StatusBar, TouchableHighlight, Dimensions, ListView, RecyclerViewBackedScrollView} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Header} from '../components'
import {colors} from '../globalStyles'
import {formatFrequency} from '../helpers/utils'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 27 : 7
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    shadowColor: colors.slateGrey,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  title: {
    fontSize: 22,
    color: colors.deepBlue
  },
  username: {
    fontSize: 18,
    color: colors.accent
  },
  socialButtonsWrap: {
    flexDirection: 'row',
    width: dims.width * 0.6,
    justifyContent: 'space-between'
  },
  socialButton: {
    width: dims.width * 0.29,
    padding: 6,
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 5
  },
  joinButton: {
    padding: 8,
    width: dims.width * 0.6,
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 5
  },
  joinText: {
    fontSize: 20,
    color: colors.gradientGreen
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 27 : 7,
    paddingLeft: 12
  },
  optionsButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 32 : 12,
    paddingRight: 22
  },
  memoWrap: {
    width: dims.width * 0.9,
    backgroundColor: colors.lightGrey,
    borderColor: colors.medGrey,
    borderWidth: 1,
    borderRadius: 4,
    padding: 6,
    alignItems: 'center'
  },
  sectionHeader: {
    width: dims.width,
    fontSize: 16,
    padding: 6,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: '#f0f0f0',
    borderColor: colors.slateGrey,
    borderBottomWidth: 1
  },
  row: {
    width: dims.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 14,
    paddingRight: 14,
    borderColor: colors.medGrey,
    borderBottomWidth: 1
  }
})

class BroadcastDetailsModal extends React.Component {
  constructor(props) {
    super(props)

    this.emptyDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.spotsAvailable = props.memberLimit - props.memberIDs.split(",").length

    this.dataSource = this.emptyDataSource.cloneWithRowsAndSections({
      "Broadcast Details": [
        {
          label: "Amount",
          value: `$${this.props.amount}`
        },
        {
          label: "Frequency",
          value: `${this.props.frequency.charAt(0).concat(this.props.frequency.toLowerCase().substring(1, this.props.frequency.length))}`
        },
        {
          label: "Spots",
          value: `${this.spotsAvailable} spot${(this.spotsAvailable === 1) ? '' : 's'} available.`
        },
        {
          label: "More Info",
          value: this.props.memo
        }
      ]
    })

    this.renderSectionHeader = this.renderSectionHeader.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.showOptions = this.showOptions.bind(this)
  }

  showOptions() {
    alert("TODO: Implement cross platform action sheets")
  }

  renderSectionHeader(rowData, sectionID) {
    return(
      <Text style={styles.sectionHeader}>
        {sectionID}
      </Text>
    )
  }

  renderRow(rowData, sectionID, rowID) {
    if (rowData.label === "More Info") return(
      <View style={[styles.row, {flexDirection: 'column'}]}>
        <Text style={{fontSize: 16}}>{rowData.label}</Text>
        <Text style={{fontSize: 15, paddingTop: 3}}>{rowData.value}</Text>
      </View>
    )

    return(
      <View style={styles.row}>
        <Text style={{fontSize: 16}}>{rowData.label}</Text>
        <Text style={{fontSize: 16}}>{rowData.value}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />

        { /* Back button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={Actions.pop}
          style={styles.backButton}>
          <EvilIcons name={"chevron-left"} size={45} color={colors.maastrichtBlue} />
        </TouchableHighlight>

        { /* Options button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={this.showOptions}
          style={styles.optionsButton}>
          <Entypo name={"dots-three-horizontal"} size={22} color={colors.maastrichtBlue} />
        </TouchableHighlight>

        { /* Icon */ }
        <View style={styles.icon}>
          <FontAwesome name={"tv"} size={26} color={colors.deepBlue} style={{backgroundColor: 'transparent'}} />
        </View>
        <View style={{height: 18}} />

        { /* Title */ }
        <Text style={styles.title}>{this.props.title}</Text>

        { /* Broadcast owner's username */ }
        <Text style={styles.username}>{this.props.caster.username}</Text>
        <View style={{height: 18}} />

        { /* Join/Star buttons */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={() => alert("Join")}>
          <View style={styles.joinButton}>
            <Text style={styles.joinText}>
              {"Join"}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={{height: 4}} />

        <View style={styles.socialButtonsWrap}>
          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={'transparent'}
            onPress={() => alert("Star")}>
            <View style={styles.socialButton}>
              <EvilIcons name={"star"} size={24} color={colors.slateGrey} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={'transparent'}
            onPress={() => alert("Share")}>
            <View style={styles.socialButton}>
              <EvilIcons name={"share-apple"} size={24} color={colors.slateGrey} />
            </View>
          </TouchableHighlight>
        </View>
        <View style={{height: 18}} />

        { /* Details */ }
        <ListView
          ref={ref => this.listView = ref}
          dataSource={this.dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props} />} />
      </View>
    )
  }
}

module.exports = BroadcastDetailsModal
