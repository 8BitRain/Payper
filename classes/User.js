import * as firebase from 'firebase'
import * as Firebase from '../services/Firebase'
import * as Lambda from '../services/Lambda'
import * as Async from '../helpers/Async'
import * as SetMaster5000 from '../helpers/SetMaster5000'
import * as _ from 'lodash'
import * as config from '../config'
import Contacts from 'react-native-contacts'
import Mixpanel from 'react-native-mixpanel'
import { Actions } from 'react-native-router-flux'
import { FBLoginManager } from 'NativeModules'
import { AppState } from 'react-native'
import { Timer } from './Metrics'
const baseURL = config.details[config.details.env].lambdaBaseURL

export default class User {
  constructor(attributes) {
    if (attributes) for (var i in attributes) this[i] = attributes[i]
    this.paymentFlow = {}
    this.appFlags = {}
    this.payperContacts = []
    this.nativeContacts = []
    this.globalUserList = []
    this.bankAccount = {}
    this.handleAppStateChange = this.handleAppStateChange.bind(this)
  }

  /**
    *   Return all necessary user attributes for payment creation
  **/
  getPaymentAttributes() {
    let attributes = {
      first_name: this.first_name,
      last_name: this.last_name,
      profile_pic: this.profile_pic,
      uid: this.uid,
      username: this.username
    }

    return attributes
  }

  /**
    *   Update this user's attributes, then log the new user object to async storage
    *   attributes: a JSON containing propKey and propValue pairs
    *   -----------------------------------------------------------------------
  **/
  update(updates) {
    // console.log("Updating user with updates:", updates)
    for (var k in updates) this[k] = updates[k]
    let userCache = JSON.stringify(this)
    Async.set('user', userCache)
  }

