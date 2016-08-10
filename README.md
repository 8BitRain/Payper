# ![](./godmode.png) **Payper**
### Recurring payments made easy.

## **Todo**

### Frontend
- [x] Sidebar
- [x] In-app notifications
- [ ] Push notifications
- [ ] Edit profile panel (Eric)
- [x] Facebook auth
- [x] Facebook friend synchronization
- [x] Contact synchronization
- [ ] Invites (direct)
- [x] Invites (via payment)
- [ ] App-wide validations (Bank Onboarding, Payper Account Creation, Pay & Request)
- [ ] App-wide empty states (Tracking Page, Notifications, Payment History)
- [x] Revamp loading screen component
- [ ] Bind Facebook sign out to our custom sign out button in the side menu

### Polish
- [X] CreatePaymentView.js predictive search: limit predictions to 4
- [X] CreatePaymentView.js predictive search: don't show signed in user in predictions
- [ ] Pass numNotifications to menu in sidebar and render preview indicator next to notifications lightbulb
- [X] Apply fade animation to inner content during create account onboarding, not entire view
- [ ] App-wide padding (look into pixel density for screen size detection)
- [ ] Redesign footer (action button for new payment)
- [ ] Fix loading for IAV
- [ ] Style 'Continue with Facebook' button
- [ ] Implement section headers in predictive user search module's ListView

### Architecture
**Refactor the following to fit new Firebase/Redux model:**
- [x] Main
- [x] Payment creation
- [x] Splash page

### Bugs
- [X] Header only displays notifications on Notifications page (probably an
  issue with how numNotifications is passed to <Content />)
- [X] "Runtime is not ready for debugging" randomly appears.  **This went away when I downgraded from Node 6.2.0 to 5.5.0**
- [ ] "Severe Error, duplicates recorded in Firebase, with no auth information. To reproduce
      delete an id but not a users and Facebook id, or switch this around until you can get duplicate users through Facebook sign in or regular user sign in." https://github.com/facebook/react-native/issues/6682
- [ ] User filter regex treats an exact match as a non-match ( StringMaster5000.filterContacts() )
- [ ] `@Eric` Sign in with Facebook throws `Cannot read property dispatchSetProvider of undefined` (LandingScreenView.js ln 164)

### Brady (MVP)
- [ ] Style payment invites
- [ ] Add global user list to UserSearch
- [x] Add confirmation message to cancel payment button
- [x] Add instant updating for payment cancellation
- [ ] Add instant updating for payment confirmation and rejection
- [ ] Fix user search regex bug
- [ ] All pay and request invites are sent to "Incoming" tab (talk to Vash)
- [ ] Fix opacity header icons in CreatePaymentView
- [ ] Fix issue where Payper contact list sometimes doesn't populate above phone contacts in UserSearchView (is Firebase listener receiving empty contacts and concatenating an empty array with native contacts?)
- [ ] Fix header padding on small phones

### Brady (post-MVP)
- [ ] Implement action sheets

## **Installation**
```
$  git clone https://github.com/8BitRain/GetCoincast.git
$  cd ~/path/to/repo
$  npm install
$  git push -u origin master
```

## **Running**
```
$  cd ~/path/to/repo
$  react-native run-ios
```

## **Contributing**
1. Create your branch: `git checkout -b yung-branch`
2. Commit your changes: `git commit -am 'Change a lil somethin'`
3. Push to the branch: `git push origin yung-branch`
4. Checkout master: `git checkout master`
5. Merge with branch: `git merge yung-branch`
6. Resolve conflicts (if any)
7. Commit your changes `git commit -am 'Merge with yung-branch'`
8. Push to master `git push origin master`

## **Troubleshooting**
* If a non-existent node module error is thrown, run `npm install --save node-module-name`.

## **The Team**
| Front end (💣)       | Back end  | Multi-purpose Gurus|
|:--------------------:|:---------:|:------------------:|
| Eric & Brady         | Vash      | Mo & Luke          |

## **Versions**
* Stay at Node 5.5.0 for now! Things break on 6.2.0

## **Note:**
Normally, after a code change to react-native-router-flux src files,
you must remove the node_modules/react-native-router-flux directory
and npm install.  The react-native packager wont follow symlinks.

To assist development, this command watches and rsyncs changes:

```
npm run sync-rnrf
```

Leave a terminal open running this command when running the Example
app and making react-native-router-flux src changes.
