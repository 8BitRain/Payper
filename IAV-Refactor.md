### IAV Refactor

To start the IAV you need
  (1) Firebase token
  (2) IAV token

The IAV is loaded when startIAV is not an empty string

Before the IAV is loaded we check if the customerStatus is
  (1) document - submit additional identification documents
  (2) retry - go through customer creation process again
  (3) suspended - wait until not suspended
