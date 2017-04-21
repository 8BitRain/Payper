import React from 'React'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions, Animated} from 'react-native'
import {colors} from '../../globalStyles'
import {MatchedUser} from './'
import Ionicons from 'react-native-vector-icons/Ionicons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 8
  },
  title: {
    fontSize: 16,
    color: colors.deepBlue,
    marginLeft: 12
  },
  title: {
    fontSize: 14,
    color: colors.deepBlue,
    marginLeft: 12
  },
  buttonWrap: {
    padding: 7,
    margin: 2,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 5
  },
  buttonBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.gradientGreen,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 14,
    color: colors.gradientGreen
  },
  matchesWrap: {
    justifyContent: 'center'
  }
})

class MatchedWantOwnRow extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      wants: {
        opacity: new Animated.Value(props.wants ? 1 : 0)
      },
      owns: {
        opacity: new Animated.Value(props.owns ? 1 : 0)
      },
      matchesWrap: {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0)
      }
    }

    this.state = {
      wants: props.wants || false,
      owns: props.owns || false,
      animating: false
    }

    this.toggleMatches = this.toggleMatches.bind(this)
  }

  getIcon() {
    let icon

    switch (this.props.data.category) {
      case "Books": icon = <Ionicons name={"ios-book-outline"} size={26} />; break;
      case "Education": icon = <Ionicons name={"ios-school-outline"} size={26} />; break;
      case "Exercise": icon = <Ionicons name={"md-heart"} size={26} />; break;
      case "Food Delivery": icon = <Ionicons name={"md-restaurant"} size={26} />; break;
      case "Gaming": icon = <Ionicons name={"ios-game-controller-b-outline"} size={26} />; break;
      case "Live TV": icon = <Ionicons name={"md-desktop"} size={26} />; break;
      case "Music Streaming": icon = <Ionicons name={"ios-musical-notes"} size={26} />; break;
      case "News": icon = <Ionicons name={"logo-rss"} size={26} />; break;
      case "Sports": icon = <Ionicons name={"md-american-football"} size={26} />; break;
      case "Video Streaming": icon = <Ionicons name={"logo-youtube"} size={26} />; break;
    }

    return(
      <View style={{width: 43, height: 43, borderRadius: 21.5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.medGrey}}>
        {icon}
      </View>
    )
  }

  toggle(wantsOrOwns) {
    // Invoke callback
    if (wantsOrOwns === "wants") this.props.onWant(this.props.data)
    else this.props.onOwn(this.props.data)

    // Toggle button's background color
    this.animateButton({
      wantsOrOwns,
      toValue: (this.state[wantsOrOwns] ? 0 : 1)
    }, () => {
      this.state[wantsOrOwns] = !this.state[wantsOrOwns]
      this.setState(this.state)
    })
  }

  animateButton(params, cb) {
    let {wantsOrOwns, toValue} = params

    // Prevent double taps
    this.setState({animating: true})

    Animated.timing(this.AV[wantsOrOwns].opacity, {
      toValue,
      duration: 220
    }).start(() => {
      this.setState({animating: false})
      cb()
    })
  }

  toggleMatches() {
    if (this.AV.matchesWrap.height._value === 0) this.showMatches()
    else this.hideMatches()
  }

  showMatches() {
    let animations = [
      Animated.timing(this.AV.matchesWrap.height, {
        toValue: (this.props.numMatches * 60),
        duration: 140
      }),
      Animated.timing(this.AV.matchesWrap.opacity, {
        toValue: 1,
        duration: 240
      })
    ]

    Animated.parallel(animations).start()
  }

  hideMatches() {
    let animations = [
      Animated.timing(this.AV.matchesWrap.height, {
        toValue: 0,
        duration: 140
      }),
      Animated.timing(this.AV.matchesWrap.opacity, {
        toValue: 0,
        duration: 120
      })
    ]

    Animated.parallel(animations).start()
  }

  renderMatchedUsers(users) {
    let arr = []

    for (var k in users) arr.push(
      <MatchedUser
        key={k}
        user={users[k]}
        matchType={users[k].matchType}
        castTitle={this.props.data.title}
        tag={this.props.data.tag}
        currentUser={this.props.currentUser} />
    )

    return arr
  }

  render() {
    return(
      <View style={{width: dims.width * 0.94, borderBottomWidth: (this.props.hideBottomBorder) ? 0 : 1, borderColor: colors.medGrey}}>
        <TouchableHighlight activeOpacity={0.75} underlayColor={'transparent'} onPress={this.toggleMatches}>
          <View style={[styles.container, this.props.containerStyles || {}]}>

            { /* Icon */ }
            <View style={{flex: 0.14, justifyContent: 'center', alignItems: 'center'}}>
              {this.getIcon()}
            </View>

            { /* Title */ }
            <View style={{flex: 0.56, justifyContent: 'center'}}>
              <Text style={styles.title}>{this.props.data.title}</Text>
              <Text style={styles.title}>{`${this.props.numMatches} match${(this.props.numMatches > 1) ? 'es' : ''}`}</Text>
            </View>

            { /* Want and own buttons */ }
            <View style={{flex: 0.3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableHighlight
                activeOpacity={0.75}
                underlayColor={'transparent'}
                onPress={() => {
                  if (this.state.animating) return
                  if (this.state.owns) this.toggle("owns")
                  this.toggle("wants")
                }}>
                <View style={styles.buttonWrap}>
                  <Text style={[styles.buttonText, {color: colors.gradientGreen}]}>{"Want"}</Text>
                  <Animated.View style={[this.AV.wants, styles.buttonBackground]}>
                    <Text style={[styles.buttonText, {color: colors.snowWhite}]}>{"Want"}</Text>
                  </Animated.View>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                activeOpacity={0.75}
                underlayColor={'transparent'}
                onPress={() => {
                  if (this.state.animating) return
                  if (this.state.wants) this.toggle("wants")
                  this.toggle("owns")
                }}>
                <View style={styles.buttonWrap}>
                  <Text style={[styles.buttonText, {color: colors.gradientGreen}]}>{"Own"}</Text>
                  <Animated.View style={[this.AV.owns, styles.buttonBackground]}>
                    <Text style={[styles.buttonText, {color: colors.snowWhite}]}>{"Own"}</Text>
                  </Animated.View>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableHighlight>

        { /* Matches */
          (this.props.matchedUsers)
          ? <Animated.View style={[styles.matchesWrap, this.AV.matchesWrap]}>
              {this.renderMatchedUsers(this.props.matchedUsers)}
            </Animated.View>
          : null}
      </View>
    )
  }
}

module.exports = MatchedWantOwnRow
