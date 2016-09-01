// Dependencies
import React from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet, TouchableHighlight, Modal } from 'react-native';

// Helper functions
import * as Lambda from '../../services/Lambda';

// Iconography
import Entypo from 'react-native-vector-icons/Entypo';

// Custom stylesheets
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');
const styles = StyleSheet.create({

  // Title text
  title: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: colors.accent,
    fontWeight: '200',
  },

  // Info text
  info: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.richBlack,
    paddingBottom: 12,
    textAlign: 'center',
  },

  // Text input wrap
  input: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '200',
    color: colors.white,
    paddingLeft: 20,
    paddingRight: 20,
    width: dimensions.width,
    height: 50,
    backgroundColor: colors.richBlack,
    textAlign: 'center',
  },

});


class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
    }
  }

  render() {
    return (
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.richBlack}}>

        { /* Title */ }
        <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: dimensions.width}}>

          { /* Header */ }
          <View style={{justifyContent: 'center', alignItems: 'center', width: dimensions.width, backgroundColor: colors.richBlack, padding: 40}}>
            <Text style={styles.title}>
              { this.props.editing.modalTitle }
            </Text>
          </View>

          { /* Current */
            (this.props.editing.modalContent)
              ? <View style={{justifyContent: 'center', alignItems: 'center', width: dimensions.width, backgroundColor: colors.richBlack}}>
                  <Text style={[styles.info, {color: colors.white, fontWeight: '200'}]}>
                    Current { this.props.editing.modalTitle.toLowerCase() }: { this.props.editing.modalContent }
                  </Text>
                  <Text style={[styles.info, {color: colors.white, fontWeight: '200'}]}>
                    ({this.props.editing.modalInfo})
                  </Text>
                </View>
              : <View style={{justifyContent: 'center', alignItems: 'center', width: dimensions.width, backgroundColor: colors.richBlack}}>
                  <Text style={[styles.info, {color: colors.white, fontWeight: '200'}]}>
                    ({this.props.editing.modalInfo})
                  </Text>
                </View>
          }


          { /* Text input */ }
          <View style={{justifyContent: 'center', alignItems: 'center', width: dimensions.width, backgroundColor: colors.white}}>

            <View >
              <TextInput
                style={styles.input}
                placeholderTextColor={colors.accent}
                placeholder={"Enter your new " + this.props.editing.modalTitle.toLowerCase()}
                autoCorrect={false}
                autoCapitalize={(this.props.editing.modalTitle = "Display Name") ? true : false}
                autofocus
                onChangeText={(input) => this.setState({ input: input })} />
            </View>

          </View>

        </View>

        { /* Close modal button */ }
        <TouchableHighlight
          underlayColor={'transparent'}
          activeOpacity={0.7}
          onPress={() => this.props.toggleModal()}
          style={{position: 'absolute', top: 0, left: 0, padding: 40, backgroundColor: 'transparent'}}>

          <Entypo name="cross" size={25} color={colors.accent} />

        </TouchableHighlight>

      </View>
    );
  }
}

export default Edit;
