/**
    Based on https://goo.gl/hC4u7t
    TODO
    - [X] Add header functionality
    - [X] Add footer functionality
    - [X] Add section header functionality
    - [ ] Implement optimisticallyAdd function
    - [ ] Implement optimisticallyRemove function
    - [ ] Implement exit animations for DynamicListRows
**/
import React from 'react'
import {
  View, ListView, Animated, RecyclerViewBackedScrollView
} from 'react-native'


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

  render() {
    let {children} = this.props
    let {rowOpacity} = this.AV

    return(
      <Animated.View style={{opacity: rowOpacity}}>
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

    return (
      <DynamicListRow>
        {row}
      </DynamicListRow>
    )
  }

  optimisticallyUpdate(params, cb) {
    let {additions, removals, mutations} = params
    let {dataSource} = this.state
    let {data} = this.props

    console.log("--> optimisticallyUpdate was invoked...")

    add(additions, this)
    if (removals) remove(removals)
    if (mutations) mutate(mutations)

    function add(additions, scope) {
      additions = {out: additions}
      
      if (additions.out)
        data.out = Object.assign({}, data.out, additions.out)
      if (additions.in)
        data.in = Object.assign({}, data.in, additions.in)

      console.log("--> data", data)

      // scope.setState({dataSource: newDataSource})
    }

    function remove(removals) {
      console.log("--> optimisticallyUpdate.remove() was invoked...")
      console.log("--> removals", removals)
    }

    function mutate(mutations) {
      console.log("--> optimisticallyUpdate.mutate() was invoked...")
      console.log("--> mutations", mutations)
    }
  }

  render() {
    let {
      dataSource
    } = this.state
    let {
      renderHeader, renderFooter, renderSectionHeader
    } = this.props

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
