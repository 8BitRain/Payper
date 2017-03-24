import React from 'react'
import {View, StyleSheet, Text, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import {RatingModal} from './Modals'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  }
})

class TestSplash extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <Text onPress={() => this.setState({modalVisible: true})}>
          {"Open modal"}
        </Text>

        <RatingModal
          currentUser={this.props.currentUser}
          visible={this.state.modalVisible}
          onSubmit={(rating) => this.setState({modalVisible: false})}
          user={{
            firstName: "Brady",
            lastName: "Sheridan",
            profilePic: "https://scontent-ord1-1.xx.fbcdn.net/v/t1.0-9/17022387_1372970839390041_35582023932744800_n.jpg?oh=89f12fde03130040435030ddeda9f0c6&oe=5950F4FA",
            uid: "blah"
          }} />
      </View>
    )
  }
}

module.exports = TestSplash
