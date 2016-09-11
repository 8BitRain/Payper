// Dependencies
import { Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { ListView, DataSource } from 'react-native';

// Clone for fundingSourcesDataSource updates
const EMPTY_DATA_SOURCE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

// Initialize state
const initialState = Map({
  fundingSourcesArray: [],
  fundingSourcesDataSource: EMPTY_DATA_SOURCE.cloneWithRows([]),
});

// Action types
const SET_FUNDING_SOURCES_ARRAY = 'SET_FUNDING_SOURCES_ARRAY',
      SET_FUNDING_SOURCES_DATA_SOURCE = 'SET_FUNDING_SOURCES_DATA_SOURCE';

// Action creators
export function fundingSourcesArray(input) { return {type: SET_FUNDING_SOURCES_ARRAY, input: input} };
export function fundingSourcesDataSource(input) { return {type: SET_FUNDING_SOURCES_DATA_SOURCE, input: EMPTY_DATA_SOURCE.cloneWithRows(input)} };

/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function FundingSourcesReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_FUNDING_SOURCES_ARRAY:
      var newState = state.set('fundingSourcesArray', action.input);
      return newState;
      break;
    case SET_FUNDING_SOURCES_DATA_SOURCE:
      var newState = state.set('fundingSourcesDataSource', action.input);
      return newState;
    break;
  }
  return state;
}
