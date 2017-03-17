import React, {Component} from 'react';
import ReactNative from 'react-native';
const { View, TouchableHighlight, Text } = ReactNative;
import * as firebase from 'firebase';
import Firebase from "./firebase";
import markerImg from '../assets/map_marker_default.png';

let instance = null;

/* Singleton service to hold FireBase functions and listeners */
class FirebaseFunctions2 {

  constructor() {
      if(!instance){
            instance = this;

            // Called once.
            this.tripsCache = [];
            console.log("initializing FirebaseFunctions");
            this.listenForTrips();
            this.observers = [];
      }
      return instance;
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

  // Listener for Trips.
  listenForTrips() {
      this.getRef().child('trips').on('value', (snap) => {
          this.tripsCache = [];
          snap.forEach((child) => {
              this.tripsCache.push({
                title: child.val().title,
                googleData: child.val().googleData,
                image: child.val().image,
                city: child.val().city,
                locations:child.val().locations,
                userData: child.val().userData,
                nbLocationsPerTrip: this.nbLocationsPerTrip(child.val()),
                isMyTrip: false, // @TODO : need fix
                key: child.key,
              });
          });
          this.notifyObservers("trip_changed", null);
      });
  }

  nbLocationsPerTrip(trip) {
    var size = 0, key;
    for (key in trip.locations) {
        if (trip.locations.hasOwnProperty(key)) size++;
    }
    return size;
  }

  isMyTrip(trip){
    let isMyTrip = false;
    if(trip.userData.id === this.props.userData.profile.id) {
      isMyTrip = true;
    } else {
      isMyTrip = false;
    }
    return isMyTrip
  }


  updateOrCreateUserToFirebase(userData) {
    let itemsRef = this.getRefUsers();
    itemsRef.orderByChild("profile/id").equalTo(userData.profile.id).on("value", function(snapshot) {
      if (snapshot.val()) {
        //update
        //console.log(snapshot.val())
      } else {
        itemsRef.push(userData);
      }
    });
  }

  getUser(credentials) {
    let itemsRef = this.getRefUsers();
    return new Promise(function(resolve,reject){
        itemsRef.orderByChild("profile/id").equalTo(credentials.userId).on("child_added", function(snapshot) {
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
    var component = this
    return new Promise(function(resolve,reject){
      let _trip = {
        title:trip.title,
        googleData:trip.googleData,
        image:trip.image,
        locations:trip.locations,
        userData:trip.userData,
      }
      let itemsRef = firebase.database().ref().child('trips');
      var newRef = itemsRef.push();
      var key = newRef.key;
      _trip.key = key
      component.updateTrip(_trip).then(function(trip){
        resolve(trip)
      })
    })
  }

  updateTrip(trip){
    return new Promise(function(resolve,reject){
      let itemsRef = firebase.database().ref().child('trips');
      itemsRef.child(trip.key).set({
        title: trip.title,
        image: trip.image,
        googleData: trip.googleData,
        userData: trip.userData,
        locations: trip.locations,
      });
      resolve(trip)
    })
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
          //    title: child.val().address_components.neighborhood,
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
          resolve(items)
        });
    })
  }



  updateLocationToFirebase(marker, tripId) {
    let itemsRef = this.getRefLocations(tripId);
    itemsRef.child(marker.key).set({
    //    title: marker.title,
        coordinates: marker.coordinates,
        googleData:marker.googleData,
        description: marker.description,
        image: markerImg,
        datePin:  marker.datePin,
      });
  }

  deleteLocationToFirebase(marker, tripId) {
    console.log(marker, tripId)
    let itemsRef = this.getRefLocations(tripId);
    itemsRef.child(marker.key).remove()
  }

  addOrUpdateLocation(marker, tripId){
    if(!marker.key ) {
      //console.log(marker, tripId)
      this.addLocationToFirebase(marker, tripId)
    } else {
    //  console.log(marker, tripId)
      this.updateLocationToFirebase(marker, tripId)
    }
  }

  addLocationToFirebase(marker, tripId) {
    let itemsRef = this.getRefLocations(tripId);
    itemsRef.push({
    //  title: marker.title,
      coordinates: marker.coordinates,
      googleData:marker.googleData,
      description: marker.description,
      image: markerImg,
      datePin: Date(),
    });
  }


/*
* Observer pattern
* See https://bumbu.github.io/javascript-observer-publish-subscribe-pattern/
*/

  addObserver(topic, observer) {
      this.observers[topic] || (this.observers[topic] = [])
      this.observers[topic].push(observer)
  }

  removeObserver(topic, observer) {

      if (!this.observers[topic])
        return;

      /*
      var index = this.observers[topic].indexOf(observer)

      console.log("removeObserver", this.observers, observer, index)

      if (~index) {
        this.observers[topic].splice(index, 1)
      }

      */

      // @todo: Not really correct because it removes all observers from a topic
      delete this.observers[topic];
  }

  notifyObservers(topic, message) {
      if (!this.observers[topic])
        return;

      for (var i = this.observers[topic].length - 1; i >= 0; i--) {
        this.observers[topic][i](message)
      };
  }

//----------------------------------------------------------------------------

}

module.exports = FirebaseFunctions2;
