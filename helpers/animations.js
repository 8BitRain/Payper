/**
  *   This script houses all animation helper functions
**/
import {Animated, Dimensions} from "react-native";

const dimensions = Dimensions.get('window');

export function fadeIn(animationProps) {
  Animated.timing(          // Uses easing functions
    animationProps.fadeAnim,    // The value to drive
    {toValue: 1}            // Configuration
  ).start();                // Don't forget start!
};

export function bounce(animationProps) {
  animationProps.bounceValue.setValue(1.5);
  Animated.spring(
    animationProps.bounceValue,
    {
      toValue: 0.8,
      friction: 1,
    }
  ).start();
};

export function slideIn(animationProps) {
  // Animated.decay(animationProps.start, {
  //   velocity: {x: 100, y: 100},
  //   deceleration: 0.997
  // }).start();
  Animated.timing(animationProps.start, {
    toValue: 0,
    duration: 300
  }).start();
};

//
// Animated.decay(this._animatedValue, {   // coast to a stop
//     velocity: {x: gestureState.vx, y: gestureState.vy}, // velocity from gesture release
//     deceleration: 0.997,
// })



export function slideOut(animationProps) {
  Animated.timing(animationProps.start, {
    toValue: 200,
    duration: 500
  }).start();
};
