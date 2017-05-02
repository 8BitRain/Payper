import React from 'react'
import {View, Image, Dimensions} from 'react-native'
const dims = Dimensions.get('window')

class Loader extends React.Component {
  constructor(props) {
    super(props)
    this.aspectRatio = 0.6666666667
    this.height = dims.height * 0.185
    this.width = this.height * this.aspectRatio
  }

  render() {
    return(
      <View style={this.props.containerStyles || {}}>
        {(this.props.theme === "darkOnLight")
          ? <Image
              source={require('../assets/images/loading-dark-on-light.gif')}
              style={{width: this.width, height: this.height, backgroundColor: 'transparent'}} />
          : <Image
              source={require('../assets/images/loading-light-on-dark.gif')}
              style={{width: this.width, height: this.height, backgroundColor: 'transparent'}} />
        }
      </View>
    )
  }
}

module.exports = Loader
