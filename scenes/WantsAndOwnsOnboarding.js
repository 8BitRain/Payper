import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
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

class WantsAndOwnsOnboarding extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      wants: {},
      owns: {}
    }

    this.onWant = this.onWant.bind(this)
    this.onOwn = this.onOwn.bind(this)
    this.submit = this.submit.bind(this)
  }

  onWant(service) {
    this.state.wants[service.title] = true
    if (this.state.owns[service.title]) this.state.owns[service.title] = false
    this.setState(this.state)
  }

  onOwn(service) {
    this.state.owns[service.title] = true
    if (this.state.wants[service.title]) this.state.wants[service.title] = false
    this.setState(this.state)
  }

  submit() {
    this.props.currentUser.update({wants: this.state.wants, owns: this.state.owns})
    Actions.Main()
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Header */ }
        <Header
          showTitle
          showSkip
          title={"Select Interests"}
          onSkip={Actions.Main} />

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
                  wants={this.props.currentUser.wants[rowData.title]}
                  owns={this.props.currentUser.owns[rowData.title]} />
              </View>
            )
          }}
          renderSectionHeader={(rowData, sectionID) => <ExploreFeedSectionHeader sectionID={sectionID} />}
          renderEmptyState={() => null}
          renderHeader={() => <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}><InfoBox text={"We'll populate your feed based on your wants and owns."} /></View>} />

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

module.exports = connect(mapStateToProps, mapDispatchToProps)(WantsAndOwnsOnboarding)
