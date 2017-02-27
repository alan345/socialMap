import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
} from 'react-native';
import ShowLoading from '../ShowLoading';
import AutocompleteAddress from "../../includes/AutocompleteAddress";
import FirebaseFunctions from "../../includes/FirebaseFunctions";

const { width, height } = Dimensions.get('window');

export default class ShowTripTitle extends Component {


  render() {
    if(!this.props.trip.key)
      return null

    return (

      <View style={styles.container}>
        <Text>{this.props.trip.title}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top:0,
    width: width/1.3,

    paddingLeft:40,
    paddingRight:40,
    backgroundColor: '#F5FCFF',
  },
});
