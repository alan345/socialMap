/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import socialMap from './socialMap';
import JustMap from './components/JustMap';
//import Contacts from './components/Contacts';


AppRegistry.registerComponent('socialMap', () => socialMap);

AppRegistry.registerComponent('JustMap', () => JustMap);


//AppRegistry.registerComponent('Contacts', () => Contacts);
