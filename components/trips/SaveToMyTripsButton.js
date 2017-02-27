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

export default class SaveToMyTripsButton extends Component {


  saveToMyTrips(){
    let trip = this.props.trip
    delete trip.key
    trip.title = 'My trip: ' + this.props.trip.title
    this.props.onEditTripMode()
    this._childFirebaseFunctions.addOrUpdateTrip(trip)
  }

  render() {
    if(!this.props.trip.key)
      return null
    if(this.props.isEditingMyTrip)
      return null
    return (

      <View style={styles.container}>
        <FirebaseFunctions ref={(child) => { this._childFirebaseFunctions = child; }} />
        <Button
          onPress={this.saveToMyTrips.bind(this)}
          title="Save to my Trips"
          color="#841584"
          accessibilityLabel="Save to my Trips"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom:0,
    width: width,
    padding : 40,
    paddingBottom:25,
  },
});
