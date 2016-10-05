
## **Todo (Complete)**

### Frontend
- [x] Sidebar
- [x] In-app notifications
- [x] Facebook auth
- [x] Facebook friend synchronization
- [x] Contact synchronization
- [x] Invites (via payment)
- [x] Revamp loading screen component
- [x] Bind Facebook sign out to our custom sign out button in the side menu
- [X] Edit profile panel
- [X] Invites (direct)
- [X] App-wide validations (Bank Onboarding, Payper Account Creation, Pay & Request)

### Polish
- [X] CreatePaymentView.js predictive search: limit predictions to 4
- [X] CreatePaymentView.js predictive search: don't show signed in user in predictions
- [X] Pass numNotifications to menu in sidebar and render preview indicator next to notifications lightbulb
- [X] Apply fade animation to inner content during create account onboarding, not entire view
- [X] Style 'Continue with Facebook' button
- [X] Increase padding on "Continue without Facebook" text (difficult to press rn)

### Architecture
**Refactor the following to fit new Firebase/Redux model:**
- [x] Main
- [x] Payment creation
- [x] Splash page

### Bugs
- [X] Header only displays notifications on Notifications page (probably an
  issue with how numNotifications is passed to <Content />)
- [X] "Runtime is not ready for debugging" randomly appears.  **This went away when I downgraded from Node 6.2.0 to 5.5.0**
- [X] "Severe Error, duplicates recorded in Firebase, with no auth information. To reproduce delete an id but not a users and Facebook id, or switch this around until you can get duplicate users through Facebook sign in or regular user sign in." https://github.com/facebook/react-native/issues/6682

### Brady
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
- [X] Hit `Lambda.updateContacts()` on load, updating user's contactList
- [X] Add edit pages for profile attributes
- [X] Redesign BankAccountsView
- [X] Finish edit profile component
- [X] When a payment completes, move it from payment flow to payment history in Firebase
- [X] Bind a Bank Account onboarding modal to the 'Add a Bank Account' button on the Bank Accounts page
- [X] If user's onboarding status is not complete, make them add a bank account before they can make a payment
- [X] Add optimistic deletion for funding sources
- [X] Handle case where user makes payment to another user who hasn't yet added a funding source
- [X] Bind bank accounts to Redux store so deletion persists app-wide.
- [X] Add confirmation alert for bank account deletion
- [X] Set up listeners for username and funding source

### MVP Usability and Design Bugs (Brady)
- [X] Adjust CreatePayment flow so that after payment creation: payment creation => outgoing tab of payments view, request creating => incoming tab of payments view
- [X] Add back button to final page of CreatePaymentView
- [X] Change placeholder numbers for cost and number of payments to 0
- [X] Change landing page options to just "Continue with Facebook" and "Continue without Facebook"
- [X] Fix profile pic preview for non-Facebook accounts on 'Profile'
- [X] Fix Incoming/Outgoing tab padding (need to be easier to press)
- [X] Fix keyboard spacing on edit profile pages for small phones (add real header component to the modal)
- [X] Transfer create payment flow to modal instead of separate scene
- [X] Move to correct payment flow tab after payment creation
- [X] Add a confirmation alert for when non-Facebook users sign out
- [X] Refactor sign in screen to properly display invalid email, too many attempts, and reset password messages

### MVP Logic Bugs (Brady)
- [X] Fix bug where user state is not properly reset upon signing out and signing in with another account
- [X] Fix bug where app crashes if an incoming payment is cancelled
- [X] Fix bug where Incoming/Outgoing filter state is not saved during payment creation, resulting in Outgoing payments being rendered even though the Incoming tab is selected, and vice versa
- [X] Fix bug where payment state is not reset after creating a payment
- [X] Fix bug where, upon Facebook sign in, user's session token is undefined on the add phone number screen (Eric fixed)
- [X] Fix bug where token doesn't refresh on launch, resulting in failed endpoint hits
- [X] Fix bug where the invite via payment endpoint receives incorrect sender/recip traits
- [X] Fix bug where users multiply in global user area of UserSearch (in listener, don't concatenate entire contactList with the current array, just new children)
- [X] Fix bug where you can still press create payment confirmation button while it's sending and create multiple payments
- [X] Don't render current user in UserSearch
- [X] Don't show Facebook icon for non-Facebook users in UserSearchView confirmation
- [X] Fix bug where sign in sometimes fails (tough to recreate, may be a non-issue)
- [X] Make sure payments are deleting properly (sometimes throws this.props.invite is undefined)
- [X] Listen to appFlags > numUnseenNotifications for notification indicator instead of counting them up in the front-end
- [X] Research and resolve token refresh issue
- [X] Fix duplicate user bug in global user search list
- [X] Fix bug where "Purpose" text input does not save if the user has already pressed "Pay" or "Request" and is changing something before pressing "Confirm" (just don't update payment info until user presses confirm)
- [X] Fix bug where active filter highlighting does not change accordingly after a payment is created
- [X] Fix bug where session token sign in does not work for non-Facebook users (must manually sign in each launch
- [X] Fix bug where empty notification indicator is rendered in sidebar if user has zero unseen notifications
- [X] Fix duplicate user bug in UserSearch
- [X] Don't render contacts in 'Other Payper Users' list
- [X] Fix bug where payment request rejection does not optimistically delete, also
- [X] Fix bug where payment request accept does not optimistically re-render
- [X] Set up a cron job to refresh session token every 25 minutes
- [X] Clear payment card timer interval on unmount
- [X] Fix issue where, after adding a funding source and being taken to the app, your funding source is not loaded, but is loaded after you close and reopen the app. (Fixed on generic accounts, still occurs for Facebook accounts)

### Things I Need Vash For (Brady)
- [X] Fix bug where inviting via payment exits before completing request
- [X] Attach "type" to Firebase payment object when creating a new payment
- [X] Fix bug where payment creation sometimes fails

### Dwolla Requirements
- [X] Accept Dwolla TOS + Privacy Policy (link to Dwolla docs)
- [X] Display funding source before payment creation
- [X] FAQ
- [X] Delete account button