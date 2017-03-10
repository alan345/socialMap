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

export default class BackToDetailsTripButton extends Component {
  onPressBackToTripButton(){
    this.props.goToListTrips()
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.props.showDetailsTrip}>
          <View
            title="←"
            style={styles.roundButton}>
               <Text style={styles.textInsideBuddon}>←</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
  roundButton: {
    borderRadius: 40,
    backgroundColor: '#841584',
    height: 40,
    width: 40,
    paddingTop:2
  },
  textInsideBuddon:{
    color:"#ffffff",
    textAlign: 'center',
    fontSize: 22
  }
});
