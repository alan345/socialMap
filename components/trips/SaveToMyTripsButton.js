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

var firebaseFunctions = new FirebaseFunctions();


const { width, height } = Dimensions.get('window');
export default class SaveToMyTripsButton extends Component {

  saveToMyTrips(){

    let component = this
    let trip = this.props.trip
    delete trip.key
    if(!trip.locations)
      trip.locations={}
    trip.title = 'My trip: ' + this.props.trip.title
    //trip.userData = this.props.userData
    //this.props.onEditTripMode()


    firebaseFunctions.addTrip(trip).then(function(trip){
      console.log(trip)
      trip.isMyTrip =  true;
      component.props.onSelectTrip(trip)
    })
  }

  render() {
    if(this.props.isEditingMyTrip)
      return null
    if(this.props.trip.isMyTrip)
      return null


    return (
      <View style={styles.container}>
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
    // position: 'absolute',
    // bottom:0,
    // width: width,
    // padding : 40,
    // paddingBottom:25,
    // zIndex:0,
  },
})
