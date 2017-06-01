/**

  TODO
  -----------------------------------------------------------------------------
  1) Add sectionless data source support

**/

import React from 'react'
import * as _ from 'lodash'
import {
  View,
  ListView,
  Animated,
  RecyclerViewBackedScrollView,
  RefreshControl,
  UIManager,
  findNodeHandle
} from 'react-native'
import {
  PullToRefreshPillButton
} from './'

class DynamicListRow extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      defaultTransition: 600,
      opacity: new Animated.Value((props.shouldAnimateIn) ? 0 : 1),
      marginTop: new Animated.Value(0),
      marginLeft: new Animated.Value(0)
    }
  }

  componentDidMount() {
    if (!this.props.shouldAnimateIn) return

    let {defaultTransition, opacity} = this.AV

    Animated.timing(opacity, {
      toValue: 1,
      duration: defaultTransition
    }).start()
  }

  measure(cb) {
    UIManager.measure(findNodeHandle(this.wrap), (x, y, w, h) => cb({x, y, w, h}))
  }

  beforeUnmount(cb) {
    this.measure((dims) => {
      let {marginLeft, marginTop, opacity} = this.AV
      let {w, h} = dims

      let animations = [
        Animated.parallel([
          Animated.timing(marginLeft, {
            toValue: -1 * w,
            duration: 140
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200
          })
        ]),
        Animated.timing(marginTop, {
          toValue: -1 * h,
          duration: 160
        })
      ]

      Animated.sequence(animations).start(() => cb())
    })
  }

  render() {
    let {children} = this.props
    let {opacity, marginLeft, marginTop} = this.AV

    return(
      <Animated.View
        ref={ref => this.wrap = ref}
        style={{opacity, marginLeft, marginTop}}>
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
      renderFooter: props.renderFooter,
      refreshContent: null,
      refreshing: false
    }

    this.rowRefs = {}
    this.onPullToRefreshButtonPress = this.onPullToRefreshButtonPress.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.renderSectionHeader = this.renderSectionHeader.bind(this)
  }

  componentWillMount() {
    let {induceRef} = this.props
    if (typeof induceRef === 'function')
      induceRef(this)
  }

  componentWillReceiveProps(nextProps) {
    let updatedState = {}

    //   Auto update list (without pull to refresh)
    //   Occurs in a refreshable list if the list is empty
    //   Always occurs on a nonrefreshable list
    if (!this.props.refreshable || this.state.dataSource.getRowCount() === 0)
      updatedState.dataSource = this.emptyDataSource.cloneWithRowsAndSections(nextProps.data)

    // Wait to update list until user pulls to refresh
    else if (nextProps.data !== this.props.data)
      updatedState.refreshContent = this.emptyDataSource.cloneWithRowsAndSections(nextProps.data)

    this.setState(updatedState)
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
    // TODO: GENERALIZE THIS FUNCTION

    // let {data} = this.props
    // let filteredData = {}
    //
    // query = query.toString().toLowerCase()
    //
    // // Filter data
    // for (var sectionKey in data) {
    //   const section = data[sectionKey]
    //   const keys = Object.keys(section)
    //   filteredData[sectionKey] = {}
    //   for (var i = 0; i < keys.length; i++) {
    //     const key = keys[i]
    //     const curr = section[key]
    //     const isMatch =
    //       curr.recip_name.toLowerCase().indexOf(query) >= 0
    //       || curr.sender_name.toLowerCase().indexOf(query) >= 0
    //       || curr.recip_username && curr.recip_username.toLowerCase().indexOf(query) >= 0
    //       || curr.sender_username && curr.sender_username.toLowerCase().indexOf(query) >= 0
    //       || curr.purpose.toLowerCase().indexOf(query) >= 0
    //       || curr.amount.toString().toLowerCase().indexOf(query) >= 0
    //     if (isMatch) filteredData[sectionKey][key] = curr
    //   }
    // }
    //
    // let updatedState = {
    //   query: query,
    //   filteredDataSource: (Object.keys(filteredData).length > 0)
    //     ? this.emptyDataSource.cloneWithRowsAndSections(filteredData)
    //     : null
    // }
    //
    // this.setState(updatedState)
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

  renderRow(rowData, sectionID, rowID) {
    let {renderRow} = this.props

    let row = (renderRow)
      ? renderRow(rowData, sectionID, rowID)
      : <View style={{flex: 1.0, height: 100, marginTop: 20, backgroundColor: 'blue'}} />

    return(
      <DynamicListRow
        shouldAnimateIn={this.props.shouldAnimateIn || false}
        rowID={rowID} ref={(ref) => this.rowRefs[rowID] = ref}>
        {row}
      </DynamicListRow>
    )
  }

  renderSectionHeader(rowData, sectionID) {
    if (typeof this.props.renderSectionHeader !== 'function' || Object.keys(rowData).length === 0)
      return <View />

    return this.props.renderSectionHeader(rowData, sectionID)
  }

  onPullToRefreshButtonPress() {
    this.listView.scrollTo({y: 0})
    this.onRefresh()
  }

  onRefresh() {
    let refreshContent = this.state.refreshContent

    // TODO: Refresh rows if they have onRefresh functions
    for (var k in this.rowRefs) {

    }

    if (!refreshContent) return

    this.setState({
      refreshing: true,
      refreshContentAvailable: null
    })

    setTimeout(() => {
      this.setState({
        dataSource: refreshContent,
        refreshContent: null,
        refreshing: false
      })
    }, 1000)
  }

  render() {
    let {dataSource, filteredDataSource, renderHeader, renderFooter} = this.state
    let {renderSectionHeader} = this.props

    return(
      <View style={{flex: 1.0}}>

        {(!dataSource || dataSource.getRowCount() === 0)
          ? <View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0}}>
              {this.props.renderEmptyState()}
            </View>
          : null}

        <ListView
          ref={ref => this.listView = ref}
          enableEmptySections
          dataSource={filteredDataSource || dataSource}
          refreshControl={(this.props.refreshable)
            ? <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
            : null
          }
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          renderHeader={renderHeader}
          renderFooter={renderFooter}
          renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props} />} />

        {(this.props.showPullToRefresh && this.state.refreshContent)
          ? <View style={[{position: 'absolute', bottom: 26, right: 0, left: 0, justifyContent: 'center', alignItems: 'center'}, this.props.refreshButtonWrapStyles || {}]}>
              <PullToRefreshPillButton onPress={this.onPullToRefreshButtonPress} />
            </View>
          : null}

      </View>
    )
  }
}

module.exports = DynamicList
