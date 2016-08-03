# The Main Module
#### Wraps all components that have access to the SideMenu

## Overview
The Main module has three parts:
1. MainState.js
2. MainViewContainer.js
3. MainView.js

## MainState.js
MainState.js contains the MainReducer, which controls state variables and action
creators for the 'main' section of the global Redux state. Check initialState for
a list of things controlled by MainState. (Basically, anything that needs to be
globally accessible throughout the app is stored in MainState).

## MainStateViewContainer.js
MainStateViewContainer.js contains the connect function for MainView.js. Atypical
dispatch functions include initialize(), startListening(), and stopListening().

#### initialize()
1. Gets the current user from AsyncStorage and stores it in the 'main' section of
the Redux global state
* `state.getIn(['main', 'user'])`
2. Stores the 'signedIn' boolean in the 'main' section of the Redux global state
* `state.getIn(['main', 'signedIn'])`

#### startListening()
1. Activates Firebase listeners on the signed in user's notification list and app flags
and updates the following variables in the 'main' section of the global Redux state
whenver these Firebase trees change:
* `state.getIn(['main', 'notifications'])`
* `state.getIn(['main', 'numNotifications'])`
* `state.getIn(['main', 'flags'])`
2. Is called on MainView mount

#### stopListening()
1. Disables all enabled Firebase listeners.
2. Is called on MainView unmount


## MainStateView.js
The MainStateView wraps all pages of the app that need access to the SideMenu.
Those components include:
* Payments
* Notifications
* Edit Profile
* Banks & Cards
* Payment History

The view contains two components:
1. <Main />
* Houses code for the SideMenu
* Connects to MainStateViewContainer's connect() function
* Passes global redux state down to <InnerContent />
2. <InnerContent />
* Houses all page-specific content (all code except SideMenu and Header)
* Determines which page to render based on switch statement which switches on
state.getIn(['main', 'currentPage'])
