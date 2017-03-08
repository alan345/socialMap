import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class TakePictureButton extends React.Component {

  takePicture(){
    this.props.capture()
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.takePicture.bind(this)}>
          <View
            title="Ø"
            style={styles.roundButton}>
               <Text style={styles.textInsideBuddon}>Ø</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position    : 'absolute',
    bottom      : 40,
    left        : width/2 - 25,
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
