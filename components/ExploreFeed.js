import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Dimensions} from 'react-native'
import {DynamicList, InfoBox} from './'
import {ExploreFeedSectionHeader} from './SectionHeaders'
import {WantOwnRow, MatchedWantOwnRow} from './Interests'
import {ExploreFeedEmptyState} from './EmptyStates'
import {colors} from '../globalStyles'
import {formatUpdateUserTagsParams} from '../helpers/utils'
import {updateUserTags} from '../helpers/lambda'
import {connect} from 'react-redux'
import * as dispatchers from '../scenes/Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dims.width,
    backgroundColor: colors.snowWhite,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

class ExploreFeed extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      wants: this.props.currentUser.wants || {},
      owns: this.props.currentUser.owns || {}
    }

    this.onWant = this.onWant.bind(this)
    this.onOwn = this.onOwn.bind(this)
  }

  onWant(service) {
    if (!this.state.wants[service.title]) this.state.wants[service.title] = true
    else this.state.wants[service.title] = !this.state.wants[service.title]
    if (this.state.owns[service.title]) this.state.owns[service.title] = false
    this.setState(this.state, () => {
      let userTags = formatUpdateUserTagsParams({wants: this.state.wants, owns: this.state.owns})
      let updates = {
        wantString: userTags.wantString,
        ownString: userTags.ownString,
        wants: this.state.wants,
        owns: this.state.owns
      }
      this.props.currentUser.update(updates)
    })
  }

  onOwn(service) {
    if (!this.state.owns[service.title]) this.state.owns[service.title] = true
    else this.state.owns[service.title] = !this.state.owns[service.title]
    if (this.state.wants[service.title]) this.state.wants[service.title] = false
    this.setState(this.state, () => {
      let userTags = formatUpdateUserTagsParams({wants: this.state.wants, owns: this.state.owns})
      let updates = {
        wantString: userTags.wantString,
        ownString: userTags.ownString,
        wants: this.state.wants,
        owns: this.state.owns
      }
      this.props.currentUser.update(updates)
    })
  }

  render() {
    return(
      <View style={styles.container}>

        <DynamicList
          shouldAnimateIn={false}
          data={this.props.currentUser.services || []}
          renderRow={(rowData, sectionID, rowID) => {
            let index = parseInt(rowID)
            let sectionLength = this.props.currentUser.services[sectionID].length

            if (rowData.matchedUsers) {
              return(
                <View style={{width: dims.width, alignItems: 'center'}}>
                  <MatchedWantOwnRow
                    data={rowData}
                    hideBottomBorder={index === sectionLength - 1}
                    onWant={this.onWant}
                    onOwn={this.onOwn}
                    wants={this.props.currentUser.wants[rowData.title]}
                    owns={this.props.currentUser.owns[rowData.title]}
                    numMatches={Object.keys(rowData.matchedUsers).length}
                    currentUser={this.props.currentUser} />
                </View>
              )
            }

            else return(
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
          renderHeader={() => <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}><InfoBox text={"We'll populate your feed based on your wants and owns."} /></View>}
          renderFooter={() => <View style={{height: 100}} />} />

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

module.exports = connect(mapStateToProps, mapDispatchToProps)(ExploreFeed)
