// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Dimensions, AsyncStorage} from "react-native";
import Button from "react-native-button";
import {Reducer, Router, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Firebase from "../../services/Firebase";
import * as Init from "../../_init";
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  ShareDialog,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} = FBSDK;


// Stylesheets
import colors from "../../styles/colors";
import styles from '../../styles/SignIn/Generic';
import typography from '../../styles/typography';

// Custom components
import ArrowNav from "../../components/Navigation/Arrows/ArrowDouble";
import Loading from "../../components/Loading/Loading";


var dimensions = Dimensions.get('window');

class SignInView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loading: false,
      doneLoading: false,
      fbAcessToken: "Test Value",
      fbUser: {}
    }

    this.arrowNavProps = {
      left: false,
      right: true,
    }
  }

  /*
  * Sign in With Email
  */
  signInWithEmail() {
    var _this = this;  //Is this line necessary?
    this.setState({loading: true});
    Init.signInWithEmail({email: this.state.email, password: this.state.password}, function(signedIn) {
      _this.setState({doneLoading: true});
    });
  }

  /*
  * Query the FB Graph
  */
  fbAPIRequest(){
    var _this = this;
    const infoRequest = new GraphRequest(
    '/me/?fields=email,age_range,first_name,last_name,gender,picture,friends',
    null,
    _this.responseInfoCallback.bind(this),
  );

  new GraphRequestManager().addRequest(infoRequest).start();
  }


  /*
  * Response from using the FB Graph
  */
  responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      //alert('Success fetching data: ' + result.toString());
      console.log(JSON.stringify(result));
      //this.submitFbUser(result);
      this.signInWithFacebook(this.state.fbAcessToken, result);
    }
  }

  /*
  * Submit Facebook User information
  */
  submitFbUser(result){
    var picture ='';
    console.log(result.picture.data.is_silhouette);
    if(result.picture.data.is_silhouette){
      picture = '';
    } else {
      picture = result.picture.data.url;
    }

    var user = {
      email: result.email,
      first_name: result.first_name,
      last_name: result.last_name,
      profile_pic: picture,
      phone: '3133133113',
      provider: 'payper',
      gender: result.gender,
      friends: result.friends.data,
      id: result.id
    };
    this.state.fbUser = user;
    //Note this should send information from Client to FB

    console.log("User Data " + JSON.stringify(user));
    var url = 'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/facebookCreate';
    fetch(url, {method: "POST", body: JSON.stringify(user)})
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      //After adding information to the Server
      //Send FB Contact information to FB

      console.log(this.state.fbAcessToken);
      this.state.fbUser = user;

      //this.setState({loading: true});
      /*Init.signInWithCredentials(this.state.fbAcessToken, function(signedIn) {
        _this.setState({doneLoading: true});
      });*/
    })
    .done();
  }

  /*
  * Sign In With Facebook
  */
  signInWithFacebook(FBToken, result){

    var picture ='';
    console.log(result.picture.data.is_silhouette);
    if(result.picture.data.is_silhouette){
      picture = '';
    } else {
      picture = result.picture.data.url;
    }

    var data = {
      FBToken: FBToken,
      user: {
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
        profile_pic: picture,
        phone: '3133133113',
        gender: result.gender,
        friends: result.friends.data,
        facebook_id: result.id,
        token: ''
      }
    };
    var _this = this;
    this.setState({loading: true});
    Init.signInWithFacebook(data, function(signedIn) {
      _this.setState({doneLoading: true});
    });
  }




  render() {
      if (this.state.loading) {
        return(
          <Loading
            complete={this.state.doneLoading}
            msgSuccess={"Welcome!"}
            msgError={"Sign in failed"}
            msgLoading={"One sec..."}
            destination={() => Actions.MainViewContainer()} />
        );
    } else {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.white}}>
        {/*Change payment back to flex .2*/}
        <View style={{flex: 0.1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: 'Roboto', fontSize: 45, fontWeight: '300', color: colors.darkGrey, textAlign: 'center'}}>Coincast</Text>
        </View>



        <View style={{flex: 0.4, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.darkGrey}}>
          <Text style={{fontFamily: 'Roboto', fontSize: 30, fontWeight: '300', textAlign: 'center', color: colors.white}}>
            Sign In
          </Text>
          <TextInput
            style={[typography.textInput, typography.marginSides, {width: (dimensions.width * 0.9), backgroundColor: colors.white, color: colors.darkGrey, paddingLeft: 15, marginTop: 10}]}
            placeholder={"Email"}
            autoFocus={true}
            autocapitalize={false}
            keyboardType={"email-address"}
            onChangeText={(text) => this.setState({email: text}) } />
          <TextInput
            style={[typography.textInput, typography.marginSides, {width: (dimensions.width * 0.9), backgroundColor: colors.white, color: colors.darkGrey, paddingLeft: 15, marginTop: 10}]}
            placeholder={"Password"}
            autoFocus={true}
            secureTextEntry
            onChangeText={(text) => this.setState({password: text}) } />
        </View>

        { /* Filler */ }
        <View style={{flex:0.4, backgroundColor: colors.darkGrey}}></View>
        { /* Arrow nav buttons */ }
        <View style={{position: 'absolute', bottom: 220, left: 0, right: 0}}>
          <ArrowNav
          arrowNavProps={this.arrowNavProps}
          callbackRight={() => { this.signInWithEmail() }} />
        </View>

        <Button onPress={() => {this.fbAPIRequest()}}><Text>FBRequest</Text></Button>
        <LoginButton
        readPermissions={["email","public_profile", "user_friends"]}
        onLoginFinished={
          (error, result) => {
            if (error) {
              alert("login has error: " + result.error);
            } else if (result.isCancelled) {
              alert("login is cancelled.");
            } else {
              AccessToken.getCurrentAccessToken().then(
                (data) => {
                  console.log("Grabbing Facebook AccesToken for User: " +
                   "\n" + "======+++++==========++++++======="
                   + "\n" + JSON.stringify(data));
                  this.state.fbAcessToken = data.accessToken;
                  this.fbAPIRequest();
                }
              )
            }
          }
        }
        onLogoutFinished={() => alert("logout.")}/>
      </View>
    );

  }
}
}


export default SignInView;
