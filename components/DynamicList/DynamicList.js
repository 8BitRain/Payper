/**
    Based on https://goo.gl/hC4u7t
    TODO
    - [X] Add header functionality
    - [X] Add footer functionality
    - [X] Add section header functionality
    - [X] Implement optimistic additions
    - [X] Implement optimistic removals
    - [X] Implement exit animations for DynamicListRows
    - [ ] Implement filter

    TODO (BACKBURNER)
    - [ ]
**/
import React from 'react'
import * as _ from 'lodash'
import {View, ListView, Animated, RecyclerViewBackedScrollView} from 'react-native'
import {err} from './'

class DynamicListRow extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      defaultTransition: 600,
      rowOpacity: new Animated.Value(0)
    }
  }

  componentDidMount() {
    let {defaultTransition, rowOpacity} = this.AV

    Animated.timing(rowOpacity, {
      toValue: 1,
      duration: defaultTransition
    }).start()
  }

  beforeUnmount(cb) {
    let {defaultTransition, rowOpacity, rowHeight} = this.AV

    let animations = [
      Animated.timing(rowHeight, {
        toValue: 0,
        duration: 200
      }),
      Animated.timing(rowOpacity, {
        toValue: 0,
        duration: 160
      })
    ]

    Animated.parallel(animations).start(() => {
      if (typeof cb === 'function')
        cb()
    })
  }

  layout(e) {
    let {height} = e.nativeEvent.layout
    this.AV.rowHeight = new Animated.Value(height)
  }

  render() {
    let {children} = this.props
    let {rowOpacity, rowHeight} = this.AV

    return(
      <Animated.View style={{opacity: rowOpacity, height: rowHeight}} onLayout={(e) => this.layout(e)}>
        {children}
      </Animated.View>
    )
  }
}

class DynamicList extends React.Component {
  constructor(props) {
    super(props)

    this.emptyDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.rawData = {}

    this.state = props.state || {
      loading: true,
      query: "",
      dataSource: this.emptyDataSource.cloneWithRowsAndSections(this.rawData),
      filteredDataSource: null,
      renderHeader: props.renderHeader,
      renderFooter: props.renderFooter
    }

    this.rowRefs = {}

    this.renderRow = this.renderRow.bind(this)
  }

  componentWillMount() {
    let {induceRef} = this.props
    if (typeof induceRef === 'function')
      induceRef(this)
  }

  /**


  where'd you leave off?
  ------------------------------------------
  optimistic rendering might be pointless for additions now that payment
  generation is handled in the front end. i.e., the direct write to firebase
  pretty much negated the delay that made optimistic rendering necessary in
  the first place.

  should still use it for deletion though.

  next steps:
    - remove optimistic addition code
    - continue to work on dynamic list in a different repo, generalize, and
      open source it (eventually)


  **/

  renderRow(rowData, sectionID, rowID) {
    let {renderRow, rowIdentifier} = this.props

    let row = (renderRow)
      ? renderRow(rowData, sectionID, rowID)
      : <View style={{flex: 1.0, height: 100, marginTop: 20, backgroundColor: 'blue'}} />

    // Determine unique row identifier
    if (rowIdentifier) rowID = rowData[rowIdentifier]
    else if (rowData.id) rowID = rowData.id
    else throw err['no-row-id']

    return(
      <DynamicListRow
        rowID={rowID}
        ref={(ref) => this.rowRefs[rowID] = ref}>
        {row}
      </DynamicListRow>
    )
  }

