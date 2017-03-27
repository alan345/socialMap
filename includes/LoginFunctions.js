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
            // Called once.
            super();
            this.state = {
                userData: {}
            }
            instance = this;
      }
      return instance
  }

}

module.exports = LoginFunctions;
