# ![](./godmode.png) **Payper**
### Recurring payments made easy.

## **Todo**

### Frontend
- [x] Sidebar
- [x] In-app notifications
- [ ] Push notifications
- [ ] Edit profile panel
- [x] Facebook auth
- [x] Facebook friend synchronization
- [x] Contact synchronization
- [ ] Invites (direct)
- [x] Invites (via payment)
- [ ] App-wide validations (Bank Onboarding, Payper Account Creation, Pay & Request)
- [ ] App-wide empty states (Tracking Page, Notifications, Payment History)
- [x] Revamp loading screen component
- [x] Bind Facebook sign out to our custom sign out button in the side menu

### Polish
- [X] CreatePaymentView.js predictive search: limit predictions to 4
- [X] CreatePaymentView.js predictive search: don't show signed in user in predictions
- [X] Pass numNotifications to menu in sidebar and render preview indicator next to notifications lightbulb
- [X] Apply fade animation to inner content during create account onboarding, not entire view
- [ ] Fix loading for IAV
- [X] Style 'Continue with Facebook' button

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

### Brady (MVP)
- [X] Style payment invites
- [X] Add confirmation message to cancel payment button
- [X] Add instant re-render for 'Cancel Payment' action
- [X] Add instant re-render for 'Accept' and 'Reject' actions
- [X] Fix bug where 'Confirm' and 'Reject' buttons aren't working properly
- [X] Fix issue where all pay and request invites are sent to "Incoming" tab (talk to Vash)
- [X] Fix opacity of header icons in CreatePaymentView
- [X] Fix issue where Payper contact list sometimes doesn't populate above phone contacts in UserSearchView (is Firebase listener receiving empty contacts and concatenating an empty array with native contacts?)
- [X] Fix header padding on small phones
- [X] Add invitee's phone number to second page of CreatePaymentView where a username would typically be rendered
- [X] Fix bug where payment cancellation confirmation name syntax is backwards for incoming payments
- [X] Fix bug where selecting a new page in the side menu results in rough animation (this just went away 🤔)
- [X] Fix issue where text does not wrap in the side menu
- [X] Redesign footer to be tab-less
- [X] Add brute force attack protection for log in
- [X] Set up reset password email sending
- [X] Add funding sources page
- [X] Add delete user button
- [X] Fix bug where on on UserSearch page of CreatePaymentView a single space is treated as a name
- [X] Add validations to CreatePayment flow
- [X] Fix bug where user filter regex treats an exact match as a non-match ( StringMaster5000.filterContacts() )
- [X] Add profile page
- [X] Decrypt and append phone number and email address to user object on load
- [X] Add section headers to user ListView in UserSearch
- [X] (Vash) Modify markAsSeen endpoint to take an array of notification ID's and mark them all as seen at once
- [X] Fix bug where notifications indicator is not rendered as a perfect circle on smaller devices
- [ ] Add global user list to UserSearch
- [ ] Add edit pages for certain properties of profile
- [ ] Add micro deposit validation to CreatePaymentFlow if user has not yet verified their bank account

### MVP Usability Bugs (Brady)
- [X] Adjust CreatePayment flow so that after payment creation: payment creation => outgoing tab of payments view, request creating => incoming tab of payments view
- [ ] Add back button to final page of CreatePaymentView
- [ ] Change placeholder numbers for cost and number of payments to "$0" and "0 months," respectively

### MVP Logic Bugs (Brady)
- [ ] (May be fixed, come back to this if issue occurs again) Fix bug where user state is not properly reset upon signing out and signing in with another account
- [ ] (Have Vash check if he's attaching type to newly created payments) Fix bug where payment creation endpoint was not receiving a payment type (payment, request, or invite)
- [X] Fix bug where app crashes if an incoming payment is cancelled
- [X] Fix bug where Incoming/Outgoing filter state is not saved during payment creation, resulting in Outgoing payments being rendered even though the Incoming tab is selected, and vice versa
- [X] Fix bug where payment state is not reset after creating a payment
- [ ] Fix bug where sign in sometimes fails
- [ ] Fix bug where payment creation sometimes fails (talk to Vash)
- [ ] Fix bug where cancel payment endpoint is not receiving a type
- [ ] Implement token refreshing

### Dwolla Requirements
- [X] Accept Dwolla TOS + Privacy Policy (link to Dwolla docs)
- [ ] Request permission for automatic monthly transactions
- [ ] Display funding source before payment creation (Groundwork is laid, just plug in data)
- [ ] Post initiation transfer time
- [ ] Delete account button
- [ ] FAQ
- [ ] Support
- [ ] Dispute Resolution

### Not MVP
- [ ] Implement action sheets
- [ ] Add recent users list to UserSearchView
- [ ] Add section headers to user search list view

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
