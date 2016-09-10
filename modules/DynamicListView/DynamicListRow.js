// Dependencies
import React from 'react';
import { View, Animated } from 'react-native';

class DynamicListRow extends React.Component {
  constructor(props) {
    super(props);

    this.HEIGHT = 60;
    this.TRANSITION = 500;

    this.state = {
      height: new Animated.Value(this.HEIGHT),
      opacity: new Animated.Value(0),
    };
  }


  /**
    *   Trigger entry animation
  **/
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: this.TRANSITION,
    }).start();
  }


  /**
    *   Trigger exit animation
  **/
  componentWillUpdate(nextProps, nextState) {
    console.log("Triggering exit animation with props:", nextProps);
    if (nextProps.remove) this.onRemoving(nextProps.onRemoving);
    else this.resetHeight();
  }


  /**
    *   Animate height
  **/
  onRemoving(callback) {
    Animated.timing(this.state.height, {
      toValue: 0,
      duration: this.TRANSITION,
    }).start(callback);
  }


  /**
    *   Reset height on non-animated rows
    *   (iOS does not reset list row style properties, so we must do it explicitly)
  **/
  resetHeight() {
    Animated.timing(this.state.height, {
      toValue: this.HEIGHT,
      duration: 0,
    }).start();
  }


  render() {
    return(
      <Animated.View
        style={{height: this.state.height, opacity: this.state.opacity}}>

        { this.props.children }

      </Animated.View>
    );
  }
}

export default DynamicListRow;
