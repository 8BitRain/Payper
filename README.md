# ![](./godmode.png) **Payper**
### Recurring payments made easy.

## **Todo**

### Frontend
- [x] Sidebar
- [x] In-app notifications
- [x] Facebook auth
- [x] Facebook friend synchronization
- [x] Contact synchronization
- [x] Invites (via payment)
- [x] Revamp loading screen component
- [x] Bind Facebook sign out to our custom sign out button in the side menu
- [ ] Push notifications
- [ ] Edit profile panel
- [ ] Invites (direct)
- [ ] App-wide validations (Bank Onboarding, Payper Account Creation, Pay & Request)
- [ ] App-wide empty states (Tracking Page, Notifications, Payment History)

### Polish
- [X] CreatePaymentView.js predictive search: limit predictions to 4
- [X] CreatePaymentView.js predictive search: don't show signed in user in predictions
- [X] Pass numNotifications to menu in sidebar and render preview indicator next to notifications lightbulb
- [X] Apply fade animation to inner content during create account onboarding, not entire view
- [X] Style 'Continue with Facebook' button
- [ ] Fix loading for IAV
- [ ] Increase padding on "Continue without Facebook" text (difficult to press rn)
- [ ] Revamp loading screens
- [ ] Get rid of ugly refresh on notifications indicator
- [ ] Find a sleeker, more modern icon set

### Architecture
**Refactor the following to fit new Firebase/Redux model:**
- [x] Main
- [x] Payment creation
- [x] Splash page

### Bugs
- [X] Header only displays notifications on Notifications page (probably an
  issue with how numNotifications is passed to <Content />)
- [X] "Runtime is not ready for debugging" randomly appears.  **This went away when I downgraded from Node 6.2.0 to 5.5.0**
- [ ] "Severe Error, duplicates recorded in Firebase, with no auth information. To reproduce delete an id but not a users and Facebook id, or switch this around until you can get duplicate users through Facebook sign in or regular user sign in." https://github.com/facebook/react-native/issues/6682

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
- [X] Fix bug where notifications indicator is not rendered as a perfect circle on smaller devices
- [X] Add global user list to UserSearch (naive approach)
- [ ] Add edit pages for profile attributes
- [ ] Add micro deposit validation screen to payment creation flow if user has not yet verified their bank account
- [ ] Add an onPress destination to notifications
- [ ] Create a PaymentSeries module, containing detailed information about the payment series, and the option to skip/reschedule payments
- [ ] Redesign BankAccountsView

### MVP Usability and Design Bugs (Brady)
- [X] Adjust CreatePayment flow so that after payment creation: payment creation => outgoing tab of payments view, request creating => incoming tab of payments view
- [X] Add back button to final page of CreatePaymentView
- [X] Change placeholder numbers for cost and number of payments to 0
- [X] Change landing page options to just "Continue with Facebook" and "Continue without Facebook"
- [X] Fix profile pic preview for non-Facebook accounts on 'Profile'

### MVP Logic Bugs (Brady)
- [X] Fix bug where user state is not properly reset upon signing out and signing in with another account
- [X] Fix bug where app crashes if an incoming payment is cancelled
- [X] Fix bug where Incoming/Outgoing filter state is not saved during payment creation, resulting in Outgoing payments being rendered even though the Incoming tab is selected, and vice versa
- [X] Fix bug where payment state is not reset after creating a payment
- [ ] Fix bug where sign in sometimes fails
- [ ] Fix bug where, upon Facebook sign in, user's session token is undefined on the add phone number screen
- [ ] Fix bug where the invite via payment endpoint receives incorrect sender/recip traits
- [ ] Make sure payments are deleting properly (sometimes throws this.props.invite is undefined)
- [ ] Fix bug where you can still press create payment confirmation button while it's sending and create multiple payments

### Things I Need Vash For (Brady)
- [X] Fix bug where inviting via payment exits before completing request
- [X] Attach "type" to Firebase payment object when creating a new payment
- [ ] Fix bug where payment creation sometimes fails
- [ ] Create Lambda endpoint that returns a decrypted phoneNumber:uid list
- [ ] Discuss backend logic for token refresh (Option 1: Create an endpoint called updateSessionToken that takes a new session token and an old session token, cycles the old token out, and returns a user object. Option 2: Completely handle refresh in the backend. Option 1 > Option 2, probably)
- [ ] Hit Lambda.updatePhoneContacts() on load

### Back-burner
- [ ] Design photo selector for profile picture upload
- [ ] Transfer create payment flow to modal instead of separate scene

### 8/31 Hackathon
- [X] Research and resolve token refresh issue
- [X] Fix Incoming/Outgoing tab padding (need to be easier to press)
- [ ] Finish edit profile component
- [ ] Fix ugly notification indicators
- [ ] Fix duplicate user bug in global user search list
- [ ] Sign-in success on second attempt looks whack

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
