import React, {Component} from 'react';
import ReactNative from 'react-native';
const { View, TouchableHighlight, Text } = ReactNative;
import * as firebase from 'firebase';
import Firebase from "./firebase";
import markerImg from '../assets/flag-black.png';

class GoogleAPI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlGoogpleApi :     'https://maps.google.com/maps/api/',
      urlGoogpleApiAPI :  'https://maps.googleapis.com/maps/api/',
      googleKey :         'AIzaSyAYPpKi0JDHdmhIuuuVndD96VEyavNAlHY',
    }
    this.getDataFromGoogleAPiByCoordinates = this.getDataFromGoogleAPiByCoordinates.bind(this);
  }


  getDataFromGoogleAPiByCoordinates(data) {
    component = this;
    return new Promise(function(resolve,reject){
      let urlGoogleGeocode = component.state.urlGoogpleApi + 'geocode/json'
      let coordinatesGoogle = data.latitude + "," + data.longitude
      let urlFetch = urlGoogleGeocode + '?latlng=' + coordinatesGoogle + '&key=' + component.state.googleKey

      fetch(urlFetch)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.status == "OK") {
            let coordinatesGoogle = responseJson.results[0].geometry.location.lat + "," + responseJson.results[0].geometry.location.lng
            let coordinates = {
              latitude:  responseJson.results[0].geometry.location.lat,
              longitude:  responseJson.results[0].geometry.location.lng,
            }
            let imagePin = component.state.urlGoogpleApiAPI + "streetview?size=600x300&location=" + coordinatesGoogle + "&heading=151.78&pitch=-0.76&key=" + component.state.googleKey
            responseJson.results[0].imagePin = imagePin
            responseJson.results[0].coordinateNative = data
            responseJson.results[0].coordinate = coordinates
            resolve(responseJson.results[0])
        }
      })
      .catch((error) => {
        console.error(error);
      });
    })
  }

  getDataFromGoogleAPiByAddress(data){
    return new Promise(function(resolve,reject){
      let urlGoogpleApi = 'https://maps.google.com/maps/api/'
      let urlGoogpleApiAPI = 'https://maps.googleapis.com/maps/api/'
      let urlGoogleGeocode = urlGoogpleApi + 'geocode/json'
      let googleKey = 'AIzaSyAYPpKi0JDHdmhIuuuVndD96VEyavNAlHY'
      let urlFetch = ""
      if(typeData == "address") {
        urlFetch = urlGoogleGeocode + '?address=' + data + '&key=' + googleKey
      } else if(typeData == "coordinates") {
        let coordinatesGoogle = data.latitude + "," + data.longitude
        urlFetch = urlGoogleGeocode + '?latlng=' + coordinatesGoogle + '&key=' + googleKey
      }

      fetch(urlFetch)
      .then((response) => response.json())
      .then((responseJson) => {

        if(responseJson.status == "OK") {
            let coordinatesGoogle = responseJson.results[0].geometry.location.lat + "," + responseJson.results[0].geometry.location.lng
            let coordinates = {
              latitude:  responseJson.results[0].geometry.location.lat,
              longitude:  responseJson.results[0].geometry.location.lng,
            }
            let imagePin = urlGoogpleApiAPI + "streetview?size=600x300&location=" + coordinatesGoogle + "&heading=151.78&pitch=-0.76&key=" + googleKey
            responseJson.results[0].imagePin = imagePin
            responseJson.results[0].coordinateNative = data
            responseJson.results[0].coordinate = coordinates
            resolve(responseJson.results[0])
        }
      })
      .catch((error) => {
        console.error(error);
      });
    })
  }


  render() {
    return (
      <View></View>
    )
  }

}

module.exports = GoogleAPI;
