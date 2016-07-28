# Binding Firebase and Redux
#### A blueprint for a responsive, real-time Redux store populated by Firebase

## Overview
Our example modules consists of four parts:
  1. The state (`FirebaseBindingState.js`)
  2. The view container (`FirebaseBindingViewContainer.js`)
  3. The view (`FirebaseBindingView.js`)
  4. The Firebase helpers (`~/services/Firebase.js`)

## The State
Our module's state uses a standard Redux architecture, consisting of the following:
  1. A state initializer
  2. Action types
  3. Action creators
  4. A reducer to carry out actions

#### Configuring the state
* Use `FirebaseBindingState.js` as a blueprint
* Be sure to update the list of connected reducers in `~/redux/reducer.js`
* **Provide an ActiveFirebaseListeners array in the initial state containing each Firebase endpoint that you'd like to listen to**

  For example, the following will enable listeners for `firebase.database.ref('/TestEndpoint')`

  ```javascript
  const initialState = Map({
    valueOne: "1",
    valueTwo: "2",
    activeFirebaseListeners: ['TestEndpoint']
  });
  ```

## The View Container
Our module's view container has one purpose: to give our base view access to redux state values and dispatch functions through props.
Our connect function breaks this down into two tasks:
  1. Map state to props
  2. Map dispatch functions to props  
    **Note: dispatch functions can act as more than just action creators, but we use them for this base purpose only**

The `mapDispatchToProps` function in `FirebaseBindingViewContainer.js` contains two important functions that enable Firebase connectivity:
  1. Triggers the `listenTo(endpoints, callback)` function in our Firebase helper script. In our example, we use the callback function to simply update the redux store. **Define your custom behavior for incoming Firebase data in this callback function.**
  ```javascript
  listen: (endpoints) => {

    // Initialize Firebase listeners
    Firebase.listenTo(endpoints, (response) => {

      // Update redux store with Firebase data
      switch (response.key) {
        case "TestValueOne":
          dispatch(d.setValueOne(response.value));
        break;
        case "TestValueTwo":
          dispatch(d.setValueTwo(response.value));
        break;
      }

    });

    //  Update state's list of active Firebase listeners
    dispatch(d.setactiveFirebaseListeners(endpoints));

  }
  ```

  2.  Triggers the `stopListeningTo(endpoints)` function in our Firebase helper script, disabling listeners on all endpoints in our state's list of active Firebase listeners.
  ```javascript
  stopListening: (endpoints) => {

    // Disable Firebase listeners
    Firebase.stopListeningTo(endpoints);

    // Wipe our list of active Firebase listeners
    dispatch(d.setactiveFirebaseListeners([]));

  }
  ```

## The Firebase Helpers
We've defined two helper functions in `~/services/Firebase.js` to enable Firebase connectivity:
  1. `listenTo(endpoints, callback)` instantiates listeners for the provided endpoints and returns new values via callback function.

  **Return data from this function looks like this:** `{ key: snapshot.key, value: snapshot.val() }`

  2. `stopListeningTo(endpoints)` turns off active listeners for the provided endpoints

## The View
Our view has three jobs:
  1. Instantiate Firebase listeners on mount

  ```javascript
  componentDidMount() {
    this.props.listen(this.props.activeFirebaseListeners);
  }
  ```
  2. Disable Firebase listeners on unmount

  ```javascript
  componentWillUnmount() {
    this.props.stopListening(this.props.activeFirebaseListeners);
  }
  ```

  3. Render redux state values provided as props by the connect function

  ```javascript
  <Text style={{fontFamily: 'Roboto', color: 'black', fontSize: 16}}>
    valueOne == { this.props.valueOne }
  </Text>
  ```