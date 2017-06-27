# ![](./godmode.png) **Payper**
### Recurring payments made easy.

## [To Do (Pending)](TODO-Pending.md) [To Do (Complete)](TODO-Complete.md)

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
| Front end            | Back end  | Multi-purpose Gurus|
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

## Getting Started
Payper's frontend functions using three main technologies: React Native, Redux,
and Firebase.
* React Native
RN's documentation can be found [here](https://facebook.github.io/react-native/docs/getting-started.html).

## Data handling: Redux and Firebase
Why do we use Redux? Long story short, Redux makes re-renders simple.
1. [Main](./scenes/Main/Main.js) invokes `startListeningToFirebase` function in [User](./classes/User.js) object.
2. Firebase listener in [User](./classes/User.js) detects a change in data.
3. Firebase data is reformatted by a [data handler](./helpers/dataHandlers) if need be.
4. Data is passed back via callback to [Main](./scenes/Main/Main.js) which is connected to Redux.
5. `updateCurrentUser` Redux function is invoked from [Main](./scenes/Main/Main.js) component, triggering a re-render of any React components depending on user data.

## Environment Variables
In the root of the Payper repository you'll find a [config file](./config.js). We use this file to differentiate between development and production API keys and endpoints, like so:
```javascript
import config from 'path/to/config'
let env = config.env
let codePushKey = config[env].codePushKey
let lambdaBaseURL = config[env].lambdaBaseURL
let firebaseCredentials = config[env].firebaseCredentials
```
Firebase auth/database listeners, API calls, and CodePush synchronizations all depend on this config file.














#
