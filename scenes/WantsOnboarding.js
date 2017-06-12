import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {formatUpdateUserTagsParams} from '../helpers/utils'
import {updateUserTags} from '../helpers/lambda'
import {DynamicList, InfoBox, ContinueButton, Header} from '../components'
import {ExploreFeedSectionHeader} from '../components/SectionHeaders'
import {WantOwnRow} from '../components/Interests'
import {colors} from '../globalStyles'
import {connect} from 'react-redux'
import * as dispatchers from './Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  }
})

class WantsOnboarding extends React.Component {
  constructor(props) {
    super(props)
    this.state = {wants: {}}
    this.onWant = this.onWant.bind(this)
    this.submit = this.submit.bind(this)
  }

  onWant(service) {
    if (!this.state.wants[service.title]) this.state.wants[service.title] = true
    else this.state.wants[service.title] = !this.state.wants[service.title]
    this.setState(this.state)
  }

  submit() {
    let numSelected = 0
    for (var k in this.state.wants) if (true === this.state.wants[k]) numSelected++
    if (numSelected < 3) alert("Select three or more interests.")
    else Actions.OwnsOnboarding({wants: this.state.wants})
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Header */ }
        <Header showTitle title={"Select Interests"} />

        { /* WantOwnRow list */ }
        <DynamicList
          shouldAnimateIn={false}
          data={this.props.currentUser.services || []}
          renderRow={(rowData, sectionID, rowID) => {
            let index = parseInt(rowID)
            let sectionLength = this.props.currentUser.services[sectionID].length

            return(
              <View style={{width: dims.width, alignItems: 'center'}}>
                <WantOwnRow
                  data={rowData}
                  containerStyles={{borderBottomWidth: (index === sectionLength - 1) ? 0 : 1}}
                  onWant={this.onWant}
                  wants={(this.props.currentUser.wants) ? this.props.currentUser.wants[rowData.title] : false} />
              </View>
            )
          }}
          renderSectionHeader={(rowData, sectionID) => <ExploreFeedSectionHeader sectionID={sectionID} />}
          renderEmptyState={() => null}
          renderHeader={() => <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}><InfoBox text={"Select 3 subscriptions you're interested in."} /></View>} />

        { /* Continue button */ }
        <View style={{alignItems: 'center', width: dims.width, paddingTop: 22.5, paddingBottom: 22.5, borderTopWidth: 1, borderColor: colors.medGrey}}>
          <ContinueButton onPress={this.submit} />
        </View>

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

module.exports = connect(mapStateToProps, mapDispatchToProps)(WantsOnboarding)
