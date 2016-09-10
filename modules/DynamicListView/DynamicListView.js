/**
  *   This module is based on this write-up:
  *   http://goo.gl/5TqkUC
**/

// Dependencies
import React from 'react';
import { View, Text, ListView, DataSource, InteractionManager } from 'react-native';

// Partial components
import DynamicListRow from './DynamicListRow';

class DynamicListView extends React.Component {
  constructor(props) {
    super(props);

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({ rowHasChanged: (row1, row2) => true }).cloneWithRows([]),
    this._data = this.props.dataSourceArray;

    this.state = {
      rowToDelete: null,
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => true }).cloneWithRows(this._data),
    };
  }


  /**
    *   Allows for smooth animations. Read more here:
    *   http://goo.gl/9AFkkC
  **/
  componentDidMount() {
    // InteractionManager.runAfterInteractions( () => this._loadData() );
  }


  /**
    *   Update cached data to be rendered in the ListView, excluding the row to
    *   be removed
  **/
  componentWillUpdate(nextProps, nextState) {

    console.log("Component will update");
    console.log("Current state:", this.state);
    console.log("Next state:", nextState);

    if (nextState.rowToDelete !== null) {
      console.log("this._data:", this._data);
      console.log("Row to delete:", nextState.rowToDelete);
      console.log("Filtering...");

      var arr = [];
      for (var i in this._data){
        if (i !== nextState.rowToDelete) arr.push(this._data[i]);
      }
      this._data = arr;

      console.log("Filtering complete.");
      console.log("New this._data:", this._data);
      console.log("Row to delete:", nextState.rowToDelete);
    }
  }


  componentDidUpdate() {
    console.log("Updated state:", this.state);
  }


  /**
    *   Render row component provided in initial getRow callback function.
    *   deleteRow is called via callback in that initial function
  **/
  _renderRow(rowData, sectionID, rowID) {
    console.log("Rendering row with rowID of", rowID);
    return(
      <DynamicListRow
        remove={rowID === this.state.rowToDelete}
        onRemoving={this._afterRemovingRow.bind(this)}>

        <Text onPress={() => this._deleteRow(rowID)}>
          { "rowID: " + rowID + "\n\nrowToDelete: " + this.state.rowToDelete }
        </Text>

        { /* this.props.getRowContent({ payment: rowData, deleteRow: () => this._deleteRow(rowID) }) */ }

      </DynamicListRow>
    );
  }


  /**
    *   Set rowToDelete in local state to identify which row to delete post-animation
  **/
  _deleteRow(id) {
    this.setState({ rowToDelete: id });
  }


  /**
    *   Clear rowToDelete and trigger a re-render of the ListView
  **/
  _afterRemovingRow() {
    this.setState({ rowToDelete: null, dataSource: this.state.dataSource.cloneWithRows(this._data) });
  }


  render() {
    console.log("State in render:", this.state);
    return(
      <ListView
        {...this.props}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)} />
    );
  }
}

export default DynamicListView;
