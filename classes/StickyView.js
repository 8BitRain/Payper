import React from 'react';
import { View, Animated, Easing, Keyboard } from 'react-native';

export default class StickyView extends React.Component {
  constructor(props) {
    super(props);
    this.offsetBottom = new Animated.Value(0);
  }

  componentDidMount() {
    _keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
  }

  componentWillUnmount() {
    _keyboardWillShowSubscription.remove();
    _keyboardWillHideSubscription.remove();
  }

  _keyboardWillShow(e) {
    if (this.props.onlyStickWhen === false) return;

    Animated.timing(this.offsetBottom, {
      toValue: e.endCoordinates.height,
      duration: 350,
      easing: Easing.elastic(0.5)
    }).start();
  }

  _keyboardWillHide() {
    Animated.timing(this.offsetBottom, {
      toValue: 0,
      duration: 350,
      easing: Easing.elastic(0.5)
    }).start();
  }

  render() {
    return(
      <Animated.View style={{ position: 'absolute', left: 0, right: 0, bottom: this.offsetBottom }}>
        { this.props.children }
      </Animated.View>
    );
  }
}
