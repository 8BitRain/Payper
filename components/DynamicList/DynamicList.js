/**
    Based on https://goo.gl/hC4u7t
    TODO
    - [X] Add header functionality
    - [X] Add footer functionality
    - [X] Add section header functionality
    - [ ] Implement optimistic additions
    - [ ] Implement optimistic removals
    - [ ] Implement exit animations for DynamicListRows
**/
import React from 'react'
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

    this.state = {
      loading: true,
      dataSource: (props.data)
        ? this.emptyDataSource.cloneWithRowsAndSections(props.data)
        : this.emptyDataSource,
      refreshing: false
    }

    this.rowRefs = []

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
      if (additions.out) data.out = Object.assign({}, data.out, additions.out)
      if (additions.in) data.in = Object.assign({}, data.in, additions.in)
    }

    function remove(removals, scope) {
      for (var i = 0; i < removals.length; i++) {
        const curr = removals[i]
        let ref = scope.rowRefs[curr]
        ref.beforeUnmount(() => {
          console.log(`Safe to unmount row ${curr}`)
          
        })
      }
    }

    function mutate(mutations, scope) {
      console.log("--> optimisticallyUpdate.mutate() was invoked...")
      console.log("--> mutations", mutations)
    }
  }

  render() {
    let {dataSource} = this.state
    let {renderHeader, renderFooter, renderSectionHeader} = this.props

    return(
      <View style={{flex: 1.0}}>
        <ListView
          enableEmptySections
          dataSource={dataSource}
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
