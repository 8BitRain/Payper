// // Dependencies
// import React from 'react';
// import { View, TouchableHighlight, Animated, Easing, Dimensions } from 'react-native';
// import Svg, { Path, G } from 'react-native-svg';
//
// import colors from '../styles/colors';
// const dimensions = Dimensions.get('window');
//
// class LoadingSVG extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { animating: false };
//     this.props.color = colors.accent; // TODO: Remove this line
//   }
//
//   render() {
//     return(
//       <View style={{ flex: 1.0, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.richBlack }}>
//         <Svg height="100" width="100">
//           <Path
//             d="M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25"
//             fill="red"
//             stroke="red" />
//         </Svg>
//       </View>
//     );
//   }
// }
//
// export default LoadingSVG;
