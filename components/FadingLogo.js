// Dependencies
import React from 'react';
import { View } from 'react-native';
import { Svg, Rect } from 'react-native-svg';

export default class FadingLogo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Svg height="100" width="100">
        <Rect
          x="15"
          y="15"
          width="70"
          height="70"
          stroke="red"
          strokeWidth="2"
          fill="yellow" />
      </Svg>
    );
  }
}
