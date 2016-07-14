## Coincast

*some miscellaneous documentation that i'll move elsewhere at a later date - brady*

💣 When the splash page is reached, signInWithKey() is called.
    => If a key is found, user will be authenticated with Firebase and logged
       to AsyncStorage via with their:
         a) corresponding user object  (@Store:user)
         b) new session_token          (@Store:session_key)
         c) payment flow               (@Store:payment_flow)
         d) friend list                (@Store:friend_list)
       and be redirected to MainView
   => If a key is not found, user will be redirected to SignInView and, on
     submit, signInWithEmail() is called. Upon success, all the above is
     logged and the user is redirected to MainView.

💣 Upon sign in success the app will subscribe to three listeners, each
   of which are outlined below.

   1) subscribeToUser() - listens for changes to the user object in
      Firebase and updates @Store:user in AsyncStorage

   2) subscribeToFriends() - listens for changes to the friendList object
      in Firebase and updates @Store:friend_list in AsyncStorage

   3) subscribeToPayments() - listens for changes to the paymentFlow
      object in Firebase and updates @Store:payment_flow in AsyncStorage

💣 Here I'll outline how each of these listeners trigger re-renders of
   their respective view components.

   1) When a change is detected, we call AS.mergeItem('old', 'new');

   2) Upon success, a callback is triggered in the corresponding State.js
      script. (for example, when a payment is added, the callback in
      MainViewContainer.js is triggered)

   3) This callback fetches the new payment list from AsyncStorage and
      updates the state, triggering a re-render in the view.

## Note:

Normally, after a code change to react-native-router-flux src files,
you must remove the node_modules/react-native-router-flux directory
and npm install.  The react-native packager wont follow symlinks.

To assist development, this command watches and rsyncs changes:

```
npm run sync-rnrf
```

Leave a terminal open running this command when running the Example
app and making react-native-router-flux src changes.
