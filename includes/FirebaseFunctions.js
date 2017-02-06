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
  static getRefLocations() {
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
        console.log(snapshot.val()  )
      } else {
      //  console.log(userData.profile )
      //  userData.profile.credentials = userData.credentials
        itemsRef.push(userData.profile);
      }
    });
  }

  getUser(credentials) {
    return new Promise(function(resolve,reject){
      let itemsRef = FirebaseFunctions.getRefUsers();

      itemsRef.orderByChild("id").equalTo(credentials.userId).on("child_added", function(snapshot) {

        resolve( snapshot.val())

      });
    })
  }

  static addLocationToFirebase(marker) {
    let itemsRef = FirebaseFunctions.getRefLocations();
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
      datePin:  marker.datePin
    });
  }

}

module.exports = FirebaseFunctions;
