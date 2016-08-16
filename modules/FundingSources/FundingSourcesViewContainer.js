// Dependencies
import { connect } from 'react-redux';

// Dispatch functions
import * as set from './FundingSourceState';

// Base view
import FundingSourcesView from './FundingSourcesView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {}
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {}
}

export default connect( mapStateToProps, mapDispatchToProps )( FundingSourcesView );
