import React from 'react'
import { View, Text, Image, ListView, RecyclerViewBackedScrollView, Dimensions } from 'react-native'

let dims = Dimensions.get('window')
let imageDims = { width: 56, height: 56 }
import { colors } from '../../globalStyles'

class MyProfile extends React.Component {
  constructor(props) {
    super(props)

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = {
      rows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections({})
    }
  }

  componentDidMount() {
    let rows = this.generateRowData(this.props.currentUser)
    this.setState({rows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(rows)})
  }

  generateRowData(currentUser) {
    let rows = {
      "Profile Details": [
        {key: "Display Name", val: currentUser.first_name + " " + currentUser.last_name},
        {key: "Username", val: currentUser.username},
        {key: "Email", val: currentUser.decryptedEmail},
        {key: "Phone Number", val: currentUser.decryptedPhone}
      ]
    }

    return rows
  }

  renderSectionHeader(sectionData, sectionTitle) {
    if (sectionTitle.length === 0) {
      return(
        <View style={{height: 0}} />
      )
    } else {
      return(
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 8, backgroundColor: colors.medGrey}}>
          <Text style={{color: colors.deepBlue}}>{ sectionTitle }</Text>
        </View>
      )
    }
  }

  renderRow(params) {
    let { key, val } = params

    return(
      <View style={{flexDirection: 'column', borderColor: colors.slateGrey, borderBottomWidth: 1.0}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
          <Text style={{color: colors.deepBlue}}>
            { key }
          </Text>
          <Text style={{color: colors.deepBlue}}>
            { val }
          </Text>
        </View>
      </View>
    )
  }

  render() {
    let { first_name, last_name, username, profile_pic } = this.props.currentUser
    let name = first_name + " " + last_name

    return(
      <View style={styles.wrap}>

        { /* Header */ }
        <View style={{flexDirection: 'column', alignItems: 'center', paddingBottom: 15}}>
          <View style={styles.imageWrap}>
            {(profile_pic)
              ? <Image style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2}} source={{uri: profile_pic}} />
              : <View style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
                    {this.getInitials()}
                  </Text>
                </View> }
          </View>
          <Text style={{color: colors.deepBlue, fontSize: 22, fontWeight: '200', paddingTop: 8, textAlign: 'center', backgroundColor: 'transparent'}}>
            {name}
          </Text>
          <Text style={{color: colors.accent, fontSize: 16, fontWeight: '200', paddingTop: 4, textAlign: 'center', backgroundColor: 'transparent'}}>
            {username}
          </Text>
        </View>

        { /* Profile details */ }
        <ListView
          style={{width: dims.width, backgroundColor: 'transparent'}}
          dataSource={this.state.rows}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderFooter={() => <View style={{height: 90}} />}
          enableEmptySections />
      </View>
    )
  }
}

const styles = {
  wrap: {
    backgroundColor: colors.snowWhite,
    paddingTop: 20,
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
}

module.exports = MyProfile
