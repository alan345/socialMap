import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
export default class AddTripButton extends Component {

  render() {
    return (

      <View style={styles.container}>
        <Button
          onPress={this.props.onPressButtonTrip}
          title="✚"
          color="#841584"
          accessibilityLabel="✚"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position    : 'absolute',
    top      : 20,
    right    : 20,
    zIndex:95,
  },
});
