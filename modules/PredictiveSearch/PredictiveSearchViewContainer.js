// Dependencies
import { connect } from 'react-redux';

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as StringMaster5000 from '../../helpers/StringMaster5000';

// Dispatch functions
import * as set from './PredictiveSearchState';

// Base view
import PredictiveSearchView from './PredictiveSearchView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {
    activeFirebaseListeners: state.getIn(['predictiveSearch', 'activeFirebaseListeners']),
    contacts: state.getIn(['predictiveSearch', 'contacts']),
    empty: state.getIn(['predictiveSearch', 'empty'])
  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {
    listen: (endpoints) => {
      Firebase.listenTo(endpoints, (response) => {
        switch (response.key) {
          case "auserid":
            response.value = StringMaster5000.formatContacts(response.value);
            dispatch(set.contacts(response.value));
            dispatch(set.empty(false));
          break;
        }
      });

      dispatch(set.activeFirebaseListeners(endpoints));
    },

    stopListening: (endpoints) => {
      Firebase.stopListeningTo(endpoints);
      dispatch(set.activeFirebaseListeners([]));
    }
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( PredictiveSearchView );
