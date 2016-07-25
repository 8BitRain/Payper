# ![](./godmode.png) **Payper**
### Recurring payments made easy.

## Todo

### Frontend
- [x] Sidebar
- [ ] In-app notifications
- [ ] Push notifications
- [ ] Edit profile panel
- [ ] Facebook auth
- [ ] Facebook friend synchronization
- [ ] Contact synchronization
- [ ] Invites

### Polish
- [X] CreatePaymentView.js predictive search: limit predictions to 4
- [X] CreatePaymentView.js predictive search: don't show signed in user in predictions
- [ ] Pass numNotifications to menu in sidebar and render preview indicator next to notifications lightbulb
- [ ] Apply fade animation to inner content during animation project, not entire view
- [ ] App-wide padding (look into pixel density for screen size detection)

### Bugs
- [ ] Header only displays notifications on Notifications page (probably an
  issue with how numNotifications is passed to <Content />)

## Installation
```
$  git clone https://github.com/8BitRain/GetCoincast.git
$  cd ~/path/to/repo
$  git fetch
$  git branch --track desired-branch-name origin/desired-branch-name
$  git checkout desired-branch-name
$  npm install
$  react-native run-ios
```

## Contributing
1. Fork it
2. Create your branch: `git checkout -b yung-branch`
3. Commit your changes: `git commit -am 'Changed a lil somethin'`
4. Push to the branch: `git push origin yung-branch`
5. Submit a pull request or leave it & merge later

## Troubleshooting
* If a non-existent node module error is thrown, run `npm install --save node-module-name`.

## The Team
| Front end (💣)       | Back end  | Multi-purpose Gurus|
|:--------------------:|:---------:|:------------------:|
| Eric & Brady         | Vash      | Mo & Luke          |

## Note:
Normally, after a code change to react-native-router-flux src files,
you must remove the node_modules/react-native-router-flux directory
and npm install.  The react-native packager wont follow symlinks.

To assist development, this command watches and rsyncs changes:

```
npm run sync-rnrf
```

Leave a terminal open running this command when running the Example
app and making react-native-router-flux src changes.
