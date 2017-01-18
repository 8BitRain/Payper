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
    console.log("--> params", params)
    console.log("--> data", data)
    console.log("--> dataSource", dataSource)

    function add() {

    }

    function remove() {

    }

    function mutate() {

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
