import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight, Animated, Image} from 'react-native'
import {colors} from '../../globalStyles'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

class NewUserOnboarding extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      name: {
        opacity: new Animated.Value(1)
      },
      email: {
        opacity: new Animated.Value(0)
      },
      password: {
        opacity: new Animated.Value(0)
      },
      phone: {
        opacity: new Animated.Value(0)
      },
      summary: {
        opacity: new Animated.Value(0)
      }
    }

    this.pages = ["name", "email", "password", "phone", "summary"]

    this.state = {
      index: 0,
      pressable: true
    }
  }

  paginate(nextOrPrev) {
    let {index, pressable} = this.state
    let shouldPreventPagination = (nextOrPrev === "next" && index === this.pages.length - 1) || (nextOrPrev === "prev" && index === 0)
    if (!pressable || shouldPreventPagination) return

    this.setState({pressable: false})

    let currPage = this.pages[index]
    let nextPage = this.pages[(nextOrPrev === "next") ? index + 1 : index - 1]
    let fadeOut = this.AV[currPage].opacity
    let fadeIn = this.AV[nextPage].opacity
    let animations = [
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 200
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 200
      })
    ]

    Animated.timing(fadeOut, {
      toValue: 0,
      duration: 150
    }).start(() => {
      this.setState({index: (nextOrPrev === "next") ? index + 1 : index - 1}, () => {
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 150
        }).start(() => this.setState({pressable: true}))
      })
    })
  }

  render() {
    return(
      <View style={{flex: 1.0, backgroundColor: colors.snowWhite}}>
        { /* Header */ }
        <View style={{overflow: 'hidden'}}>
          <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
          <View style={{padding: 5, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
            { /* Pagination dots */
              this.pages.map((page, i) =>
                <Text key={i} style={{marginLeft: -5, marginRight: -5, opacity: (i === this.state.index) ? 1 : 0.75}}>
                  <Entypo
                    name={"dot-single"}
                    color={colors.snowWhite}
                    size={28} />
                </Text>
              )
            }

            { /* Close icon */ }
            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              style={{position: 'absolute', top: 0, left: 0, bottom: 0, padding: 14, paddingTop: 30, justifyContent: 'center'}}
              onPress={() => Actions.pop()}>
              <EvilIcons name={"close"} color={colors.snowWhite} size={24} />
            </TouchableHighlight>
          </View>
        </View>

        { /* Content wrap*/ }
        <View style={{flex: 1.0, borderWidth: 1, borderColor: 'red'}}>
          { /* Name */
            (this.pages[this.state.index] !== "name")
              ? null
              : <Animated.View style={{opacity: this.AV.name.opacity, position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, flex: 1.0, backgroundColor: 'blue'}}>
                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    onPress={() => this.paginate("next")}>
                    <EvilIcons name={"chevron-right"} color={colors.snowWhite} size={30} />
                  </TouchableHighlight>
                </Animated.View> }

          { /* Email */
            (this.pages[this.state.index] !== "email")
              ? null
              : <Animated.View style={{opacity: this.AV.email.opacity, position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, flex: 1.0, backgroundColor: 'green'}}>
                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    onPress={() => this.paginate("next")}>
                    <EvilIcons name={"chevron-right"} color={colors.snowWhite} size={30} />
                  </TouchableHighlight>
                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    onPress={() => this.paginate("prev")}>
                    <EvilIcons name={"chevron-left"} color={colors.snowWhite} size={30} />
                  </TouchableHighlight>
                </Animated.View> }

          { /* Password */
            (this.pages[this.state.index] !== "password")
              ? null
              : <Animated.View style={{opacity: this.AV.password.opacity, position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, flex: 1.0, backgroundColor: 'black'}}>
                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    onPress={() => this.paginate("next")}>
                    <EvilIcons name={"chevron-right"} color={colors.snowWhite} size={30} />
                  </TouchableHighlight>
                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    onPress={() => this.paginate("prev")}>
                    <EvilIcons name={"chevron-left"} color={colors.snowWhite} size={30} />
                  </TouchableHighlight>
                </Animated.View> }

          { /* Phone */
            (this.pages[this.state.index] !== "phone")
              ? null
              : <Animated.View style={{opacity: this.AV.phone.opacity, position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, flex: 1.0, backgroundColor: 'red'}}>
                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    onPress={() => this.paginate("next")}>
                    <EvilIcons name={"chevron-right"} color={colors.snowWhite} size={30} />
                  </TouchableHighlight>
                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    onPress={() => this.paginate("prev")}>
                    <EvilIcons name={"chevron-left"} color={colors.snowWhite} size={30} />
                  </TouchableHighlight>
                </Animated.View> }

          { /* Summary */
            (this.pages[this.state.index] !== "summary")
              ? null
              : <Animated.View style={{opacity: this.AV.summary.opacity, position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, flex: 1.0, backgroundColor: 'orange'}}>
                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    onPress={() => this.paginate("next")}>
                    <EvilIcons name={"chevron-right"} color={colors.snowWhite} size={30} />
                  </TouchableHighlight>
                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    onPress={() => this.paginate("prev")}>
                    <EvilIcons name={"chevron-left"} color={colors.snowWhite} size={30} />
                  </TouchableHighlight>
                </Animated.View> }
        </View>
      </View>
    )
  }
}

module.exports = NewUserOnboarding
