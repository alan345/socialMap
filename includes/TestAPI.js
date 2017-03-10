import React, {Component} from 'react';
import ReactNative from 'react-native';

let instance = null;

class TestAPI {

  //

  constructor() {
      if(!instance){
            instance = this;
      }
      return instance;

  }

  callTest() {
        console.log("Test API called");
  }

}

module.exports = TestAPI;
