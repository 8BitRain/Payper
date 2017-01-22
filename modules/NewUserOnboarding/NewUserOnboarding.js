import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight, Animated, Image, TextInput, Dimensions, StyleSheet, StatusBar, Alert} from 'react-native'
import {colors} from '../../globalStyles'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    alignItems: 'center',
    paddingTop: 22
  },
  prompt: {
    width: dims.width * 0.85,
    fontSize: 20,
    color: colors.deepBlue,
    textAlign: 'center'
  },
  textInput: {
    width: dims.width * 0.85,
    paddingLeft: 14,
    marginTop: 14,
    backgroundColor: colors.lightGrey,
    height: 44,
    borderRadius: 4,
    alignSelf: 'center'
  },
  continueButton: {
    textAlign: 'center',
    width: dims.width * 0.85,
    marginTop: 15,
    fontSize: 16,
    color: colors.snowWhite,
    backgroundColor: colors.gradientGreen,
    padding: 14,
    borderRadius: 4,
    overflow: 'hidden'
  }
})

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
      pressable: true,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: ""
    }
  }

  paginate(nextOrPrev) {
    let {index, pressable} = this.state
    let shouldPreventPagination = (nextOrPrev === "next" && index === this.pages.length - 1) || (nextOrPrev === "prev" && index === 0)

    // Validate input
    let inputIsValid = this.validate(this.pages[this.state.index])
    if (nextOrPrev === "next" && !inputIsValid) {
      Alert.alert('Invalid Input', `Please enter a valid ${this.pages[this.state.index]}.`)
      return
    }

    // Prevent double animations and pagination overflow
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

  onChangeText(text, label) {
    this.state[label] = text
    this.setState(() => console.log(this.state))
  }

  validate(label) {
    let valid = false

    console.log("--> label", label)

    switch (label) {
      case "name":
        valid = this.state.firstName.length > 0 && this.state.lastName.length > 0;
        break;
      case "email":
        valid = this.state.email.length > 0;
        break;
      case "password":
        valid = this.state.password.length > 0;
        break;
      case "phone":
        valid = this.state.phone.length > 0;
        break;
    }

    return valid
  }

  render() {
    return(
      <View style={{flex: 1.0, backgroundColor: colors.snowWhite}}>
        <StatusBar barStyle='light-content' />

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
        <View style={{flex: 1.0}}>
          { /* Name */
            (this.pages[this.state.index] !== "name")
              ? null
              : <Animated.View style={[styles.wrap, {opacity: this.AV.name.opacity}]}>
                  <Text style={styles.prompt}>
                    {"What's your name?"}
                  </Text>
                  <TextInput
                    ref={"firstNameInput"}
                    autoFocus autoCorrect={false}
                    defaultValue={this.state.firstName}
                    placeholder={"First name"}
                    style={styles.textInput}
                    returnKeyType={"next"}
                    onSubmitEditing={() => this.refs.lastNameInput.focus()}
                    onChangeText={(text) => this.onChangeText(text, "firstName")} />
                  <TextInput
                    ref={"lastNameInput"}
                    autoCorrect={false}
                    defaultValue={this.state.lastName}
                    placeholder={"Last name"}
                    style={styles.textInput}
                    returnKeyType={"done"}
                    onSubmitEditing={() => this.paginate("next")}
                    onChangeText={(text) => this.onChangeText(text, "lastName")} />
                  <TouchableHighlight underlayColor={'transparent'} onPress={() => this.paginate("next")}>
                    <Text style={styles.continueButton}>
                      {"Continue"}
                    </Text>
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
