// Dependencies
import React from 'react';
import { View, Animated } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../styles/colors';

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
      velocity: 4.0,
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
      <Animated.View style={{ opacity: this.state.opacity, padding: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <UserPic {...this.props} />
        { (this.props.displayOnly) ? null : <Entypo style={{ marginTop: -1 }} name={"cross"} size={14} color={colors.alertRed} /> }
      </Animated.View>
    );
  }
};

export default DynamicThumbnail;
