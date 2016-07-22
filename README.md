# ![](./godmode.png) **Payper**
Recurring payments made easy.

## Todo

#### Frontend
- [x] Sidebar
- [ ] In-app notifications
- [ ] Push notifications
- [ ] Edit profile panel
- [ ] Facebook auth
- [ ] Facebook friend synchronization
- [ ] Contact synchronization
- [ ] Invites

## Installation
```
git clone https://github.com/8BitRain/GetCoincast.git
cd ~/path/to/repo
git fetch
git branch --track desired-branch-name origin/desired-branch-name
git checkout desired-branch-name
npm install
react-native run-ios
```

## Installation Troubleshooting
* If a non-existent node module error is thrown, run `npm install --save node-module-name`.

## Contributing
1. Fork it!
2. Create your branch: `git checkout -b yung-branch`
3. Commit your changes: `git commit -am 'Changed a lil somethin'`
4. Push to the branch: `git push origin yung-branch`
5. Submit a pull request or leave it & merge later

## The Team
| Front end (💣)       | Back end | Multi-purpose Gurus |
|----------------------|:---------:|:-----------------:|
| Eric & Brady         | Vash      | Mo & Luke         |

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
