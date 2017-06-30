## Scene: Main
`Main.js` is the primary dashboard of the app. It contains the following:
1. Firebase listener initialization code
2. Firebase cloud messenger initialization code (for push notifications)
3. Tab state bindings

### componentDidMount
* Initializes Firebase Cloud Messenger (FCM) permissions
* Fetches FCM token and sends it to API to be stored in Firebase
* Checks for push notification data and invokes `handlePushNotification()` if any is present
* Instantiates FCM notification listener and FCM token refresh listener

### componentWillMount
* Sets up appState listener which invokes `handleAppStateChange()`
* Instantiates firebase listeners located in [User.js](../../classes/User.js), passing updates to Redux connected update function
