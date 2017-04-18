import React, {Component} from 'react';
import ReactNative from 'react-native';
const { View, TouchableHighlight, Text } = ReactNative;
import * as firebase from 'firebase';
import Firebase from "./firebase";
import LoginFunctions from "./LoginFunctions";

import markerImg from '../assets/map_marker_default.png';
var loginFunctions = new LoginFunctions();

// Prepare Blob support
import RNFetchBlob from 'react-native-fetch-blob'
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs

const OriginalBlob = window.Blob
const OriginalXMLHttpRequest = window.XMLHttpRequest

let instance = null;

/* Singleton service to hold FireBase functions and listeners */
class FirebaseFunctions {

  constructor() {
      if(!instance){
            instance = this;

            // Called once.
            this.tripsCache = []
            this.currentTrip = {}
            console.log("initializing FirebaseFunctions")
//            this.listenForTrips()
            this.observers = []
            this.storage = firebase.storage()
            this.storageRef = this.storage.ref('images')

      }
      return instance
  }

  getRef() {
     return firebase.database().ref()
  }

  getRefTrips() {
     return this.getRef().child('trips')
  }

  getRefLocations(tripId) {
    if (!tripId) {
       console.error('getRefLocations no tripId')
       return
    }
    return this.getRefTrips().child(tripId).child('locations')
  }

  getRefLocation (tripId, locationId) {
    if (!tripId || !locationId) {
      console.error('no tripId or locationId')
      return
    }
    return this.getRefLocations(tripId).child(locationId)
  }

  // Listener for Trips.
  listenForTrips () {
    this.getRef().child('trips').on('value', (snap) => {
      this.tripsCache = []
      snap.forEach((child) => {
        this.tripsCache.push({
          title: child.val().title,
          googleData: child.val().googleData,
          image: child.val().image,
          city: child.val().city,
          locations: child.val().locations,
          userData: child.val().userData,
          nbLocationsPerTrip: this.nbLocationsPerTrip(child.val()),
          isMyTrip: this.isMyTrip(child.val()),
          key: child.key
        })
      })
      this.notifyObservers('trips_changed', null)
      //console.log(this.tripsCache)
    })
  }

  // Listener for the current Trip
  listenTrip (tripKey) {
    if (!tripKey) {
      console.error('listenTrip no tripKey')
      return
    }
    this.getRef().child('trips').child(tripKey).on('value', (snapshot) => {
      this.currentTrip = snapshot.val()
      this.currentTrip.key = tripKey
      this.currentTrip.isMyTrip = this.isMyTrip(snapshot.val())
      console.log('listenTrip', this.currentTrip)
      this.notifyObservers('trip_changed', null)
    })
  }

  nbLocationsPerTrip (trip) {
    var size = 0, key
    for (key in trip.locations) {
        if (trip.locations.hasOwnProperty(key)) size++
    }
    return size
  }

  isMyTrip(trip){
    //console.log(loginFunctions.getUserData())
    let isMyTrip = false;
    if(trip.userData.profile.id === loginFunctions.getUserData().profile.id) {
      isMyTrip = true;
    } else {
      isMyTrip = false;
    }
    return isMyTrip
  }


  addOrUpdateTrip(trip){
    if(trip.key == null  ) {
      this.addTrip(trip)
    } else {
      this.updateTrip(trip)
    }
  }

  addTrip (trip) {
    var _this = this
    return new Promise(function (resolve, reject) {
      let _trip = {
        title: trip.title,
        googleData: trip.googleData,
        image: trip.image,
        locations: trip.locations,
        userData: loginFunctions.getUserData()
      }
      let itemsRef = firebase.database().ref().child('trips')
      var newRef = itemsRef.push()
      var key = newRef.key
      _trip.key = key
      _this.updateTrip(_trip).then(function (trip) {
        resolve(trip)
      })
    })
  }

  updateTrip (trip) {
    return new Promise(function (resolve, reject) {
      let itemsRef = firebase.database().ref().child('trips')
      itemsRef.child(trip.key).set({
        title: trip.title,
        image: trip.image,
        googleData: trip.googleData,
        userData: trip.userData,
        locations: trip.locations
      })
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
    if (!tripId) {
      console.error('updateLocationToFirebase no tripId')
      return
    }

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
    if (!tripId) {
        console.error('addOrUpdateLocation no tripId')
        return
    }

    if(!marker.key ) {
      console.log('addOrUpdateLocation', marker, tripId)
      this.addLocationToFirebase(marker, tripId)
    } else {
      console.log(marker, tripId)
      this.updateLocationToFirebase('addOrUpdateLocation', marker, tripId)
    }
  }

  addLocationToFirebase(marker, tripId) {
      return new Promise((resolve, reject) => {
          if (!tripId) {
            reject("no tripId");
          }

          let itemsRef = this.getRefLocations(tripId)

          let newRef = itemsRef.push({
          //  title: marker.title,
            coordinates: marker.coordinates,
            googleData: marker.googleData || null,
            description: marker.description || null,
            image: marker.image || null,
            datePin: Date(), // @deprecated
          })

          if(newRef) {
              console.log('newRef to sting', newRef.toString())
              resolve(newRef.key)
          }
          else {
              reject("The write operation failed")
          }
      })
  }

  updateLocationImage(tripId, locationId, imageUri) {
      let _this = this
      return new Promise(function(resolve, reject) {
          let locationRef = _this.getRefLocation(tripId, locationId)
          locationRef.update({
              image: imageUri
          })

          if(locationRef) {
              resolve()
          }
          else {
              reject("The write operation failed")
          }
      })
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

  // See : https://github.com/CodeLinkIO/Firebase-Image-Upload-React-Native
  // https://github.com/wkh237/rn-firebase-storage-upload-sample
  uploadImage(uri) {

      const timestamp = new Date().getTime()
      const filename = `test_${timestamp}.jpg`
      const timeout = 20 * 1000

      return new Promise((resolve, reject) => {
          if (!uri) {
             reject('no uri')
          }

          setTimeout(function(){
              reject(`timeout of ${timeout} exceeded`)
          }, timeout)


          window.Blob = RNFetchBlob.polyfill.Blob
          window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest

          Blob.build(RNFetchBlob.wrap(uri), { type: 'image/jpeg' })
              .then((blob) => {
                  var uploadTask = this.storageRef.child(filename).put(blob, { contentType : 'image/jpeg' })

                  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    function(snapshot) {
                      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      console.log('Upload is ' + progress + '% done');
                      switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                          console.log('Upload is paused');
                          break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                          console.log('Upload is running');
                          break;
                      }
                    }, function(error) {
                          // A full list of error codes is available at
                          // https://firebase.google.com/docs/storage/web/handle-errors
                          // console.error('uploadImage', error)
                          reject(error)

                  }, function() {
                    let downloadURL = uploadTask.snapshot.downloadURL
                    resolve(downloadURL)
                    // console.log('downloadURL', downloadURL)

                    // Workaround to fix Blob and Fetch conflict
                    window.Blob = OriginalBlob
                    window.XMLHttpRequest = OriginalXMLHttpRequest
                  })
              })
              .catch((error) => {
                  // console.error(error)
                  reject(error)

                  // Workaround to fix Blob and Fetch conflict
                  window.Blob = OriginalBlob
                  window.XMLHttpRequest = OriginalXMLHttpRequest
              })
      })

  }


}

module.exports = FirebaseFunctions;
