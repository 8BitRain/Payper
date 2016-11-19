import React from 'react'
import { View, Text, TouchableHighlight, Image, Dimensions } from 'react-native'
import { colors } from '../../globalStyles'
import { VibrancyView } from 'react-native-blur'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const imageDims = {
  width: dims.width * 0.15,
  height: dims.width * 0.15
}

class SideMenu extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: colors.deeperBlue, paddingTop: 40}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Image style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2, borderWidth: 1, borderColor: colors.dodgerBlue, padding: 6}} source={{uri: "https://scontent-yyz1-1.xx.fbcdn.net/v/t1.0-9/14962557_1250241661662960_1895438605245811540_n.jpg?oh=ec9e68d2762b6306578dd0a50f401221&oe=58D4F092"}} />
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={colors.deeperBlue}
            onPress={() => alert("Would open profile page")}>
            <View style={{flexDirection: 'column', flexWrap: 'wrap', flex: 1.0, flexWrap: 'wrap'}}>
              <Text style={{fontSize: 20, fontWeight: '300', color: colors.snowWhite}}>
                {"Brady Sheridan"}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 16, color: colors.dodgerBlue, justifyContent: 'center'}}>
                  {"Edit my profile"}
                </Text>
                <EvilIcons name={"chevron-right"} size={24} color={colors.dodgerBlue} />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

module.exports = SideMenu