  update(params, cb) {
    let {additions, removals, mutations} = params
    let {dataSource} = this.state
    let {data} = this.props

    if (additions) add(additions, this)
    if (removals) remove(removals, this)
    if (mutations) mutate(mutations, this)

    function add(additions, scope) {
      // for (var k in additions) {
      //   const sectionHeader = k
      //   const sectionData = additions[k]
      //   console.log(`--> adding to ${sectionHeader}:`, sectionData)
      // }

      console.log("--> add() was invoked")
      console.log("--> additions", additions)

      for (var sectionHeader in additions) {
        const rowsToAdd = additions[sectionHeader]

        // Section doesn't exist yet
        // --> Assign array of rows to section header
        if (!scope.rawData[sectionHeader])
          scope.rawData[sectionHeader] = rowsToAdd

        // Section exists
        // --> Remove dupes (if any)
        // --> Prepend new rows
        else {
          for (var i = 0; i < scope.rawData[sectionHeader].length; i++) {
            var rowToCheckAgainst = scope.rawData[sectionHeader][i]
            for (var j = 0; j < rowsToAdd.length; j++) {
              var rowToCheck = rowsToAdd[j]
              var rowToCheckID = rowToCheck[scope.props.rowIdentifier || "id"]
              var rowToCheckAgainstID = rowToCheckAgainst[scope.props.rowIdentifier || "id"]
              if (rowToCheckID === rowToCheckAgainstID) rowsToAdd.splice(j, 1)
            }
          }

          scope.rawData[sectionHeader] = rowsToAdd.concat(scope.rawData[sectionHeader])
        }

        // Trigger re-render
        updateDataSource(scope.rawData, scope)
      }
    }

    function remove(removals, scope) {
      for (var i = 0; i < removals.length; i++) {
        const INDEX = i
        const curr = removals[INDEX]
        const ref = scope.rowRefs[curr]

        console.log("--> remove() was invoked ")
        console.log("--> curr", curr)
        console.log("--> scope", scope)
        console.log("--> rowRefs", scope.rowRefs)
        console.log("--> ref", ref)

        ref.beforeUnmount(() => {
          // Done animating row out
          // Create new dataSource & trigger re-render
          if (INDEX === removals.length - 1) {
            // Remove row data from data source
            for (var sectionKey in data) {
              let section = data[sectionKey]
              if (section[curr]) data[sectionKey] = _.omit(section, curr)
            }

            // Create new data source
            let updatedDataSource = scope.emptyDataSource.cloneWithRowsAndSections(data)

            // Re-filter
            if (scope.state.filteredDataSource && scope.state.query)
              scope.filter(scope.state.query)

            // Invoke post-removal callback (if any)
            if (scope.props.afterRemove)
              scope.props.afterRemove()

            // Trigger re-render
            updatedDataSource(data, scope)
          }
        })
      }
    }

    function mutate(mutations, scope) {
      console.log("--> optimisticallyUpdate.mutate() was invoked...")
      console.log("--> mutations", mutations)
    }

    function updateDataSource(newRawData, scope, cb) {
      let newDataSource = scope.emptyDataSource.cloneWithRowsAndSections(newRawData)
      scope.setState({dataSource: newDataSource}, () => (typeof cb === 'function') ? cb() : null)
    }
  }

  filter(query) {
    let {data} = this.props
    let filteredData = {}

    query = query.toString().toLowerCase()

    // Filter data
    for (var sectionKey in data) {
      const section = data[sectionKey]
      const keys = Object.keys(section)
      filteredData[sectionKey] = {}
      for (var i = 0; i < keys.length; i++) {
        const key = keys[i]
        const curr = section[key]
        const isMatch =
          curr.recip_name.toLowerCase().indexOf(query) >= 0
          || curr.sender_name.toLowerCase().indexOf(query) >= 0
          || curr.recip_username && curr.recip_username.toLowerCase().indexOf(query) >= 0
          || curr.sender_username && curr.sender_username.toLowerCase().indexOf(query) >= 0
          || curr.purpose.toLowerCase().indexOf(query) >= 0
          || curr.amount.toString().toLowerCase().indexOf(query) >= 0
        if (isMatch) filteredData[sectionKey][key] = curr
      }
    }

    let updatedState = {
      query: query,
      filteredDataSource: (Object.keys(filteredData).length > 0)
        ? this.emptyDataSource.cloneWithRowsAndSections(filteredData)
        : null
    }

    this.setState(updatedState)
  }

  showHeader() {
    if (!this.props.renderHeader) return
    this.setState({renderHeader: this.props.renderHeader})
  }

  hideHeader() {
    if (!this.props.renderHeader) return
    this.setState({renderHeader: () => <View />})
  }

  showFooter() {
    if (!this.props.renderFooter) return
    this.setState({renderFooter: this.props.renderFooter})
  }

  hideFooter() {
    if (!this.props.renderFooter) return
    this.setState({renderFooter: () => <View />})
  }

  render() {
    let {dataSource, filteredDataSource, renderHeader, renderFooter} = this.state
    let {renderSectionHeader} = this.props

    return(
      <View style={{flex: 1.0}}>
        <ListView
          ref="ListView"
          dataSource={filteredDataSource || dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={renderSectionHeader}
          renderHeader={renderHeader}
          renderFooter={renderFooter}
          renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props} />} />
      </View>
    )
  }
}

module.exports = DynamicList
