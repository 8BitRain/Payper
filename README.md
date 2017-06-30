### <img src="./assets/images/app-icon.jpg" width="90" height="90" />

## **Install**
```
$  git clone https://github.com/8BitRain/Payper.git
$  cd ~/path/to/repo
$  npm install
$  git push -u origin master
```

## **Run**
1. Open `/Payper/iOS/Coincast.xcworkspace` with Xcode.
2. Run `npm start` in the Payper root directory
3. In Xcode, navigate to `Product > Scheme > Edit Scheme` and ensure that the correct `Build Configuration` is selected under the Run/Info tab. The debug configuration will enable logs, the production configuration will not.
4. In Xcode, run the app (`⌘ + R`). If you run into issues, try cleaning the app then running it (`⌘ + shift + K`).
* If a non-existent node module error is thrown, run `npm install --save node-module-name`.

## **Contribute**
1. Create your branch: `git checkout -b branch-name`
2. Commit your changes: `git commit -am 'Change something`
3. Push to the branch: `git push origin branch-name`
4. Checkout master: `git checkout master`
5. Merge with branch: `git merge branch-name`
6. Resolve conflicts (if any)
7. Commit your changes `git commit -am 'Merge with branch-name'`
8. Push to master `git push origin master`

## **Data handling: Redux and Firebase**
Why do we use Redux? Long story short, Redux makes re-renders simple.
1. [Main](./scenes/Main/Main.js) invokes `startListeningToFirebase` function in [User](./classes/User.js) object.
2. Firebase listener in [User](./classes/User.js) detects a change in data.
3. Firebase data is reformatted by a [data handler](./helpers/dataHandlers) if need be.
4. Data is passed via callback to [Main](./scenes/Main/Main.js) which is [connected](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) to Redux.
5. `updateCurrentUser` Redux function is invoked from [Main](./scenes/Main/Main.js) component, triggering a re-render of any React components depending on user data.

## **Environment Variables**
In the root of the Payper repository you'll find a [config file](./config.json). We use this file to differentiate between development and production API keys and endpoints, like so:
```javascript
import config from 'path/to/config'
let env = config.env
let codePushKey = config[env].codePushKey
let lambdaBaseURL = config[env].lambdaBaseURL
let firebaseCredentials = config[env].firebaseCredentials
```
Firebase auth/database listeners, API calls, and CodePush synchronizations all depend on this config file.

## **App Updates: Standard Procedure**
There are two ways we can update the production version of Payper.

### Submit a new version to Apple for review
First, deploy the app to TestFlight through Xcode.

1. Select `Generic iOS Device` as your build's target device
#### <img src="./assets/images/readme/buildTarget.png" height="140" />
2. Ensure that the version number and build number are correct; version number should be 0.0.1 higher than the last App Store release, build number should be 1 higher than the last TestFlight build (check [iTunes Connect](https://itunesconnect.apple.com/) for version history)
3. Run `Product > Clean` (`⌘ + shift + K`)
4. Run `Product > Archive`
5. When the Organizer window pops up your new archive will be selected
  * Click `Upload to App Store`
  * Select `Payper Inc.` as your Development Team and click `Choose`
  * Click `Upload`
6. Go to [iTunes Connect](https://itunesconnect.apple.com/) and navigate to the `Activity` tab; your build will say `(Processing)` next to it, wait for processing to complete (must refresh browser to see updates) and, when it does, navigate to `TestFlight` tab
7. There will be a yellow triangle next to your new TestFlight build with the message `Missing Compliance`; click this, click `Provide Export Compliance Information,` select no, then click `Start Internal Testing`
8. Download the new version from the TestFlight app and make sure everything is working as expected; if there are bugs, fix them and follow steps 1-8 again

Next, submit the TestFlight version for review with Apple.
1. In iTunes Connect, navigate to the `App Store` tab
2. In the side menu, click `+ VERSION OR PLATFORM`
3. Enter the version number of our new TestFlight build in the pop up input window
4. Our build will appear under the `iOS APP` header in the side menu; select it, scroll down to the build menu and click `Select a build before you submit your app.`
5. Select the correct build number and click done
6. Click `Save` in the top right
7. Click `Submit for Review` right next to the `Save` button

In a couple days time Apple will either accept or reject this app version; if they reject it, fix the bug(s) and follow these steps again; if they accept it, click the `Release to App Store` button

### Deploy a CodePush update
CodePush allows us to update the app on users' devices without going through Apple. Every time the app launches it checks CodePush's servers for any updates; if an update is available, it installs it and relaunches the app immediately.

To release a CodePush update, run this from the Payper root directory:
```
$  code-push release-react PayperV2 ios -d Production
```

This method should be used for urgent updates, such as bug fixes, or for important and time-sensitive feature additions. Full react-native-code-push documentation can be found [here](https://github.com/Microsoft/react-native-code-push).

### Adding Services to Explore Tab
To add a service to the Explore tab you can simply modify the `Services` tree in Firebase, following the schema set up other services.

However, in order to update the logo that appears next to the service's [`WantOwnRow`](./components/Interests/WantOwnRow.js) you must add the logo to the repo and submit a new App Store update with Apple.

#### Adding a logo
1. Find or create a square logo for the service
2. Compress the image file
3. Ensure the the file name matches the name of the service's tag **exactly**, and that the image type is .png
4. Add the image to [`assets/images/logos`](./assets/images/logos)
5. Add the case for this service to the switch statement in [`helpers/utils/getLogo.js`](./helpers/utils/getLogo.js)

If you don't add a logo, the app will load a backup icon generalized to match the service's category. For example, here's what the YouTube TV row looks like before and after adding a logo:

### <img src="./assets/images/wantOwnRowWithoutLogo.png" width="90" height="90" />
### <img src="./assets/images/wantOwnRowWithLogo.png" width="90" height="90" />



























#