  /**
    *   Initialize this user's attributes, listeners, and async storage links
    *   attributes: user, a JSON user object returned by getUser Lambda endpoint
    *   -----------------------------------------------------------------------
  **/
  initialize(user) {
    this.update(user)
    this.decrypt((res) => (res) ? this.update(res) : null)
    this.tokenRefreshInterval = setInterval(() => {
      this.refresh()
    }, ((60 * 1000) * 20))
    this.timer = new Timer()
    this.timer.start()
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange(state) {
    if (state === 'inactive') {
      return
    } else if (state === 'background') {
      this.timer.report("sessionDuration", this.uid)
    } else if (state === 'active') {
      this.timer = new Timer()
      this.timer.start()
      if (firebase.auth().currentUser !== null) this.refresh()
    }
  }

  /**
    *   Delete this user
  **/
  delete() {
    const _this = this
    Async.set('user', '')
    let user = firebase.auth().currentUser
    user.delete().then(
    () => {
      try {
        fetch(baseURL + "user/delete", {method: "POST", body: JSON.stringify({ token: _this.token, uid: _this.uid })})
        .then((response) => response.json())
        .then((responseData) => {
          if (!responseData.errorMessage) {
            console.log("Delete user Lambda response:", responseData)
            _this.destroy()
          } else {
            console.log("Error deleting user:", responseData.errorMessage)
          }
        })
        .done()
      } catch (err) {
        console.log("getUserWithToken failed...", "Lambda error:", err)
      }
    },
    (err) => {
      console.log("Error deleting user from Firebase auth:", err)
    })
  }

  /**
    *   Wipe this user's attributes, listeners, and async storage links
    *   -----------------------------------------------------------------------
  **/
  destroy() {
    Async.set('user', '')
    this.stopListening()
    clearInterval(this.tokenRefreshInterval)
    for (var i in this) if (typeof this[i] !== 'function') this[i] = null
  }

  /**
    *   Create a Dwolla customer for this user
    *   params: firstName, lastName, address, city, state, zip, dob, ssn
    *   tacked on params: email, phone, token
    *   -----------------------------------------------------------------------
  **/
  createDwollaCustomer(params, onSuccess, onFailure) {
    if (!params.email) params.email = this.decryptedEmail
    if (!params.phone) params.phone = this.decryptedPhone
    if (!params.token) params.token = this.token

    for (var k in params) {
      if (!params[k]) {
        alert("Tried to create a Dwolla customer but " + k + " is undefined")
        onFailure("undefined " + k)
        return
      }
    }

    try {
      fetch(baseURL + "customer/create", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.errorMessage) {
          console.log("createDwollaCustomer succeeded...", "Response data:", responseData)
          onSuccess(responseData.status)
        } else {
          console.log("createDwollaCustomer failed...", "Error:", responseData)
          try {
            let str = responseData.errorMessage
            let buffer = JSON.parse(str)
            let code = buffer[0].code
            onFailure(code)
          } catch(err) {
            onFailure("timed out")
          }
        }
      })
      .done()
    } catch (err) {
      console.log("createDwollaCustomer failed...", "Try/catch threw:", err)
      onFailure(err)
    }
  }

  /**
    *   Retry Dwolla customer creation
    *   params: firstName, lastName, address, city, state, zip, dob, ssn
    *   tacked on params: email, phone, token
    *   -----------------------------------------------------------------------
  **/
  retryDwollaVerification(params, onSuccess, onFailure) {
    params.email = this.decryptedEmail
    params.phone = this.decryptedPhone
    params.token = this.token

    try {
      fetch(baseURL + "customer/retryVerification", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.errorMessage) {
          console.log("retryDwollaVerification succeeded...", "Response data:", responseData)
          onSuccess(responseData.status)
        } else {
          console.log("retryDwollaVerification failed...", "Error:", responseData.errorMessage)
          onFailure(responseData.errorMessage)
        }
      })
      .done()
    } catch (err) {
      console.log("retryDwollaVerification failed...", "Try/catch threw:", err)
      onFailure(err)
    }
  }

  /**
    *   Get this user's native phone contacts
    *   -----------------------------------------------------------------------
  **/
  getNativeContacts(updateViaRedux) {
    Contacts.getAll((err, contacts) => {
      if (err) {
        Mixpanel.trackWithProperties('Error getting contacts', { err: JSON.stringify(err) })
        console.log("Error getting contacts", err)
      } else {
        const _this = this

        var c = []
        try {
          c = SetMaster5000.formatNativeContacts(contacts)
        } catch (err) {
          Mixpanel.trackWithProperties('Error formatting native contacts', { err: JSON.stringify(err) })
        }

        updateViaRedux({ nativeContacts: c })

        var numbersArray = []
        try {
          numbersArray = SetMaster5000.contactsArrayToNumbersArray(c)
        } catch (err) {
          Mixpanel.trackWithProperties('Error extracting native contacts', { err: JSON.stringify(err) })
        }

        Lambda.updateContacts({ token: this.token, phoneNumbers: numbersArray }, () => {
          console.log("Lambda.updateContacts callback was invoked")

          Firebase.listenUntilFirstValue("existingPhoneContacts/" + this.uid, (res) => {
            console.log("Firebase.listenUntilFirstValue callback was invoked")

            Firebase.scrub("existingPhoneContacts/" + this.uid)
            if (Array.isArray(res) && res.length > 0) {
              var parsedContacts = SetMaster5000.parseNativeContactList({ phoneNumbers: res, contacts: c })
              updateViaRedux({ nativeContacts: parsedContacts })
            }
          })
        })
      }
    })
  }

  /**
    *   Get user's bank account information (if any) from Lambda endpoint
    *   -----------------------------------------------------------------------
  **/
  getFundingSource(cb) {
    var params = { token: this.token }

    try {
      fetch(baseURL + "customer/getFundingSource", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        console.log("\n\ngetFundingSource res:", responseData)

        if (!responseData) {
          console.log("getFundingSource response was null")
          return
        }
        if (responseData && !responseData.errorMessage) cb({ bankAccount: responseData })
        else console.log("Error getting funding source", responseData.errorMessage)
      })
      .done()
    } catch (err) {
      console.log("Error getting funding source", err)
    }
  }

  /**
    *   Get decrypted version of all encrypted user attributes from Lambda endpoint
    *   -----------------------------------------------------------------------
  **/
  decrypt(cb) {
    var params = { token: this.token, uid: this.uid }

    try {
      fetch(baseURL + "user/getPersonal", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.errorMessage) cb({ decryptedEmail: responseData.email, decryptedPhone: responseData.phone })
        else console.log("Error decrypting user", responseData.errorMessage)
      })
      .done()
    } catch (err) {
      console.log("Error decrypting user", err)
    }
  }

  /**
    *   Get a new IAV token for this user
    *   params: token
    *   -----------------------------------------------------------------------
  **/
  getIAVToken(params, updateViaRedux) {
    try {
      fetch(baseURL + "utils/getIAV", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        console.log("User.getIAVToken responseData is", responseData)
        if (!responseData.errorMessage) {
          if (responseData.token)
            updateViaRedux({ IAVToken: responseData.token })
          else
            console.log("getIAVToken received an undefined token.")
        }
        else
          console.log("Error getting IAV token:", responseData.errorMessage)
      })
      .done()
    } catch (err) {
      console.log("Error getting IAV token:", responseData.errorMessage)
    }
  }

  /**
    *   Cycle this user's access and refresh tokens
    *   -----------------------------------------------------------------------
  **/
  refresh() {
    const _this = this
    firebase.auth().currentUser.getToken(true)
    .then(function(tkn) {
      _this.update({ token: tkn })
    }).catch(function(err) {
      console.log("Error getting new token:", err)
    })
  }

  /**
    *   Verify this user's Dwolla customer
    *   params: firstName, lastName, address, city, state, zip, dob, ssn
    *   (token is tacked on to params)
    *   -----------------------------------------------------------------------
  **/
  verify(params, cb) {
    params.token = this.token

    try {
      fetch(baseURL + "customer/verify", {method: "POST", body: JSON.stringify(params)})
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.errorMessage) {
          console.log("Customer verification succeeded! responseData:", responseData)
          cb(true)
        } else {
          console.log("Error verifying customer:", responseData.errorMessage)
          cb(false)
        }
      })
      .done()
    } catch (err) {
      console.log("Error verifying customer", err)
      cb(false)
    }
  }

  /**
    *   Enable listeners on this user's Firebase data
    *   -----------------------------------------------------------------------
  **/
  startListening(updateViaRedux) {
    this.endpoints = [
      {
        endpoint: 'usernames',
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          let globalUserList = SetMaster5000.globalUserListToArray({
            sectionTitle: "Other Payper Users",
            users: res,
            uid: this.uid
          })
          updateViaRedux({ globalUserList: globalUserList })
        }
      },
      {
        endpoint: 'users/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return

          updateViaRedux(res)

          // If user has a funding source, fetch its bank account info
          if (res.fundingSource) {
            res.fundingSource.active = true
            this.getFundingSource((fs) => updateViaRedux(fs))
          }
        }
      },
      {
        endpoint: 'paymentFlow/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) {
            updateViaRedux({ paymentFlow: { inc: [], out: [], all: [] } })
          } else {

            // Tack on 'flow'
            if (res.out) for (var k of Object.keys(res.out)) res.out[k].flow = "out"
            if (res.in) for (var k of Object.keys(res.in)) res.in[k].flow = "in"

            // Process payments
            let inc = (res.in) ? SetMaster5000.processPayments(res.in) : []
            let out = (res.out) ? SetMaster5000.processPayments(res.out) : []
            let allPreProcess = Object.assign({}, res.in || {}, res.out || {})
            let allPostProcess = SetMaster5000.processPayments(allPreProcess)

            let paymentFlow = {
              inc: inc,
              out: out,
              all: allPostProcess
            }

            updateViaRedux({paymentFlow})
          }
        }
      },
      {
        endpoint: 'appFlags/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          if (res.onboarding_state === "bank")
            this.getIAVToken({ token: this.token }, updateViaRedux)
          updateViaRedux({ appFlags: res })
        }
      },
      {
        endpoint: 'notifications/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          SetMaster5000.tackOnKeys(res, "timestamp")
          updateViaRedux({ notifications: res })
        }
      },
      {
        endpoint: 'blockedUsers/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          updateViaRedux({ blockedUsers: res })
        }
      },
      {
        endpoint: 'contactList/' + this.uid,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          let parsed = SetMaster5000.contactListToArray({ contacts: res })
          if (parsed === null) parsed = []
          updateViaRedux({ payperContacts: parsed })
        }
      }
    ]

    for (var e in this.endpoints) {
      Firebase.listenTo(this.endpoints[e])
    }
  }

  /**
    *   Disable listeners on this user's Firebase data
    *   -----------------------------------------------------------------------
  **/
  stopListening() {
    for (var e in this.endpoints) {
      Firebase.stopListeningTo(this.endpoints[e])
    }
    this.endpoints = null
  }


  /**
    *   Create a user with email and password
    *   params: email, password, phone, firstName, lastName
    *   -----------------------------------------------------------------------
  **/
  createUserWithEmailAndPassword(params, onSuccess, onFailure) {
    verifyPhone({
      phone: params.phone,
      token: this.token
    }, (res) => {
      let {errorMessage} = res

      // If phone number is not unique, alert user
      if (errorMessage) {
        onFailure(errorMessage)
        return
      }

      // Otherwise, continue with user creation
      else {
        firebase.auth().createUserWithEmailAndPassword(params.email, params.password).then(() => {
          firebase.auth().currentUser.getToken(true).then((token) => {
            params.token = token
            params.password = null
            var stringifiedParams = JSON.stringify(params)
            try {
              fetch(baseURL + "user/create", {method: "POST", body: stringifiedParams})
              .then((response) => response.json())
              .then((responseData) => {
                if (!responseData.errorMessage) {
                  responseData.user.token = token
                  this.decryptedPhone = params.phone
                  this.decryptedEmail = params.email

                  var uid = responseData.user.uid || "unknownUID"
                  var userData = responseData.user

                  // Get appFlags before notifying caller of success
                  firebase.database().ref('/appFlags').child(uid).once('value', (snapshot) => {
                    let appFlags = snapshot.val() || {}
                    userData.appFlags = appFlags
                    this.initialize(userData)
                    onSuccess(uid)
                  })
                } else {
                  onFailure("lambda")
                }
              })
              .done()
            } catch (err) {
              console.log("createUserWithEmailAndPassword failed...", "Fetch error:", err)
              onFailure()
            }
          }).catch((err) => {
            console.log("firebase.auth().currentUser.getToken(true) failed...", "Firebase error:", err)
            onFailure(err.code)
          })
        })
        .catch((err) => {
          console.log("firebase.auth().createUserWithEmailAndPassword failed...", "Firebase error:", err)
          onFailure(err.code)
        })
      }
    })

    function verifyPhone(params, cb) {
      try {
        fetch(baseURL + "user/verifyPhone", {method: "POST", body: JSON.stringify(params)})
        .then((response) => response.json())
        .then((responseData) => cb(responseData))
        .done()
      } catch (err) {
        console.log("Error verifying phone number uniquity", err)
        cb({errorMessage: err})
      }
    }
  }
}
