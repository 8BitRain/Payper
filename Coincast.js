import React from 'react';
import {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import Launch from './components/Launch'
import LandingView from './components/LandingView'
import OnBoarding_Email from './components/OnBoarding_CreateAccount/OnBoarding_Email'
import OnBoarding_Password from './components/OnBoarding_CreateAccount/OnBoarding_Password'
import OnBoarding_FirstName from './components/OnBoarding_CreateAccount/OnBoarding_FirstName'
import OnBoarding_LastName from './components/OnBoarding_CreateAccount/OnBoarding_LastName'
import OnBoarding_PhoneNumber from './components/OnBoarding_CreateAccount/OnBoarding_PhoneNumber'
import OnBoarding_Summary from './components/OnBoarding_CreateAccount/OnBoarding_Summary'

import OnBoarding_CreateAccount from './modules/OnBoarding_CreateAccount/CreateAccountView'
import CreateAccountViewContainer from './modules/OnBoarding_CreateAccount/CreateAccountViewContainer'


import Register from './components/Register'
import Login from './components/Login'
import Login2 from './components/Login2'
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux'
import Error from './components/Error'
import Home from './components/Home'
import TabView from './components/TabView'
import EchoView from './components/EchoView'
import NavigationDrawer from './components/NavigationDrawer'
import Button from "react-native-button";

class TabIcon extends React.Component {
    render(){
        return (
            <Text style={{color: this.props.selected ? "red" :"black"}}>{this.props.title}</Text>
        );
    }
}

class Right extends React.Component {
    render(){
        return <Text style={{
        width: 80,
        height: 37,
        position: "absolute",
        bottom: 4,
        right: 2,
        padding: 8,
    }}>Right</Text>
    }
}

const styles = StyleSheet.create({
    container: {flex:1, backgroundColor:"transparent",justifyContent: "center",
        alignItems: "center",}

});

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};

// define this based on the styles/dimensions you use
const getSceneStyle = function (/* NavigationSceneRendererProps */ props, computedProps) {
  const style = {
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  };
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64;
    style.marginBottom = computedProps.hideTabBar ? 0 : 50;
  }
  return style;
};

let currentSwitchPage = 'text1';

const SwitcherPage = function (props) {
    return (
        <View>
            <Text style={{marginTop:100,textAlign:'center'}}>current page: {props.text}</Text>
            <Button
                onPress={() => {
                    currentSwitchPage = currentSwitchPage === 'text1' ? 'text2' : 'text1';
                    Actions.refresh({key: 'switcher'});
                }}
            >
              Switch!
            </Button>
            <Button
                onPress={() => {
                    Actions.launch({type:'reset'});
                }}
            >
                Exit
            </Button>
        </View>
    );
};

export default class Coincast extends React.Component {
    render() {
        return <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
            <Scene key="modal" component={Modal} >
                <Scene key="root" hideNavBar hideTabBar>
                    <Scene key="echo" clone component={EchoView} getTitle={(navState) => navState.key} />
                    <Scene key="switcher" component={Switch} selector={(props) => {
                        return 'text1';
                    }}>
                        <Scene key="text1" text="text1" component={(props) => <SwitcherPage {...props} text={currentSwitchPage} />} />
                        <Scene key="text2" text="text2" component={(props) => <SwitcherPage {...props} text={currentSwitchPage} />} />
                    </Scene>
                    <Scene key="landingView" component={LandingView} title="LandingView">

                    </Scene>


                    <Scene key="CreateAccountViewContainer" component={CreateAccountViewContainer} title="CreateAccountViewContainer" initial={true} />



                    <Scene key="register" component={Register} title="Register"/>
                    <Scene key="register2" component={Register} title="Register2" duration={1}/>
                    <Scene key="home" component={Home} title="Replace" type="replace"/>
                    <Scene key="launch" component={Launch} title="Launch"  />
                    <Scene key="login" direction="vertical"  >
                        <Scene key="loginModal" component={Login} title="Login"/>
                        <Scene key="loginModal2" hideNavBar={true} component={Login2} title="Login2" panHandlers={null} duration={1}/>
                    </Scene>
                    <Scene key="tabbar" component={NavigationDrawer}>
                        <Scene key="main" tabs={true} >
                            <Scene key="tab1"  title="Tab #1" icon={TabIcon} navigationBarStyle={{backgroundColor:"red"}} titleStyle={{color:"white"}}>
                                <Scene key="tab1_1" component={TabView} title="Tab #1_1" onRight={()=>alert("Right button")} rightTitle="Right" />
                                <Scene key="tab1_2" component={TabView} title="Tab #1_2" titleStyle={{color:"black"}}/>
                            </Scene>
                            <Scene key="tab2" initial={true} title="Tab #2" icon={TabIcon}>
                                <Scene key="tab2_1" component={TabView} title="Tab #2_1" renderRightButton={()=><Right/>} />
                                <Scene key="tab2_2" component={TabView} title="Tab #2_2" onLeft={()=>alert("Left button!")} leftTitle="Left" duration={1} panHandlers={null}/>
                            </Scene>
                            <Scene key="tab3" component={TabView} title="Tab #3" hideTabBar={true} icon={TabIcon}/>
                            <Scene key="tab4" component={TabView} title="Tab #4" hideNavBar={true} icon={TabIcon}/>
                            <Scene key="tab5" component={TabView} title="Tab #5" hideTabBar={true} hideNavBar={true} icon={TabIcon}/>
                        </Scene>
                    </Scene>
                </Scene>
                <Scene key="error" component={Error}/>
            </Scene>
        </Router>;
    }
}
