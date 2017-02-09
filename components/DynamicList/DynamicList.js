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

    this.state = props.state || {
      loading: true,
      query: "",
      dataSource: (props.data)
        ? this.emptyDataSource.cloneWithRowsAndSections(props.data)
        : this.emptyDataSource,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.setState({
        dataSource: this.emptyDataSource.cloneWithRowsAndSections(nextProps.data)
      })
    }
  }

  renderRow(rowData, sectionID, rowID) {
    let {renderRow} = this.props

    let row = (renderRow)
      ? renderRow(rowData, sectionID, rowID)
      : <View style={{flex: 1.0, height: 100, marginTop: 20, backgroundColor: 'blue'}} />

    return(
      <DynamicListRow rowID={rowID} ref={(ref) => this.rowRefs[rowID] = ref}>
        {row}
      </DynamicListRow>
    )
  }

  optimisticallyUpdate(params, cb) {
    let {additions, removals, mutations} = params
    let {dataSource} = this.state
    let {data} = this.props

    if (additions) add(additions, this)
    if (removals) remove(removals, this)
    if (mutations) mutate(mutations, this)

    function add(additions, scope) {
      for (var k in additions)
        data[k] = Object.assign({}, data[k], additions[k])
    }

    function remove(removals, scope) {
      for (var i = 0; i < removals.length; i++) {
        const INDEX = i
        const curr = removals[i]
        const ref = scope.rowRefs[curr]

        if (ref) ref.beforeUnmount(() => {
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

          // Trigger re-render
          scope.setState({dataSource: updatedDataSource})

          // Invoke callback (if any)
          if (scope.props.afterRemove)
            scope.props.afterRemove()
        })
      }
    }

    function mutate(mutations, scope) {
      console.log("--> optimisticallyUpdate.mutate() was invoked...")
      console.log("--> mutations", mutations)
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
