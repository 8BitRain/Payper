// Dependencies
import { connect } from 'react-redux';

// Dispatch functions
import * as set from './FundingSourcesState';
import * as setInCreateAccount from '../CreateAccount/CreateAccountState';
import * as setInBankOnboarding from '../BankOnboarding/BankOnboardingState';

// Base view
import FundingSourcesView from './FundingSourcesView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // createAccount
    newUser: state.getIn(['createAccount', 'newUser']),

    // bankOnboarding
    startIav: state.getIn(['bankOnboarding', 'startIav']),

    // fundingSources
    fundingSourcesArray: state.getIn(['fundingSources', 'fundingSourcesArray']),
    fundingSourcesDataSource: state.getIn(['fundingSources', 'fundingSourcesDataSource']),

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {

    setNewUserToken: (token) => {
      dispatch(setInCreateAccount.setNewUserToken(token));
    },

    setIav: (token) => {
      dispatch(setInBankOnboarding.setIav(token));
    },

    setFundingSourcesArray: (input) => {
      dispatch(set.fundingSourcesArray(input));
    },

    setFundingSourcesDataSource: (input) => {
      dispatch(set.fundingSourcesDataSource(input));
    },

    setFundingSources: (input) => {
      dispatch(set.fundingSourcesArray(input));
      dispatch(set.fundingSourcesDataSource(input));
    },

  }
}

export default connect( mapStateToProps, mapDispatchToProps )( FundingSourcesView );
