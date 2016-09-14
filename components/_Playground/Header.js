// Dependencies
import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableHighlight, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';

// Should we show container borders?
const borders = false;

// Window dimensions
const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

// Header logo dimensions
const logoDimensions = {
  height: (dimensions.height * 0.1) * 0.75,
  width: ((dimensions.height * 0.1) * 0.75) * (103 / 143),
};

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gradientStartX: 0.0,
      gradientStartY: 0.0,
      gradientEndX: 1.0,
      gradientEndY: 1.0,
      activeFilter: this.props.activeFilter,
    };
  }

  render() {
    return(
      <View style={{ flex: 1.0, flexDirection: 'row', paddingTop: (Platform.OS === 'ios') ? 20 : 35 }}>
        { /* Background Gradient */ }
        <LinearGradient
          start={[this.state.gradientStartX, this.state.gradientStartY]} end={[this.state.gradientEndX, this.state.gradientEndY]}
          locations={[0, 0.5, 1.0]}
          colors={['#212124', '#151516', '#000']}
          style={gradients.header} />

        { /* Incoming filter */ }
        <TouchableHighlight
          style={filters.incoming}
          activeOpacity={(this.props.activeFilter == "incoming") ? 1.0 : 0.8}
          underlayColor={'transparent'}
          onPress={() => this.props.handleFilterChange("incoming")}>

          <View style={{ flex: 1.0, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[typography.filter, (this.props.activeFilter == "incoming") ? filters.active : null]}>
              Incoming
            </Text>
          </View>

        </TouchableHighlight>

        { /* Logo */ }
        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={images.logo} source={require('../../assets/logo.png')} />
        </View>

        { /* Outgoing filter */ }
        <TouchableHighlight
          style={filters.incoming}
          activeOpacity={(this.props.activeFilter == "outgoing") ? 1.0 : 0.8}
          underlayColor={'transparent'}
          onPress={() => this.props.handleFilterChange("outgoing")}>

          <View style={{ flex: 1.0, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[typography.filter, (this.props.activeFilter == "outgoing") ? filters.active : null]}>
              Outgoing
            </Text>
          </View>

        </TouchableHighlight>
      </View>
    );
  }
};

const gradients = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const images = StyleSheet.create({
  logo: {
    height: logoDimensions.height,
    width: logoDimensions.width,
  },
});

const filters = StyleSheet.create({
  incoming: {
    flex: 0.4,
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'orange',
  },
  active: {
    backgroundColor: 'rgba(38, 38, 38, 0.85)',
  },
});

const typography = StyleSheet.create({
  filter: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '200',
    color: colors.white,
    padding: 8,
    borderRadius: 1,
  },
});

export default Header;
