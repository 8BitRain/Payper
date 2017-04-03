import React from 'React'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../../globalStyles'
import Ionicons from 'react-native-vector-icons/Ionicons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: dims.width * 0.94,
    borderColor: colors.medGrey,
    borderBottomWidth: 1,
    padding: 8
  },
  title: {
    fontSize: 16,
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
  buttonText: {
    fontSize: 14,
    color: colors.accent
  }
})

class WantOwnRow extends React.Component {
  constructor(props) {
    super(props)
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

  render() {
    return(
      <View style={styles.container}>

        { /* Icon */ }
        <View style={{flex: 0.14, justifyContent: 'center', alignItems: 'center'}}>
          {this.getIcon()}
        </View>

        { /* Title */ }
        <View style={{flex: 0.56, justifyContent: 'center'}}>
          <Text style={styles.title}>{this.props.data.title}</Text>
        </View>

        { /* Want and own buttons */ }
        <View style={{flex: 0.3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={'transparent'}
            onPress={() => alert("Want")}>
            <View style={styles.buttonWrap}>
              <Text style={styles.buttonText}>{"Want"}</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={'transparent'}
            onPress={() => alert("Own")}>
            <View style={styles.buttonWrap}>
              <Text style={[styles.buttonText, {color: colors.gradientGreen}]}>{"Own"}</Text>
            </View>
          </TouchableHighlight>
        </View>

      </View>
    )
  }
}

module.exports = WantOwnRow
