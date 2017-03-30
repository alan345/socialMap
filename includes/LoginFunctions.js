import React, {Component} from 'react';
import ReactNative from 'react-native';
const { View, TouchableHighlight, Text } = ReactNative;
import * as firebase from 'firebase';
import Firebase from "./firebase";
import markerImg from '../assets/map_marker_default.png';

let instance = null;
let initUserData = {
    name : "",
    picture : {
      data : {
        url: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png'
      }
    }
}
/* Singleton service to hold FireBase functions and listeners */
class LoginFunctions {

  constructor() {

      if(!instance){
            this.UserData = {}
            // Called once.

            instance = this;
      }
      return instance
  }
  getRef() {
     return firebase.database().ref()
  }  
  saveUserData(updatedUserData){
    this.UserData = updatedUserData
    //console.log(updatedUserData)
  }
  getUserData(){
    return this.UserData
  }
  getRefUsers() {
     return this.getRef().child('users')
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
}

module.exports = LoginFunctions;
