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
              googleData:{
                address_components:{},
                address:'',
                coordinateGoogleAddress:{},
                imagePin:imagePin,
              },

            }

            marker.coordinates = dataCoordinatesNative
            marker.googleData.coordinateGoogleAddress = coordinates
            marker.googleData.address = responseJson.results[0].formatted_address


            responseJson.results[0].address_components.forEach(function(element) {
            //  console.log(element)
              if(element.types[0] == "street_number")
                marker.googleData.address_components.street_number = element.long_name
              if(element.types[0] == "route")
                marker.googleData.address_components.route = element.long_name
              if(element.types[0] == "neighborhood")
                marker.googleData.address_components.neighborhood = element.long_name
              if(element.types[0] == "locality")
                marker.googleData.address_components.locality = element.long_name
              if(element.types[0] == "administrative_area_level_1")
                marker.googleData.address_components.administrative_area_level_1 = element.long_name
              if(element.types[0] == "country")
                marker.googleData.address_components.country = element.long_name
              if(element.types[0] == "postal_code")
                marker.googleData.address_components.postal_code = element.long_name
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
    console.log(data)
    component = this;
    return new Promise(function(resolve,reject){
      let urlGoogleGeocode = component.state.urlGoogpleApi + 'geocode/json'
      let googleKey = 'AIzaSyAYPpKi0JDHdmhIuuuVndD96VEyavNAlHY'
      let urlFetch = urlGoogleGeocode + '?address=' + data + '&key=' + googleKey

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
            googleData:{
              address_components:{},
              address:'',
              coordinateGoogleAddress:{},
              imagePin:imagePin,
            },
          }
          console.log(responseJson.results)
          marker.coordinates = coordinates
          marker.googleData.coordinateGoogleAddress = coordinates
          marker.googleData.address = responseJson.results[0].formatted_address


          responseJson.results[0].address_components.forEach(function(element) {
          //  console.log(element)
            if(element.types[0] == "street_number")
              marker.googleData.address_components.street_number = element.long_name
            if(element.types[0] == "route")
              marker.googleData.address_components.route = element.long_name
            if(element.types[0] == "neighborhood")
              marker.googleData.address_components.neighborhood = element.long_name
            if(element.types[0] == "locality")
              marker.googleData.address_components.locality = element.long_name
            if(element.types[0] == "administrative_area_level_1")
              marker.googleData.address_components.administrative_area_level_1 = element.long_name
            if(element.types[0] == "country")
              marker.googleData.address_components.country = element.long_name
            if(element.types[0] == "postal_code")
              marker.googleData.address_components.postal_code = element.long_name
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


  render() {
    return (
      <View></View>
    )
  }

}

module.exports = GoogleAPI;
