## Binding Firebase and Redux
#### A blueprint for a responsive, real-time Redux store populated by Firebase

## Overview
Our example modules consists of four parts:
  1. The state (`FirebaseBindingState.js`)
  2. The view container (`FirebaseBindingViewContainer.js`)
  3. The view (`FirebaseBindingView.js`)
  4. The helpers (`~/services/Firebase.js`)

## The State
Our module's state uses the standard Redux architecture, consisting of the following:
  1. A state initializer
  2. Action types
  3. Action creators
  4. A reducer
#### Configuring the state
* Use `FirebaseBindingState.js` as a blueprint.
* Be sure to update the list of connected reducers in `~/redux/reducer.js`.
* **Be sure to provide an ActiveFirebaseListeners array in the initial state containing each Firebase endpoint that you'd like to subscribe to. For example, the following will enable listeners for 'firebase.database.ref('/TestEndpoint')'**
  ```
  const initialState = Map({
    valueOne: "1",
    valueTwo: "2",
    activeFirebaseListeners: ['TestEndpoint']
  });
  ```

## The View Container
Our module's view container has one purpose: to give our base View access to Redux props and functions through the connect function.
The connect function has two jobs:
  1. Map our Redux state to props
  2. Map dispatch functions (AKA action creators) to props
The `mapDispatchToProps` function in `FirebaseBindingViewContainer.js` contains two important functions that enable Firebase connectivity.
  1. `listen: (listeners) => { ... }` provides
