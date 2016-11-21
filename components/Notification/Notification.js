import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { Actions } from 'react-native-router-flux'
import { colors } from '../../globalStyles'
import styles from '../../styles/Notifications/Notification'
import * as Init from '../../_init'
import * as Partials from '../../helpers/Partials'
import * as StringMaster5000 from '../../helpers/StringMaster5000'
import * as Alert from '../../helpers/Alert'

class Notification extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const n = StringMaster5000.formatNotification(this.props.notification)

    return(
      <TouchableHighlight
        onPress={ () => Alert.message({title: n.name, message: n.info})}
        underlayColor={'transparent'}
        opacity={0.7}>
        <View style={[styles.notificationWrap, {borderLeftWidth: 4, borderLeftColor: n.iconColor}]} onPress={() => options.callback()}>
          { /* Profile picture of nofication sender */ }
          <View style={styles.userWrap}>
            <View style={{marginRight: 10}}>
              { Partials.getUserPic(n.pic, n.name) }
              <View style={styles.iconWrap}>
                <Entypo name={n.icon} size={14} color={n.iconColor}/>
              </View>
            </View>
          </View>

          { /* Notification text */ }
          <View style={styles.textWrap}>
            <Text style={[styles.text, {color: colors.accent}]}>{ n.ts }</Text>
            <Text style={styles.text}>{ n.info }</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default Notification
