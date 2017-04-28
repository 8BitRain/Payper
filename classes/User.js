import firebase from 'firebase'
import {FBLoginManager} from 'NativeModules'
import {AppState, GeoLocation} from 'react-native'
import {Timer} from './'
import {Firebase} from '../helpers'
import {getMatchedUsers} from '../helpers/utils'
import {handleUserData, handleUserBroadcasts, handleUserSubscribedBroadcasts, handleUserFeed, handleServices, handleWantsAndOwns, handleDisputes} from '../helpers/dataHandlers'
import {getFromAsyncStorage, setInAsyncStorage} from '../helpers/asyncStorage'
import {deleteUser, getBankAccount, updateGeoLocation} from '../helpers/lambda'

export default class User {
  constructor() {
    this.balances = {total: "0.00", available: null, pending: null}

    this.broadcastListeners = {}
    this.broadcastData = {}
    this.broadcastFeed = {}
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
    let shouldCache = updates.uid || updates.appFlags || updates.broadcastFeed || updates.meFeed || updates.wants || updates.owns || updates.services
    if (shouldCache) setInAsyncStorage('user', JSON.stringify(this))
  }

  initialize(userData) {
    // Determine user's initials
    if (userData.firstName && userData.lastName)
      userData.initials = userData.firstName.charAt(0).concat(userData.lastName.charAt(0))

    // Initialize JSON attributes
    this.update(userData)

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

  addBroadcastListener(castID) {
    if (!this.broadcastListeners[castID]) {
      this.broadcastListeners[castID] = Firebase.listenTo({
        endpoint: `broadcasts/${castID}`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          this.broadcastData[castID] = res
          updateViaRedux({broadcastData: this.broadcastData})
        }
      })
    }
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
          if (res.bankReference) {
            getBankAccount({token: this.token}, (res) => {
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
        callback: (res) => {
          if (!res) return

          // Update broadcastFeed with array of castIDs
          let castIDBuffer = Object.keys(res)
          for (var i = 0; i < castIDBuffer.length; i++) {
            let castID = castIDBuffer[i]

            // Push castID to corresponding section in broadcastFeed
            if (broadcastData.type === "world") {
              if (!this.broadcastFeed["Global"]) this.broadcastFeed["Global"] = []
              this.broadcastFeed["Global"].push(castID)
            } else if (broadcastData.type === "local") {
              if (!this.broadcastFeed["Local"]) this.broadcastFeed["Local"] = []
              this.broadcastFeed["Local"].push(castID)
            } else if (broadcastData.type === "friendnetwork") {
              if (!this.broadcastFeed["Friends of Friends"]) this.broadcastFeed["Friends of Friends"] = []
              this.broadcastFeed["Friends of Friends"].push(castID)
            } else if (broadcastData.type === "friends") {
              if (!this.broadcastFeed["Friends"]) this.broadcastFeed["Friends"] = []
              this.broadcastFeed["Friends"].push(castID)
            }

            // Set up listener
            this.addBroadcastListener(castID)
          }

          updateViaRedux({broadcastFeed: this.broadcastFeed})
        }
      },
      {
        endpoint: `userBroadcasts/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return

          // Update meFeed["My Broadcasts"] with array of castIDs
          this.meFeed["My Broadcasts"] = Object.keys(res)
          updateViaRedux({meFeed: this.meFeed})

          // Set up listeners for each cast in meFeed["My Broadcasts"]
          let castIDBuffer = Object.keys(res)
          for (var i = 0; i < castIDBuffer.length; i++) {
            let castID = castIDBuffer[i]
            this.addBroadcastListener(castID)
          }
        }
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
        endpoint: `userWallets/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res || !this.balanceReference) return

          updateViaRedux({
            walletRef: res.walletRef,
            balances: {
              total: 0 + ((res.withdrawableFunds) ? parseFloat(res.withdrawableFunds) : 0) + ((res.pendingFunds) ? parseFloat(res.pendingFunds) : 0),
              available: res.withdrawableFunds || null,
              pending: res.pendingFunds || null
            }
          })
        }
      },
      {
        endpoint: `payperWallets/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res || this.balanceReference) return

          Firebase.get(`users/${this.uid}`, (userData) => {
            if (userData && userData.bankReference) return
            updateViaRedux({
              walletRef: res.walletRef,
              balances: {total: res.amount || "0.00", available: null, pending: null}
            })
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
