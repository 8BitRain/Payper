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

class OwnsOnboarding extends React.Component {
  constructor(props) {
    super(props)
    this.state = {owns: {}}
    this.onOwn = this.onOwn.bind(this)
    this.submit = this.submit.bind(this)
  }

  onOwn(service) {
    if (!this.state.owns[service.title]) this.state.owns[service.title] = true
    else this.state.owns[service.title] = !this.state.owns[service.title]
    this.setState(this.state)
  }

  submit() {
    let userTags = formatUpdateUserTagsParams({wants: this.props.wants, owns: this.state.owns})
    updateUserTags({want: userTags.wantString, own: userTags.ownString, token: this.props.currentUser.token})
    Actions.Main({type: 'replace'})
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Header */ }
        <Header showTitle showSkip title={"Select Owns"} onSkip={() => this.submit()} />

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
                  onOwn={this.onOwn}
                  wants={(this.props.currentUser.wants) ? this.props.currentUser.wants[rowData.title] : false}
                  owns={(this.props.currentUser.owns) ? this.props.currentUser.owns[rowData.title] : false} />
              </View>
            )
          }}
          renderSectionHeader={(rowData, sectionID) => <ExploreFeedSectionHeader sectionID={sectionID} />}
          renderEmptyState={() => null}
          renderHeader={() => <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}><InfoBox text={"Select subscriptions you own and are willing to share."} /></View>} />

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

module.exports = connect(mapStateToProps, mapDispatchToProps)(OwnsOnboarding)
