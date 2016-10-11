// Dependencies
import { connect } from 'react-redux';
import UserOnboardingView from './UserOnboardingView';

function mapStateToProps(state) {
  return { currentUser: state.getIn(['main', 'currentUser']) }
}

export default connect(mapStateToProps)(UserOnboardingView);
