// Dependencies
import React from 'react';
import { View, Animated } from 'react-native';

// Components
import UserPic from '../Previews/UserPic/UserPic';

class DynamicThumbnail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.spring(this.state.opacity, {
      toValue: 1.0,
      velocity: 4.0
    }).start();
  }

  componentWillUnmount() {
    Animated.spring(this.state.opacity, {
      toValue: 0.0,
      velocity: 4.0
    }).start();
  }

  render() {
    return(
      <Animated.View style={{ opacity: this.state.opacity, paddingLeft: 10, paddingRight: 10 }}>
        <UserPic {...this.props} />
      </Animated.View>
    );
  }
};

export default DynamicThumbnail;
