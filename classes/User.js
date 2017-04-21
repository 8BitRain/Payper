import firebase from 'firebase'
import {FBLoginManager} from 'NativeModules'
import {AppState, GeoLocation} from 'react-native'
import {Timer} from './'
import {Firebase} from '../helpers'
import {getMatchedUsers} from '../helpers/utils'
import {handleUserData, handleUserBroadcasts, handleUserSubscribedBroadcasts, handleUserFeed, handleServices, handleWantsAndOwns, handleDisputes} from '../helpers/dataHandlers'
import {getFromAsyncStorage, setInAsyncStorage} from '../helpers/asyncStorage'
import {deleteUser, getBankAccount, getDecryptedUserData, updateGeoLocation} from '../helpers/lambda'

export default class User {
  constructor() {
    this.balances = {total: 0, available: 0, pending: 0}

    this.broadcastsFeed = {}
    this.meFeed = {}
    this.services = []
    this.servicesMap = {}
    this.rateableUsers = {}
    this.matchedUsers = {}
    this.wants = {}
    this.owns = {}

    this.handleAppStateChange = this.handleAppStateChange.bind(this)
  }

  update(updates) {
    console.log("User updates:", updates)
    for (var k in updates) this[k] = updates[k]
    let shouldCache = updates.uid || updates.appFlags || updates.broadcastsFeed || updates.meFeed || updates.wants || updates.owns || updates.services
    if (shouldCache) setInAsyncStorage('user', JSON.stringify(this))
  }

  initialize(userData) {
    // Determine user's initials
    if (userData.firstName && userData.lastName)
      userData.initials = userData.firstName.charAt(0).concat(userData.lastName.charAt(0))

    // Initialize JSON attributes
    this.update(userData)

    // Get decrypted email and phone
    getDecryptedUserData({token: userData.token}, (res) => {
      this.update({decryptedEmail: res.email, decryptedPhone: res.phone})
    })

    // Initalize timer and app state change listener to be used for session
    // duration measurement
    this.timer = new Timer()
    this.timer.start()
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  initializeTags(updateViaRedux) {
    // Fetch services from Firebase
    Firebase.get('Services', (res) => handleServices(res, (services, servicesMap) => {
      // Get usersPublicInfo from Firebase
      Firebase.get(`usersPublicInfo/${this.uid}`, (response) => {
        if (!response) return

        handleWantsAndOwns({
          wants: response.wantedTags,
          owns: response.ownedTags,
          servicesMap
        }, (wants, owns) => {
          updateViaRedux({wants, owns, services, servicesMap})
        })
      })
    }))
  }

  destroy() {
    setInAsyncStorage('user', '')
    this.stopListeningToFirebase()
    FBLoginManager.logOut()
    clearInterval(this.tokenRefreshInterval)
    for (var i in this)
      if (typeof this[i] !== 'function')
        this[i] = null
  }

  handleAppStateChange(state) {
    switch (state) {
      case "inactive": return
      case "background":
        this.timer.report("sessionDuration", this.uid)
        break
      case "active":
        this.timer = new Timer()
        this.timer.start()
        if (firebase.auth().currentUser !== null) this.refreshToken()
        break
    }
  }

  updateLocation() {
    navigator.geolocation.getCurrentPosition((pos) => {
      updateGeoLocation({
        coords: {lat: pos.coords.latitude, long: pos.coords.longitude},
        timestamp: Date.now(),
        token: this.token
      }, (res) => console.log("--> updateGeoLocation response:", res))
    })
  }

  refreshToken(updateViaRedux) {
    firebase.auth().currentUser.getToken(true)
    .then((token) => (updateViaRedux) ? updateViaRedux({token}) : this.update({token}))
    .catch((err) => console.log("Error getting new token:", err))
  }

  startListeningToFirebase(updateViaRedux) {
    this.endpoints = [
      {
        endpoint: `users/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return

          // Get bank account
          if (!this.bank || res.bankReference !== this.bankReference) {
            getBankAccount({token: this.token}, (res) => {
              if (!res || res.message || res.errorMessage) return
              updateViaRedux({bankAccount: res})
            })
          }

          updateViaRedux(res)
        }
      },
      {
        endpoint: `usersPublicInfo/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => (res) ? updateViaRedux(res) : null
      },
      {
        endpoint: `appFlags/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          updateViaRedux({appFlags: res})
        }
      },
      {
        endpoint: `userFeed/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => handleUserFeed(res, (broadcastsFeed) => {
          updateViaRedux({broadcastsFeed})
        })
      },
      {
        endpoint: `userBroadcasts/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => handleUserBroadcasts(res, (myBroadcasts) => {
          if (!this.meFeed) this.meFeed = {}
          this.meFeed["My Broadcasts"] = myBroadcasts
          updateViaRedux({meFeed: this.meFeed})
        })
      },
      {
        endpoint: `subscribedBroadcasts/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => handleUserSubscribedBroadcasts(res, (mySubscriptions) => {
          if (!this.meFeed) this.meFeed = {}
          this.meFeed["My Subscriptions"] = mySubscriptions
          updateViaRedux({meFeed: this.meFeed})
        })
      },
      {
        endpoint: `${(this.bankReference) ? 'userWallets' : 'payperWallets'}/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          updateViaRedux({
            walletRef: res.walletRef,
            balances: {
              total: 0 + ((res.withdrawableFunds) ? parseInt(res.withdrawableFunds) : 0) + ((res.pendingFunds) ? parseInt(res.pendingFunds) : 0),
              available: res.withdrawableFunds || null,
              pending: res.pendingFunds || null
            }
          })
        }
      },
      {
        endpoint: `userRatingRights/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          updateViaRedux({rateableUsers: res})
        }
      },
      {
        endpoint: `tagMatches/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          getMatchedUsers({
            tagMatches: res,
            matchedUsers: this.matchedUsers || {}
          }, (matchedUsers) => {
            updateViaRedux({matchedUsers, tagMatches: res})
          })
        }
      },
      {
        endpoint: `disputes/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => handleDisputes(res, (disputesFeed) => updateViaRedux({disputesFeed}))
      }
    ]

    for (var i in this.endpoints)
      Firebase.listenTo(this.endpoints[i])
  }

  stopListeningToFirebase() {
    for (var e in this.endpoints)
      Firebase.stopListeningTo(this.endpoints[e])
    this.endpoints = null
  }
}
