// Dependencies
import React from 'react';
import { View, Text, Animated, Image, Dimensions, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Global styles
import colors from '../../styles/colors';

// Window dimensions
const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

// Logo dimensions
const logoDimensions = {
  width: dimensions.width * 0.2,
  height: (dimensions.width * 0.2) * (143 / 103),
}

const borders = false;

// Containers, background colors, etc.
const styles = StyleSheet.create({
  pageWrap: {
    flex: 1.0,
    width: dimensions.width,
    height: dimensions.height,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  logoWrap: {
    flex: 0.4,
    width: dimensions.width,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'red',
    paddingTop: 20,
  },
  demoWrap: {
    flex: 0.2,
    width: dimensions.width,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'green',
  },
  buttonWrap: {
    flex: 0.2,
    width: dimensions.width,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'orange',
  },
  footerWrap: {
    flex: 0.2,
    width: dimensions.width,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'blue',
  },
  logo: {
    width: logoDimensions.width,
    height: logoDimensions.height,
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

// Font and text styles
const typography = StyleSheet.create({
  title: {
    fontFamily: 'Roboto',
    fontSize: 40,
    fontWeight: '200',
    color: colors.white,
    backgroundColor: 'transparent',
    padding: 12.5,
  },
});

class BlackPurple extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      gradientStartX: 0.0,
      gradientStartY: 0.0,
      gradientEndX: 1.0,
      gradientEndY: 1.0,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        counter: this.state.counter + 1,
        gradientStartX: this.state.gradientStartX + 0.01,
        gradientStartY: this.state.gradientStartY + 0.01,
        gradientEndX: this.state.gradientEndX + 0.01,
        gradientEndY: this.state.gradientEndY + 0.01,
      });
      console.log("counter:", this.state.counter);
    }, 20);
  }

  render() {
    return(
      <View style={{ flex: 1.0 }}>
        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Background Gradient */ }
        <LinearGradient
          start={[this.state.gradientStartX, this.state.gradientStartY]} end={[this.state.gradientEndX, this.state.gradientEndY]}
          locations={[0,1,0]}
          colors={['#151617', '#3f2f4e', '#432f55']}
          style={styles.linearGradient} />

        { /* Page contents */ }
        <View style={styles.pageWrap}>

          { /* Logo and 'Payper' */ }
          <View style={styles.logoWrap}>
            <Image style={styles.logo} source={require('../../assets/logo.png')} />
            <Text style={typography.title}>Payper</Text>
          </View>

          { /* Demo payments */ }
          <View style={styles.demoWrap}>

          </View>

          { /* Sign in buttons */ }
          <View style={styles.buttonWrap}>

          </View>

          { /* Privacy Policy and Terms of Service */ }
          <View style={styles.footerWrap}>

          </View>
        </View>
      </View>
    );
  }
};

export default BlackPurple;
