<img src="./assets/images/app-icon.jpg" width="100" height="100" />
**Payper**
## Get paid for sharing your subscriptions.

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

## **Contributing**
1. Create your branch: `git checkout -b yung-branch`
2. Commit your changes: `git commit -am 'Change a lil somethin'`
3. Push to the branch: `git push origin yung-branch`
4. Checkout master: `git checkout master`
5. Merge with branch: `git merge yung-branch`
6. Resolve conflicts (if any)
7. Commit your changes `git commit -am 'Merge with yung-branch'`
8. Push to master `git push origin master`

## Data handling: Redux and Firebase
Why do we use Redux? Long story short, Redux makes re-renders simple.
1. [Main](./scenes/Main/Main.js) invokes `startListeningToFirebase` function in [User](./classes/User.js) object.
2. Firebase listener in [User](./classes/User.js) detects a change in data.
3. Firebase data is reformatted by a [data handler](./helpers/dataHandlers) if need be.
4. Data is passed via callback to [Main](./scenes/Main/Main.js) which is [connected](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) to Redux.
5. `updateCurrentUser` Redux function is invoked from [Main](./scenes/Main/Main.js) component, triggering a re-render of any React components depending on user data.

## Environment Variables
In the root of the Payper repository you'll find a [config file](./config.json). We use this file to differentiate between development and production API keys and endpoints, like so:
```javascript
import config from 'path/to/config'
let env = config.env
let codePushKey = config[env].codePushKey
let lambdaBaseURL = config[env].lambdaBaseURL
let firebaseCredentials = config[env].firebaseCredentials
```
Firebase auth/database listeners, API calls, and CodePush synchronizations all depend on this config file.





























#
