import {connect} from 'react-redux';
import * as dispatchFunctions from  './CreateAccountState';
import CreateAccountView from './CreateAccountView';
import Email from './Pages/Email';
import Password from './Pages/Password';
import * as Validators from '../../helpers/validators';
import * as Firebase from '../../services/Firebase';

/**
  *   Connect function for CreateAccountView.js
**/
export default connect(
  state => ({
    // Account info variables
    firstName: state.getIn(['createAccount', 'currentUser']).firstName,
    lastName: state.getIn(['createAccount', 'currentUser']).lastName,
    email: state.getIn(['createAccount', 'currentUser']).email,
    password: state.getIn(['createAccount', 'currentUser']).password,
    phoneNumber: state.getIn(['createAccount', 'currentUser']).phoneNumber,
    currentUser: state.getIn(['createAccount', 'currentUser']),

    // Input validation booleans
    emailValidations: state.getIn(['createAccount', 'emailValidations']),
    passwordValidations: state.getIn(['createAccount', 'passwordValidations']),
    firstNameValidations: state.getIn(['createAccount', 'firstNameValidations']),
    lastNameValidations: state.getIn(['createAccount', 'lastNameValidations']),
    phoneNumberValidations: state.getIn(['createAccount', 'phoneNumberValidations']),
  }),
  dispatch => ({
    // Validation setters
    validate(type, input) {
      switch (type) {
        case ("email"):
          console.log("=-=-= reached validate('email', input) =-=-=")
          console.log("this.state.emailValidations = " + this.emailValidations);
          var validations = Validators.validateEmail(input);
          dispatch(dispatchFunctions.setEmailValidations(validations));
          break;
        case ("password"):
          dispatch(dispatchFunctions.setPasswordValidations(input));
          break;
        case ("firstName"):
          dispatch(dispatchFunctions.setFirstNameValidations(input));
          break;
        case ("lastName"):
          dispatch(dispatchFunctions.setLastNameValidations(input));
          break;
        case ("phoneNumber"):
          dispatch(dispatchFunctions.setPhoneNumberValidations(input));
          break;
      }
    },

    // Account setters
    setEmail(input) { dispatch(dispatchFunctions.setEmail(input)) },
    setPassword(input) { dispatch(dispatchFunctions.setPassword(input)) },
    setFirstName(input) { dispatch(dispatchFunctions.setFirstName(input)) },
    setLastName(input) { dispatch(dispatchFunctions.setLastName(input)) },
    setPhoneNumber(input) { dispatch(dispatchFunctions.setPhoneNumber(input)) },

    // Persist account information to Firebase
    createAccount(user) {
      console.log("=-=-=  REACHED createAccount(user)  =-=-=")
      // Create account
      // Firebase.createAccount(user);                                                  // TODO
    }
  })
)(CreateAccountView);
/* END Connect function for CreateAccountView.js */


























// reducers/index.js
import { reducer as router } from 'react-native-router-redux';

export {
  router, // the key must be 'router'
};

// hook up the reducers
import * as reducers from '../reducers';
const reducer = combineReducers(reducers);

// import react-native-router-redux
import {
  actions as routerActions,
  NavBar,
  Route,
  Router,
  Schema,
  TabBar,
  TabRoute
} from 'react-native-router-redux';

// connect your state and actions (using react-redux)
const mapStateToProps = state => ({
  router: state.router,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...routerActions,
  }, dispatch),
  dispatch,
});

// define your routes
const defaultSchema = {
  navBar: NavBar,
  navLeftColor: '#FFFFFF',
  navTint: '#224655',
  navTitleColor: '#FFFFFF',
  navTitleStyle: {
    fontFamily: 'Avenir Next',
    fontSize: 18,
  },
  statusStyle: 'light-content',
  tabBar: TabBar,
};

class Application extends Component {
  render() {
    return (
      <Router {...this.props} assets={assets} initial="signIn">
        <Schema name="default" {...defaultSchema} />

        <Route name="signIn" component={SignIn} type="reset" hideNavBar={true} />
        <Route name="detail" component={Detail} />
        <TabRoute name="tabBar" barTint='#FFFFFF' tint="#32DEAF">
          <Route name="tab1" component={Master('#111')} title="Home" tabItem={{icon: assets['home'], title: 'Home'}} />
          <Route name="tab2" component={Master('#222')} title="Calendar" tabItem={{icon: assets['calendar'], title: 'Calendar'}} />
          <Route name="tab3" component={Master('#333')} title="Video" tabItem={{icon: assets['video'], title: 'Video'}} />
          <Route name="tab4" component={Master('#444')} title="Profile" tabItem={{icon: assets['profile'], title: 'Profile'}} />
        </TabRoute>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);
