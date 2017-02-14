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
      urlGoogpleApiImage :  'https://maps.googleapis.com/maps/api/',
      googleKey :         'AIzaSyAYPpKi0JDHdmhIuuuVndD96VEyavNAlHY',
    }
    this.getDataFromGoogleAPiByCoordinates = this.getDataFromGoogleAPiByCoordinates.bind(this);
  }


  getDataFromGoogleAPiByCoordinates(dataCoordinatesNative) {
    component = this;
    return new Promise(function(resolve,reject){
      let urlGoogleGeocode = component.state.urlGoogpleApi + 'geocode/json'
      let coordinatesGoogle = dataCoordinatesNative.latitude + "," + dataCoordinatesNative.longitude
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
            let imagePin = component.state.urlGoogpleApiImage + "streetview?size=600x300&location=" + coordinatesGoogle + "&heading=151.78&pitch=-0.76&key=" + component.state.googleKey
            let marker = {
              address_components:{}
            }
            marker.imagePin = imagePin
            marker.coordinateGoogleAddress = coordinates
            marker.coordinate = dataCoordinatesNative
            marker.address = responseJson.results[0].formatted_address


            responseJson.results[0].address_components.forEach(function(element) {
            //  console.log(element)
              if(element.types[0] == "street_number")
                marker.address_components.street_number = element.long_name
              if(element.types[0] == "route")
                marker.address_components.route = element.long_name
              if(element.types[0] == "neighborhood")
                marker.address_components.neighborhood = element.long_name
              if(element.types[0] == "locality")
                marker.address_components.locality = element.long_name
              if(element.types[0] == "administrative_area_level_1")
                marker.address_components.administrative_area_level_1 = element.long_name
              if(element.types[0] == "country")
                marker.address_components.country = element.long_name
              if(element.types[0] == "postal_code")
                marker.address_components.postal_code = element.long_name
            });
          //  console.log(marker)
            resolve(marker)
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
      let urlGoogpleApiImage = 'https://maps.googleapis.com/maps/api/'
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
            let imagePin = urlGoogpleApiImage + "streetview?size=600x300&location=" + coordinatesGoogle + "&heading=151.78&pitch=-0.76&key=" + googleKey
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
