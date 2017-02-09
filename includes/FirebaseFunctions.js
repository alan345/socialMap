import React, {Component} from 'react';
import ReactNative from 'react-native';
const { View, TouchableHighlight, Text } = ReactNative;
import * as firebase from 'firebase';
import Firebase from "./firebase";
import flagBlackImg from '../assets/flag-black.png';

class FirebaseFunctions extends Component {

  render() {
    return (
      <View></View>
    )
  }


  getRef() {
     return firebase.database().ref();
  }
  getRefLocations() {
     return this.getRef().child('locations');
  }
  getRefUsers() {
     return this.getRef().child('users');
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

  updateLocationToFirebase(marker) {
    let itemsRef = this.getRefLocations();
    console.log(marker)
    itemsRef.child(marker.key).set({
        title: "title",
        coordinates: marker.coordinate,
        coordinateGoogleAddress: marker.coordinateGoogleAddress,
        address: marker.address,
        description: marker.description,
        country: marker.country,
        city: marker.city,
        image: flagBlackImg,
        imagePin: marker.imagePin,
        datePin:  marker.datePin,
        userData: marker.userData,
      });
  }

  deleteLocationToFirebase(marker) {
    let itemsRef = this.getRefLocations();
    itemsRef.child(marker.key).remove()
  }


  addLocationToFirebase(marker) {
    let itemsRef = this.getRefLocations();
    itemsRef.push({
      title: "title",
      coordinates: marker.coordinate,
      coordinateGoogleAddress: marker.coordinateGoogleAddress,
      address: marker.address,
      description: marker.description,
      country: marker.country,
      city: marker.city,
      image: flagBlackImg,
      imagePin: marker.imagePin,
      datePin:  marker.datePin,
      userData: marker.userData,
    });
  }
}

module.exports = FirebaseFunctions;
