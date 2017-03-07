import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

export default class AddTripButton extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.onPressButtonTrip}>
          <View
            title="✚"
            style={styles.roundButton}>
               <Text style={styles.textInsideBuddon}>+</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 30,
    bottom: 70,
    right: 15,
  },
  roundButton: {
    borderRadius: 40,
    backgroundColor: '#841584',
    height: 50,
    width: 50,
    paddingTop:10
  },
  textInsideBuddon:{
    color:"#ffffff",
    textAlign: 'center',
    fontSize: 22
  }
});
