import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Button,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class CreateLocationButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  addLocation(){
    alert("toto")
  }
  render() {
    // if(!this.props.showAddTrip)
    //   return null
    return (

      <View style={styles.container}>
          <Button
            onPress={this.addLocation.bind(this)}
            title="+"
            color="#841584"
            accessibilityLabel="+"
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
