import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight, Animated, Image, TextInput, Dimensions, StyleSheet, StatusBar, Alert, ScrollView, Modal} from 'react-native'
import {colors} from '../../globalStyles'
import {PhotoUploader} from '../../components'
import {validatePhone, validateEmail, validateName, validatePassword, uploadProfilePic} from '../../helpers'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
const dims = Dimensions.get('window')
const imageDims = { width: 56, height: 56 }
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
  moreInfo: {
    width: dims.width * 0.85,
    marginTop: 10,
    padding: 4,
    fontSize: 16,
    color: colors.slateGrey,
    textAlign: 'left'
  },
  summaryText: {
    marginTop: 10,
    fontSize: 20,
    color: colors.deepBlue
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
  },
  uploadProfilePictureButton: {
    textAlign: 'center',
    // width: dims.width * 0.85,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    color: colors.slateGrey,
    backgroundColor: colors.lightGrey,
    padding: 10,
    borderRadius: 4,
    overflow: 'hidden'
  },
  imageWrap: {
    width: imageDims.width,
    height: imageDims.height,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: imageDims.width / 2,
    backgroundColor: colors.snowWhite,
    shadowColor: colors.slateGrey,
    shadowOpacity: 1.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  image: {
    position: 'absolute',
    width: imageDims.width,
    height: imageDims.height,
    borderRadius: imageDims.width / 2,
    top: (imageDims.height - imageDims.height) / 2,
    left: (imageDims.width - imageDims.width) / 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shadow: {
    shadowColor: colors.slateGrey,
    shadowOpacity: 0.7,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
})

class NewUserOnboardingView extends React.Component {
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
      securePasswordEntry: true,
      passwordIsValid: false,
      photoUploaderModalIsVisible: false,
      signupIsPressable: true,
      loading: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      stylizedPhone: "",
      profilePic: ""
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
    let newState = this.state
    newState[label] = text
    if (label === "password") {
      newState.passwordIsValid = validatePassword(text).isValid
    }
    if (label === "phone") {
      newState["stylizedPhone"] = `1+ (${text.substring(0, 3)}) ${text.substring(3, 6)}-${text.substring(6, 10)}`
    }
    this.setState(newState)
  }

  validate(label) {
    let valid = false

    switch (label) {
      case "name":
        let {firstName, lastName} = this.state
        valid = validateName(firstName) && validateName(lastName)
        break;
      case "email":
        let {email} = this.state
        valid = validateEmail(email)
        break;
      case "password":
        let {password} = this.state
        valid = validatePassword(password).isValid
        break;
      case "phone":
        let {phone} = this.state
        valid = validatePhone(phone).isValid
        break;
    }

    return valid
  }

  renderPasswordValidityIndicators(password) {
    let validityIndicators = []
    let passwordValidations = validatePassword(password)
    let validationMessages = {
      isLongEnough: "> 7 characters",
      hasUppercase: "Uppercase letter",
      hasLowercase: "Lowercase letter",
      hasSymbol: "Symbol",
      hasNumber: "Number"
    }

    for (var k in passwordValidations) {
      if (k === "isValid") continue // skip general validation
      const key = k
      const isValid = passwordValidations[k]
      validityIndicators.push(
        <Text key={Math.random()} style={{color: (isValid) ? colors.alertGreen : colors.alertRed, fontSize: 16, fontWeight: '300'}}>
          <Entypo name={(isValid) ? "thumbs-up" : "thumbs-down"} color={(isValid) ? colors.alertGreen : colors.alertRed} size={14} />
          {"  " + validationMessages[key]}
        </Text>
      )
    }

    return validityIndicators
  }

  signup() {
    let {currentUser} = this.props
    let {firstName, lastName, email, password, phone, profilePic, signupIsPressable} = this.state

    if (!signupIsPressable) return
    this.setState({loading: true, signupIsPressable: false})

    currentUser.createUserWithEmailAndPassword({
      firstName,
      lastName,
      email,
      password,
      phone
    },
    (uid) => {
      // Success!
      // Actions.FirstPaymentView()
      currentUser.update({
        decryptedEmail: email,
        decryptedPhone: phone,
        cachedProfilePic: profilePic
      })
      Actions.MainViewContainer({
        cb: () => uploadProfilePic(profilePic, email, currentUser.token)
      })
    },
    (errCode) => {
      // Failure :(
      this.setState({loading: false, signupIsPressable: true})
      if (errCode === "auth/email-already-in-use" || errCode === "dupe-email") {
        Alert.alert('Invalid Email', 'This email is already in use.')
      } else if (errCode === "dupe-phone") {
        Alert.alert('Invalid Phone', 'This phone number is already in use.')
      } else {
        Alert.alert('Sorry...', 'Something went wrong. Please try again later.')
      }
    })
  }

  render() {
    let hiddenPassword = ""
    for (var i = 0; i < this.state.password.length; i++)
      hiddenPassword += "•"

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
              onPress={() => (this.state.index === 0) ? Actions.pop() : this.paginate("prev")}>
              <EvilIcons name={(this.state.index === 0) ? "close" : "chevron-left"} color={colors.snowWhite} size={(this.state.index === 0) ? 24 : 30} />
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
              : <Animated.View style={[styles.wrap, {opacity: this.AV.email.opacity}]}>
                  <Text style={styles.prompt}>
                    {"What's your email address?"}
                  </Text>
                  <TextInput
                    ref={"emailInput"}
                    autoFocus autoCorrect={false} autoCapitalize={"none"}
                    defaultValue={this.state.email}
                    placeholder={"ex. johndoe@example.com"}
                    style={styles.textInput}
                    keyboardType={"email-address"}
                    returnKeyType={"done"}
                    onSubmitEditing={() => this.paginate("next")}
                    onChangeText={(text) => this.onChangeText(text, "email")} />
                  <TouchableHighlight underlayColor={'transparent'} onPress={() => this.paginate("next")}>
                    <Text style={styles.continueButton}>
                      {"Continue"}
                    </Text>
                  </TouchableHighlight>
                </Animated.View> }

          { /* Password */
            (this.pages[this.state.index] !== "password")
              ? null
              : <Animated.View style={[styles.wrap, {opacity: this.AV.password.opacity}]}>
                  <Text style={styles.prompt}>
                    {"Enter a secure password."}
                  </Text>

                  <View style={{width: dims.width * 0.85, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <TextInput
                      ref={"passwordInput"}
                      autoFocus autoCorrect={false} autoCapitalize={"none"}
                      defaultValue={this.state.password}
                      placeholder={"••••••••••"}
                      style={[styles.textInput, {paddingLeft: 50, paddingRight: 42}]}
                      returnKeyType={"done"}
                      secureTextEntry={this.state.securePasswordEntry}
                      onSubmitEditing={() => this.paginate("next")}
                      onChangeText={(text) => this.onChangeText(text, "password")} />

                    <View style={{position: 'absolute', top: 15, left: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: 40, backgroundColor: 'rgba(237, 237, 237, 0.8)', borderTopLeftRadius: 4, borderBottomLeftRadius: 4}}>
                      <Entypo
                        name={(this.state.securePasswordEntry) ? "eye" : "eye-with-line" }
                        color={colors.accent} size={22}
                        onPress={() => this.setState({ securePasswordEntry: !this.state.securePasswordEntry })} />
                    </View>

                    <View style={{position: 'absolute', top: 15, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: 40, backgroundColor: 'rgba(237, 237, 237, 0.8)', borderTopRightRadius: 4, borderBottomRightRadius: 4}}>
                      <EvilIcons name={"check"} color={(this.state.passwordIsValid) ? colors.gradientGreen : colors.slateGrey} size={28} />
                    </View>
                  </View>

                  <View style={{marginTop: 10}}>
                    { /* Password validity indicators */
                      this.renderPasswordValidityIndicators(this.state.password) }
                  </View>

                  <TouchableHighlight underlayColor={'transparent'} onPress={() => this.paginate("next")}>
                    <Text style={styles.continueButton}>
                      {"Continue"}
                    </Text>
                  </TouchableHighlight>
                </Animated.View> }

          { /* Phone */
            (this.pages[this.state.index] !== "phone")
              ? null
              : <Animated.View style={[styles.wrap, {opacity: this.AV.phone.opacity}]}>
                  <Text style={styles.prompt}>
                    {"What's your phone number?"}
                  </Text>

                  <View style={{width: dims.width * 0.85, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <TextInput
                      ref={"phoneInput"}
                      maxLength={10}
                      autoFocus autoCorrect={false} autoCapitalize={"none"}
                      defaultValue={this.state.phone}
                      placeholder={"ex. 2623058038"}
                      style={[styles.textInput, {paddingLeft: 50, paddingRight: 42}]}
                      keyboardType={"number-pad"}
                      returnKeyType={"done"}
                      onSubmitEditing={() => this.paginate("next")}
                      onChangeText={(text) => this.onChangeText(text, "phone")} />

                    <View style={{position: 'absolute', top: 15, left: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width: 40, backgroundColor: 'rgba(237, 237, 237, 0.8)', borderTopLeftRadius: 4, borderBottomLeftRadius: 4}}>
                      <Text>
                        {"1+"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.moreInfo}>
                    {"We won't share your phone number with anyone else."}
                  </Text>

                  <TouchableHighlight underlayColor={'transparent'} onPress={() => this.paginate("next")}>
                    <Text style={styles.continueButton}>
                      {"Continue"}
                    </Text>
                  </TouchableHighlight>
                </Animated.View> }

          { /* Summary */
            (this.pages[this.state.index] !== "summary")
              ? null
              : <Animated.View style={[styles.wrap, {opacity: this.AV.summary.opacity}]}>

                  { /* Profile picture and name */ }
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    { /* Profile picture */ }
                    <View style={styles.imageWrap}>
                      {(this.state.profilePic)
                        ? <Image style={styles.image} source={{uri: this.state.profilePic}} />
                        : <View style={styles.image}>
                            <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
                              {this.state.firstName.charAt(0) + this.state.lastName.charAt(0)}
                            </Text>
                          </View> }
                    </View>

                    { /* Spacer */ }
                    <View style={{width: 12}} />

                    { /* Name */ }
                    <View>
                      <Text style={[styles.summaryText, {marginTop: 0}]}>
                        {this.state.firstName}
                      </Text>
                      <Text style={[styles.summaryText, {marginTop: 0}]}>
                        {this.state.lastName}
                      </Text>
                    </View>
                  </View>

                  { /* Upload profile picture button */ }
                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    onPress={() => this.setState({photoUploaderModalIsVisible: true})}>
                    <View style={[styles.shadow, {width: dims.width * 0.7, height: 40, borderRadius: 4, flexDirection: 'row', marginTop: 26}]}>
                      <View style={{flex: 0.2, backgroundColor: colors.lightGrey, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 4, borderBottomLeftRadius: 4}}>
                        <EvilIcons name={"camera"} size={34} color={colors.accent} />
                      </View>
                      <View style={{flex: 0.8, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 4, borderBottomRightRadius: 4}}>
                        <Text style={{fontSize: 16, fontWeight: '400', color: colors.snowWhite}}>
                          {"Select Profile Picture"}
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>

                  { /* Email */ }
                  <View style={{width: dims.width * 0.85, marginTop: 26}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{paddingLeft: 5, fontSize: 18, fontWeight: '500', color: colors.deepBlue}}>
                        {"Account Summary"}
                      </Text>
                    </View>
                  </View>

                  { /* Email */ }
                  <View style={{width: dims.width * 0.85, height: 40, marginTop: 15, borderColor: colors.medGrey, borderTopWidth: 1, paddingTop: 8}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <EvilIcons name={"envelope"} size={32} color={colors.accent} />
                      <View style={{width: 6}} />
                      <Text style={{fontSize: 18, color: colors.deepBlue}}>
                        {this.state.email}
                      </Text>
                    </View>
                  </View>

                  { /* Phone */ }
                  <View style={{width: dims.width * 0.85, height: 40, marginTop: 15, borderColor: colors.medGrey, borderTopWidth: 1, paddingTop: 8}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Ionicons name={"ios-call-outline"} size={32} color={colors.accent} style={{marginLeft: 5, marginRight: 5}} />
                      <View style={{width: 6}} />
                      <Text style={{fontSize: 18, color: colors.deepBlue}}>
                        {this.state.stylizedPhone}
                      </Text>
                    </View>
                  </View>

                  { /* Password */ }
                  <View style={{width: dims.width * 0.85, height: 40, marginTop: 15, borderColor: colors.medGrey, borderTopWidth: 1, paddingTop: 8}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <EvilIcons name={"lock"} size={32} color={colors.accent} />
                      <View style={{width: 8}} />
                      <Text style={{fontSize: 18, color: colors.deepBlue}}>
                        {(this.state.securePasswordEntry)
                          ? hiddenPassword
                          : this.state.password }
                      </Text>
                    </View>

                    <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, width: 40, justifyContent: 'center', alignItems: 'center'}}>
                      <Entypo
                        name={(this.state.securePasswordEntry) ? "eye" : "eye-with-line" }
                        color={colors.accent} size={22}
                        onPress={() => this.setState({ securePasswordEntry: !this.state.securePasswordEntry })} />
                    </View>
                  </View>

                  <TouchableHighlight
                    style={{position: 'absolute', bottom: 25, left: 0, right: 0, alignItems: 'center'}}
                    underlayColor={'transparent'}
                    activeOpacity={0.75}
                    onPress={() => this.signup()}>
                    <Text style={styles.continueButton}>
                      {(this.state.loading)
                        ? "Creating your account..."
                        : "Sign Me Up" }
                    </Text>
                  </TouchableHighlight>
                </Animated.View> }
        </View>

        { /* Photo Uploader */ }
        <Modal animationType={"slide"} transparent={false} visible={this.state.photoUploaderModalIsVisible}>
          <View style={{overflow: 'hidden'}}>
            <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
            <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
              <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
                {"Photo Upload"}
              </Text>

              <TouchableHighlight
                activeOpacity={0.75}
                underlayColor={'transparent'}
                style={{position: 'absolute', top: 0, left: 0, bottom: 0, padding: 14, paddingTop: 30, justifyContent: 'center'}}
                onPress={() => this.setState({photoUploaderModalIsVisible: false})}>
                <EvilIcons name={"close"} color={colors.snowWhite} size={24} />
              </TouchableHighlight>
            </View>
          </View>

         <PhotoUploader
            insteadOfUpload={(img) => {
              this.setState({
                profilePic: img,
                photoUploaderModalIsVisible: false
              })
            }}
            title={"PhotoUploader"}
            brand={"photo"} index={1} currentUser={this.props.currentUser} />
        </Modal>
      </View>
    )
  }
}

module.exports = NewUserOnboardingView
