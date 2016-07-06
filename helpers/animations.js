/**
  *   This script houses all animation helper functions
**/
import {Animated} from "react-native";

export function fadeIn(animationProps) {
  Animated.timing(          // Uses easing functions
    animationProps.fadeAnim,    // The value to drive
    {toValue: 1}            // Configuration
  ).start();                // Don't forget start!
};

// export function slideDown(animationProps) {
//   Animated.timing(
//     animationProps.height,
//     { toValue: 200 }
//   )
// };
