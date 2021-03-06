import React from 'react'
import {View, Text} from 'react-native'
import {colors} from '../../../globalStyles'
import {decryptSecret} from '../../../helpers/lambda'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

class Secret extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      decryptedSecret: props.decryptedSecret || ""
    }
  }

  componentDidMount() {
    if (this.props.shouldDecrypt && !this.props.decryptedSecret) {
      decryptSecret({
        castID: this.props.broadcast.castID,
        token: this.props.currentUser.token
      }, (response) => {
        this.setState(response)
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.decryptedSecret) {
      this.setState({decryptedSecret: nextProps.decryptedSecret})
    }
  }

  render() {
    return(
      <View style={{paddingBottom: 20}}>
        <View style={{paddingTop: 8, paddingBottom: 8, width: this.props.width, borderColor: colors.medGrey, borderBottomWidth: (this.props.showBorder === false) ? 0 : 1}}>

          { /* Title and Lock Icon */ }
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700'}}>
              {"Secret"}
            </Text>
            <EvilIcons name={(this.state.decryptedSecret === "") ? "lock" : "unlock"} size={32} color={colors.accent} />
          </View>

          { /* Text */
            (this.state.decryptedSecret === "")
              ? null
              : <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, alignItems: 'center', flexWrap: 'wrap'}}>
                  {this.state.decryptedSecret}
                </Text> }

        </View>

        {(!this.state.decryptedPhone && !this.state.decryptedPhone)
            ? null
            : <View style={{paddingTop: 8, paddingBottom: 8, width: this.props.width, borderColor: colors.medGrey, borderBottomWidth: (this.props.showBorder === false) ? 0 : 1}}>

                { /* Title and Lock Icon */ }
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700'}}>
                    {"Contact"}
                  </Text>
                  <EvilIcons name={(this.state.decryptedSecret === "") ? "lock" : "unlock"} size={32} color={colors.accent} />
                </View>

                { /* Phone number */
                  (this.state.decryptedPhone === "")
                    ? null
                    : <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, alignItems: 'center', flexWrap: 'wrap'}}>
                        {this.state.decryptedPhone}
                      </Text> }

                { /* Email address */
                  (this.state.decryptedEmail === "")
                    ? null
                    : <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, alignItems: 'center', flexWrap: 'wrap'}}>
                        {this.state.decryptedEmail}
                      </Text> }

              </View> }
      </View>
    )
  }
}

module.exports = Secret
