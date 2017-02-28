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

export default class TakePictureButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  addLocation(){
    alert("takePicture")
  }
  render() {
    if(!this.props.isEditingMyTrip)
      return null
    if(!this.props.trip.key)
      return null
    return (
      <View style={styles.container}>
          <Button
            onPress={this.addLocation.bind(this)}
            title="✚ Picture"
            color="#841584"
            accessibilityLabel="✚ Picture"
          />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position    : 'absolute',
    bottom      : 100,
    right       : 20,
  }
});
