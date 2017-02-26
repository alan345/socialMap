import React, {Component} from 'react';
import ReactNative from 'react-native';
const { View, TouchableHighlight, Text } = ReactNative;
import * as firebase from 'firebase';
import Firebase from "./firebase";
import markerImg from '../assets/flag-black.png';

class FirebaseFunctions extends Component {

  render() {
    return (
      <View/>
    )
  }


  getRef() {
     return firebase.database().ref();
  }
  getRefLocations(tripId) {
     return this.getRef().child('trips').child(tripId).child('locations');
  }
  getRefUsers() {
     return this.getRef().child('users');
  }
  getRefTrips() {
     return this.getRef().child('trips');
  }

  updateOrCreateUserToFirebase(userData) {
    let itemsRef = this.getRefUsers();
    itemsRef.orderByChild("id").equalTo(userData.profile.id).on("value", function(snapshot) {
      if (snapshot.val()) {
        //update
        //console.log(snapshot.val())
      } else {
        itemsRef.push(userData.profile);
      }
    });
  }

  getUser(credentials) {
    let itemsRef = this.getRefUsers();
    return new Promise(function(resolve,reject){
        itemsRef.orderByChild("id").equalTo(credentials.userId).on("child_added", function(snapshot) {
          resolve( snapshot.val())
        });
    })
  }


  addOrUpdateTrip(trip){
    if(trip.key == null  ) {
      this.addTrip(trip)
    } else {
      this.updateTrip(trip)
    }
  }

  addTrip(trip){
    let itemsRef = this.getRefTrips();
    delete trip.key
    itemsRef.push(trip);
  }

  updateTrip(trip){
    let itemsRef = this.getRefTrips();
    itemsRef.child(trip.key).set({
        title: trip.title,
        image: trip.image,
        city: trip.city,
      });
  }
  deleteTrip(trip){
    let itemsRef = this.getRefTrips();
    itemsRef.child(trip.key).remove()
  }


  getLocations() {
    let itemsRef = this.getRefLocations();
    return new Promise(function(resolve,reject){
        itemsRef.on('value', (snapshot) => {
          var items = [];
          snapshot.forEach((child) => {
            items.push({
              title: child.val().address_components.neighborhood,
              address_components: child.val().address_components,
              coordinate: child.val().coordinates,
              coordinateGoogleAddress: child.val().coordinateGoogleAddress,
              key: child.getKey(),
              address: child.val().address,
              description: child.val().description,
              image: child.val().image,
              imagePin: child.val().imagePin,
              datePin:  child.val().datePin,
              userData:  child.val().userData,

            });
          });
          resolve( items)
        });
    })
  }



  updateLocationToFirebase(marker, tripId) {
    let itemsRef = this.getRefLocations(tripId);
    itemsRef.child(marker.key).set({
        title: marker.title,
        coordinates: marker.coordinates,
        googleData:marker.googleData,
        description: marker.description,
        image: markerImg,
        datePin:  marker.datePin,
      });
  }

  deleteLocationToFirebase(marker, tripId) {
    let itemsRef = this.getRefLocations(tripId);
    itemsRef.child(marker.key).remove()
  }


  addLocationToFirebase(marker, tripId) {
    let itemsRef = this.getRefLocations(tripId);
    itemsRef.push({
      title: marker.title,
      coordinates: marker.coordinate,
      googleData:marker.googleData,
      description: marker.description,
      image: markerImg,
      datePin:  marker.datePin,
    });
  }
}

module.exports = FirebaseFunctions;
