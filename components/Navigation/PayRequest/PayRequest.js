// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Dimensions } from "react-native";

// Helpers
import * as StringMaster5000 from '../../../helpers/StringMaster5000';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

class PayRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderWidth: dimensions.width * 0.2,
      sliderLeftX: 0,
      sliderRightX: dimensions.width * 0.2,
      sliding: false,
      lastTouchX: 0,
    }

    this.logEvents = true;
  }


  _logTouchEvent(e, type) {
    if (!this.logEvents) return;
    console.log("%cTouch event: " + type, "color:blue;font-weight:900;");
    console.log(e.nativeEvent);
    console.log("%c--------------------------------------------------", "color:blue;font-weight:900;")
  }


  _handleStart(e) {
    this._logTouchEvent(e, "start");

    var x = e.nativeEvent.locationX;

    console.log("Started touch.");
    console.log("sliderLeftX:", this.state.sliderLeftX);
    console.log("sliderRightX:", this.state.sliderRightX);

    if (x > this.state.sliderLeftX && x < this.state.sliderRightX) {
      if (this.logEvents) console.log("%cHit the target.", "color:green;font-weight:900;");
      this.setState({sliding: true});
      return true;
    } else {
      if (this.logEvents) console.log("%cMissed the target.", "color:red;font-weight:900;");
      return false;
    }
  }

  _handleResponderGrant(e) {
    this._logTouchEvent(e, "responder grant");
  }

  _handleMove(e) {
    if (this.state.sliding) {
      // this._logTouchEvent(e, "move");

      var x = e.nativeEvent.locationX;
      var diff = (this.state.lastTouchX > 0) ? Math.abs(this.state.lastTouchX - x) : 0;
      var newSliderLeftX = (diff > 0) ? this.state.sliderLeftX + diff : this.state.sliderLeftX - diff;
      var newSliderRightX = newSliderLeftX + this.state.sliderWidth;

      console.log("touchX:", x);
      console.log("diff:", diff);
      console.log("newSliderLeftX:", newSliderLeftX);
      console.log("newSliderRightX:", newSliderRightX);

      this.setState({sliderLeftX: newSliderLeftX});
      this.setState({sliderRightX: newSliderRightX});
      this.setState({lastTouchX: x});
    }
  }

  _handleRelease(e) {
    this._logTouchEvent(e, "release");
    this.setState({sliding: false});
    console.log("Released touch.");
    console.log("sliderLeftX:", this.state.sliderLeftX);
    console.log("sliderRightX:", this.state.sliderRightX);
  }

  _getConfirmationButton() {
    return(
      <TouchableHighlight
        onPress={(this.props.loading) ? () => console.log("Already sending...") : () => this.props.confirmCallback()}
        style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.alertGreen}}
        underlayColor={colors.lightAlertGreen}
        activeOpacity={1.0}>

        { /*
        <View
          onStartShouldSetResponder={(e) => this._handleStart(e)}
          onResponderGrant={(e) => this._handleResponderGrant(e)}
          onResponderMove={(e) => this._handleMove(e)}
          onResponderRelease={(e) => this._handleRelease(e)}
          style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.alertGreen}}>
        */ }

        <View>
          <Text style={{fontSize: 16, fontWeight: '600', color: colors.white, textAlign: 'center'}}>
            { (this.props.loading)
                ? "Sending..."
                : "Confirm " + StringMaster5000.capFirstLetter(this.props.awaitingConfirmationOn) }
          </Text>
          { (!this.props.loading)
              ? <Text style={{fontSize: 13, fontWeight: '300', color: colors.white, textAlign: 'center'}}>
                  (UWCU *3812)
                </Text>
              : null
          }
        </View>
        { /*
        <View style={{
          position: 'absolute',
          width: this.state.sliderWidth,
          top: 0,
          left: this.state.sliderLeftX,
          bottom: 0,
          backgroundColor: 'red'
          }} />
        */ }

      {/*
      </View>
      */}
      </TouchableHighlight>
    );
  }

  _getPayRequestButtons() {
    return(
      <View style={{flex: 1.0, flexDirection: 'row'}}>
        <TouchableHighlight
          onPress={() => this.props.requestCallback()}
          style={{flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.richBlack, borderRightColor: colors.accent, borderRightWidth: 0.5}}
          underlayColor={colors.richBlack}
          activeOpacity={0.7}>
          <View>
            <Text style={{fontSize: 16, fontWeight: '600', color: colors.accent}}>Request</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.payCallback()}
          style={{flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.richBlack, borderLeftColor: colors.accent, borderLeftWidth: 0.5}}
          underlayColor={colors.richBlack}
          activeOpacity={0.7}>
          <View>
            <Text style={{fontSize: 16, fontWeight: '600', color: colors.accent}}>Pay</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return(
      <View style={{flexDirection: 'row', height: 60, borderTopColor: colors.richBlack, borderTopWidth: 1}}>
        {(this.props.awaitingConfirmationOn.length > 0) ? this._getConfirmationButton() : this._getPayRequestButtons()}
      </View>
    );
  }
};

export default PayRequest;
