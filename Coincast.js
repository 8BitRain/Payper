import React from 'react'
import firebase from 'firebase'
import Mixpanel from 'react-native-mixpanel'
import Error from './components/Error'
import DeviceInfo from 'react-native-device-info'
import * as Async from './helpers/Async'
import SplashViewContainer from './modules/Splash/SplashViewContainer'
import BetaLandingScreenView from './modules/BetaLandingScreen/BetaLandingScreenView'
import LandingScreenViewContainer from './modules/LandingScreen/LandingScreenViewContainer'
import MainViewContainer from './modules/Main/MainViewContainer'
import UserOnboardingViewContainer from './modules/UserOnboarding/UserOnboardingViewContainer'
import BankOnboardingView from './modules/BankOnboarding/BankOnboardingView'
import Phone from './modules/UserOnboarding/pages/Phone'
import AddBankAccountTooltip from './components/Tooltips/AddBankAccountTooltip/AddBankAccountTooltip'
import MicrodepositTooltip from './components/Tooltips/MicrodepositTooltip/MicrodepositTooltip'
import SuspendedTooltip from './components/Tooltips/SuspendedTooltip/SuspendedTooltip'
import DocumentUploadTooltip from './components/Tooltips/DocumentUploadTooltip/DocumentUploadTooltip'
import BankAccountAdded from './components/Rewards/BankAccountAdded/BankAccountAdded'
import VerifiedIdentity from './components/Rewards/VerifiedIdentity/VerifiedIdentity'
import StatusCard from './components/StatusCard/StatusCard'
import { Scene, Reducer, Router, Modal } from 'react-native-router-flux'
import { colors } from './globalStyles'
import { Analytics, Hits as GAHits } from 'react-native-google-analytics'
import { Client } from 'bugsnag-react-native'
import { PayDetails } from './components/PayCard'
import { MainView, OnboardingView, PaymentOnboardingView, FirstPaymentView, PartialUserOnboardingView } from './modules'
import { GlobalModal } from './components'

// Get build and version numbers
let build = DeviceInfo.getBuildNumber()
let version = DeviceInfo.getVersion()

// Uncomment to reset user cache
// Async.set('user', '')
// Async.set('BankOnboardingStateCache', '')
// Async.set('betaStatus', '')

const reducerCreate = (params) => {
  const defaultReducer = Reducer(params)
  return (state, action) => {
    // console.log("ACTION:", action)
    return defaultReducer(state, action)
  }
}

var ga = this.ga = null

const getSceneStyle = function(props, computedProps) {
  const style = {
    flex: 1,
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
    backgroundColor: colors.snowWhite
  }

  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64
    style.marginBottom = computedProps.hideTabBar ? 0 : 50
  }

  return style
}

export default class Coincast extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.client = new Client('f8be20d13dd76c17ff352c44d395270a')
    let clientId = DeviceInfo.getUniqueID()

    Mixpanel.sharedInstanceWithToken('507a107870150092ca92fa76ca7c66d6')
    Mixpanel.timeEvent('Session Duration')

    ga = new Analytics('UA-87368863-1', clientId, 1, DeviceInfo.getUserAgent())
    var screenView = new GAHits.ScreenView(
      'Example App',
      'Welcome Screen',
      DeviceInfo.getReadableVersion(),
      DeviceInfo.getBundleId()
    )

    ga.send(screenView)
  }

  render() {
    return (
      <Router key={Math.random()} createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
        <Scene key="modal" component={Modal}>
          <Scene key="root" hideNavBar hideTabBar>

            <Scene
              component={SplashViewContainer}
              key="SplashViewContainer"
              type="replace"
              panHandlers={null} />

            <Scene
              component={BetaLandingScreenView}
              key="BetaLandingScreenView"
              type="replace"
              panHandlers={null} />

            <Scene
              component={LandingScreenViewContainer}
              key="LandingScreenViewContainer"
              type="replace"
              panHandlers={null} />

            <Scene
              component={UserOnboardingViewContainer}
              key="UserOnboardingViewContainer"
              panHandlers={null} />

            <Scene
              component={FirstPaymentView}
              key="FirstPaymentView"
              panHandlers={null} />

            <Scene
              component={PartialUserOnboardingView}
              key="PartialUserOnboardingView"
              direction="vertical"
              panHandlers={null} />

            <Scene
              component={MainViewContainer}
              key="MainViewContainer"
              panHandlers={null} />

            <Scene
              component={PayDetails}
              key="PaymentDetails"
              panHandlers={null} />
          </Scene>

          <Scene
            key="GlobalModal"
            component={GlobalModal} />

          <Scene
            key="error"
            component={Error} />
        </Scene>
      </Router>
    )
  }
}
