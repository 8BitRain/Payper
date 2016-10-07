
## **Todo (Pending)**

### Refactor
- [X] Refactor Settings module to fit User class refactor
- [X] Refactor Header module to fit User class refactor
- [X] Refactor Payments module to fit User class refactor
- [X] Refactor Profile module to fit User class refactor
- [X] Refactor UserSelection module to fit User class refactor
- [ ] Make sure UserSelection's 'Contacts' section is populated
- [ ] Refactor FundingSources module to fit User class refactor (waiting for Vash to rename 'fundingSource' to 'fundingSourceLocation' in Firebase)
- [ ] Rethink app-wide empty states

### Profile
- [ ] Design photo selector for profile picture upload
- [ ] Make sure unblock user endpoint is working properly
- [ ] Rethink handling contacts with multiple numbers (if there's more than one number, use the 'Mobile' number)

### Payment Cards
- [ ] Create an exit animation for completed payments
- [ ] Create a PaymentSeries component containing detailed information about the payment series and the option to skip/reschedule payments
- [ ] Debug and refactor nextPayment timer

### Onboarding
- [ ] Refactor all things IAV

### Notifications
- [ ] Push notifications
- [ ] Get rid of ugly refresh on notifications indicator
- [ ] Fix ugly notification indicators (double digits and beyond look bad)
- [ ] Break notifications ListView down into 'Read' and 'Un-Read' sections
- [ ] Add an onPress destination for notifications

### Login
- [ ] Add a 'Forgot Password' button to LoginModal

### Non-code
- [ ] Create an animated loading svg based off the logo in Illustrator
- [ ] Find a sleeker, more modern icon set
- [ ] Find a better font
- [ ] Create a system for dispute resolution (web)
- [ ] Create a support request system (web)
