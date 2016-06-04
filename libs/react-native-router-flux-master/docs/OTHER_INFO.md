# Other Info

This is a place for information that needs to be documented, but aren't long enough to warrant their own file yet.

- Modals
- Tabbar
- Custom navbar
- Switch
- Splitting Scenes
- Drawer (side-menu)
- Sub-Scenes

## Modals
To display a modal use `Modal` as root renderer, so it will render the first element as `normal` scene and all others as popups (when they are pushed), see Example for more details.

## Tabbar
Every tab has its own navigation bar. However, if you do not set its parent `<Scene tabs={true} />` with `hideNavBar={true}`, the tabs' navigation bar will be overrided by their parent.

## Custom nav bar for individual scene or even different state of scene (new feature):
Your scene `component` class could implement _static_ renderNavigationBar(props) method that could return different navbar depending from component props

## Switch (new feature)
New feature for 3.x release is custom scene renderer that should be used together with tabs={true} property. It allows to select `tab` scene to show depending from app state.
It could be useful for authentication, restricted scenes, etc. Usually you should wrap `Switch` with redux `connect` to pass application state to it:
Following example chooses scene depending from sessionID using Redux:
```jsx
<Scene key="root" component={connect(state=>({profile:state.profile}))(Switch)} tabs={true}
       selector={props=>props.profile.sessionID ? "main" : "signUp"}>
    <Scene key="signUp" component={SignUp}/>
    <Scene key="main" component={Main}>
</Scene>
```

## Split your scenes to smaller parts if needed
Scenes concept is similar to iOS storyboard where you describe all your app screens in one place. However for some large apps, you may want to split it, like iOS app could have several iOS storyboards for different areas of the app.
Luckily, you could easy split Scenes using NodeJS built-in require calls:
```jsx
            <Router>
                    {require("./scenesForTabBar")}
                    {require("./scenesForAnotherPart")}
            </Router>
```

scenesForTabBar.js:
```jsx
import React from 'react-native';
import {Scene} from 'react-native-router-flux';

module.exports = <Scene key="tabbar" tabs={true}>
   // scenes here
</Scene>;
```

## Drawer (side menu) integration
Example of Drawer custom renderer based on react-native-drawer. Note that the build-in NavBar component supports toggling of drawer. The Drawer implementation just needs to have a function: toggle();

```jsx
import React from 'react-native';
import Drawer from 'react-native-drawer';
import SideMenu from './SideMenu';
import {DefaultRenderer} from 'react-native-router-flux';

export default class extends Component {
    render(){
        const children = this.props.navigationState.children;
        return (
            <Drawer
                ref="navigation"
                type="displace"
                content={<TabView />}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                negotiatePan={true}
                tweenHandler={(ratio) => ({
                 main: { opacity:Math.max(0.54,1-ratio) }
            })}>
                <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
            </Drawer>
        );
    }
}

/// then wrap your tabs scene with Drawer:
            <Scene key="drawer" component={Drawer}>
                <Scene key="main" tabs={true} >
                        ....
                </Scene>
            </Scene>

```
## Sub-scenes support
You could create 'sub-scene' actions by putting them as children for needed 'base' scene without `component` prop and call such action anywhere - 'base' Scene will be updated accordingly.
Example for 'My Account' screen with edit possibility (`MyAccount` component should call `Actions.editAccount()` to enable edit mode and process `save`, `editMode` properties accordingly - display edit controls, save data, etc.):

```jsx
<Scene key="myAccount" component={MyAccount} title="My Account">
    <Scene key="viewAccount" />
    <Scene key="editAccount" editMode rightTitle="Save" onRight={()=>Actions.saveAccount()} leftTitle="Cancel" onLeft={()=>Actions.viewAccount()} />
    <Scene key="saveAccount" save />
</Scene>
```
Note, that almost empty `viewAccount` sub-state here is needed to reset MyAccount to initial params defined for this scene (remove `save`, `editMode` and other properties from original state)
Sure it could be done using Redux, however it will require more coding and programmatic setting NavBar buttons using `refresh`.
