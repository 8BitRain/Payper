# React Native Router [![react-native-router-flux](http://img.shields.io/npm/dm/react-native-router-flux.svg)](https://www.npmjs.org/package/react-native-router-flux) [![Join the chat at https://gitter.im/aksonov/react-native-router-flux](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aksonov/react-native-router-flux?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Codacy Badge](https://api.codacy.com/project/badge/grade/c6d869e2367a4fb491efc9de228c5ac6)](https://www.codacy.com/app/aksonov-github/react-native-router-flux) [![npm version](https://badge.fury.io/js/react-native-router-flux.svg)](http://badge.fury.io/js/react-native-router-flux)

Router for React Native based on new React Native Navigation API.

## Documentation

- [Mini-Tutorial](docs/MINI_TUTORIAL.md)
- [API and Configuration](docs/API_CONFIGURATION.md)
  - Available Imports
  - Router API
  - Scene API
- [Detailed Example](docs/DETAILED_EXAMPLE.md)
- [Reactive/Redux/Flux](docs/REDUX_FLUX.md)
- [Other Info](docs/OTHER_INFO.md)
  - Modals
  - Tabbar
  - Custom navbar
  - Switch
  - Splitting Scenes
  - Drawer (side-menu)
  - Sub-Scenes
- [Changelog](docs/CHANGELOG.md)
- [Migrating from 2.x](docs/MIGRATION.md)

## Features

`react-native-router-flux` is a routing package that allows you to:

- Define scene transitions in one central location
- Without having to pass navigator objects around, and allow you to
- Call transitions anywhere in your code with a simple syntax (e.g. `Actions.login()`).

### New Features and Highlights

- **Highly Customizable Navigation Bar** - Show/hide the navbar depending on Scene or even the state of a Scene (e.g. Edit/Save navbar for edit mode).

- **Tab Bar Support** using [react-native-tab-navigator](https://github.com/exponentjs/react-native-tab-navigator) (see Example app).

- **Nested Navigators** (e.g. Each tab can have its own navigator, nested in a root navigator).

- **Custom Scene Renderers** for action sheet, native TabBarIOS or anything else. See built-in `Modal` renderer (to display popups) for example. *Call for PRs!* let's build some custom renderers for ActionSheet, Drawer, etc. Let's make an awesome library!

- **Dynamic Routing** allows you to choose which scene to render depending on application state (see the `Switch` renderer, useful for authentication).

- **Bring Your Own Reducer** for navigation state.

- **Reset History Stack** - The new `reset` Action for clearing the history stack and eliminates the navbar back button.

- **More Powerful State Control** - Support for having different states while on the same screen. For example, "View My Account" could allow in-place editing of fields and "Save", "Cancel" navigation bar buttons should appear.

## Getting Started

Check out the [mini-tutorial](docs/MINI_TUTORIAL.md) for a quick walkthrough of the routing system.

## Supported configurations

Before instaling please refer to the following table for supported react native series

| React Native - Series | React Native Router Flux - Series | Notes |
| --- | --- | --- |
| v0.22.x | v3.22.x |  |
| v0.23.x,  v0.24.x & v0.25.x | **Not supported** | Please refer to [#636](https://github.com/aksonov/react-native-router-flux/issues/636) for details   |
| v0.26.x | v3.26.x |  |
| v0.27.x *Release Candidate* | TBD | Work in progress, currently not supported   |

## Installation
```
npm i react-native-router-flux --save
```

## Usage
In your top-level `index.js`, define your scenes using the `Scene` component and pass it into the `Router` as children:
```jsx
import {Scene, Router} from 'react-native-router-flux';

class App extends React.Component {
  render() {
    return <Router>
      <Scene key="root">
        <Scene key="login" component={Login} title="Login"/>
        <Scene key="register" component={Register} title="Register"/>
        <Scene key="home" component={Home}/>
      </Scene>
    </Router>
  }
}
```
Alternatively, you could define all of your scenes during compile time and use it later within `Router`:
```jsx
import {Actions, Scene, Router} from 'react-native-router-flux';

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="login" component={Login} title="Login"/>
    <Scene key="register" component={Register} title="Register"/>
    <Scene key="home" component={Home}/>
  </Scene>
);

/* ... */

class App extends React.Component {
  render() {
    return <Router scenes={scenes}/>
  }
}
```

On any Scene, you can also call the following functions by first importing the `Actions` object:
```jsx
import {Actions} from 'react-native-router-flux'
```
And then:

* `Actions.ACTION_NAME(PARAMS)` will call the appropriate action and params will be passed to the scene.
* `Actions.pop()` will pop the current screen.
* `Actions.refresh(PARAMS)` will update the properties of the current screen.

## Production Apps using react-native-router-flux
+ GuavaPass.com ([iOS](https://itunes.apple.com/en/app/guavapass-one-pass-fitness/id1050491044?l=en&mt=8), Android) - offers convenient access to top classes at boutique fitness studios across Asia.
+ Epic Fail Videos ([iOS](https://itunes.apple.com/us/app/epic-fail-videos-best-fail/id1115219339), [Android](https://play.google.com/store/apps/details?id=com.hazuu.epicfailvideos)) - The best Fail Videos Collection, never miss a laugh with your friends!

## Support
Thanks to all who submitted PRs to 2.x release. If you like the component and want to support it, feel free to donate any amount or help with issues.
