
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Button,
  Dimensions,
  ScrollView,
  Image,
  TextInput,
  TouchableHighlight
} from 'react-native';
import flagBlackImg from '../assets/flag-black.png';
import MapView, {Marker} from 'react-native-maps';
//import ListItem from './ListItem';
import * as firebase from 'firebase';
import Firebase from "../includes/firebase";

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import FirebaseFunctions from "../includes/FirebaseFunctions";

// const SideMenu = require('react-native-side-menu');
// const Menu = require('./Menu');
import FBLoginView from './FBLoginView';
import DetailsViews from './DetailsViews';
import ShowLoading from './ShowLoading';



export default class JustMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },

      markers: [],
      polylines: [],
      locations: [],
      showDetailsList: false,
      isLoading : true,
      selectedMarker: {
        key:"",
        address : "",
        imagePin : "",
        coordinate : {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },
        coordinateGoogleAddress : {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },
        userData: {
          picture: {
            data: {
              url: ''
            }
          }
        }
      },

      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.onLongPressCreateMarker = this.onLongPressCreateMarker.bind(this);


    // firebase reference
    this.itemsRef = this.getRef().child('locations');

  }

    // firebase Example
    getRef() {
       return firebase.database().ref();
    }

    listenForItems() {
      // component = this;
      // this._child.getLocations().then(function(items){
      //   console.log(items)
      //   component.setState({
      //     dataSource: component.state.dataSource.cloneWithRows(items),
      //     locations: items,
      //     isLoading:false,
      //   });
      // })


       this.itemsRef.on('value', (snap) => {
         var items = [];
         console.log(snap)
         snap.forEach((child) => {
           items.push({
             title: child.val().city,
             city: child.val().city,
             country: child.val().country,
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

         this.setState({
           dataSource: this.state.dataSource.cloneWithRows(items),
           locations: items,
           isLoading:false,
         });
     });
    }




      getDataFromGoogleAPi(data, typeData) {
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

              // console.log(responseJson.results[0])
              // return responseJson.results[0];
            }
          })
          .catch((error) => {
            console.error(error);
          });
        })
      }



      onChangeAddressInput() {
        component = this;
        this.getDataFromGoogleAPi(this.state.selectedMarker.address, "address").then(function(data){

          let marker= {
            key: component.state.selectedMarker.key,
            address : data.formatted_address,
            imagePin: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/3/005/01b/27a/240ddec.jpg',

            coordinate : {
              latitude : data.geometry.location.lat,
              longitude : data.geometry.location.lng,
            }
          }
          component._updateLocationToFirebase(marker);
        })
      }


    componentDidMount() {
      this.listenForItems();
    }





    _updateLocationToFirebase(marker) {
      this._child.updateLocationToFirebase(marker)
    }

   _addLocationToFirebase(marker) {
     if(marker.key) {
       this._child.updateLocationToFirebase(marker)
     } else {
       this._child.addLocationToFirebase(marker)
     }
   }




    createOrUpdateMarker(e, marker) {
      if(!this.props.userData.id) {
        alert("You must be logged !")
        return;
      }
      let key=""
      if(marker)
        key = marker.key

      this.setState({isLoading:true})
      var component = this;
    //  let coordinatesGoogle = e.nativeEvent.coordinate.latitude + "," + e.nativeEvent.coordinate.longitude
      let coordinates = {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      }

      this.setState({
        locations: [
          ...this.state.locations,
          {
            coordinate: coordinates,
            title: "title",
            key:"toto",
            // coordinates: marker.coordinate,
            coordinateGoogleAddress: coordinates,
            // address: marker.address,
            // description: marker.description,
            // country: marker.country,
            // city: marker.city,
            image: flagBlackImg,
            // imagePin: marker.imagePin,
            // datePin:  marker.datePin,
            // userData: marker.userData,
            userData: {
              picture: {
                data: {
                  url: ''
                }
              }
            }

          }
        ]

      })

      this.getDataFromGoogleAPi(coordinates, "coordinates").then(function(data){
        let marker= {
          key:key,
          address : data.formatted_address,
          imagePin: data.imagePin,
          city: data.address_components[3].long_name,
          country:data.address_components[6].long_name,
          datePin: Date(),
          description: "",
          coordinate : data.coordinateNative,
          coordinateGoogleAddress : data.coordinate,
          userData: component.props.userData,
        }
      //  component.setState({selectedMarker : marker})

      //  console.log(marker)
        component._addLocationToFirebase(marker);
      })



      const { editing } = this.state;
      if (!editing) {
        this.setState({
          editing: {
            coordinates: [e.nativeEvent.coordinate],
          },
        });
      } else {
        this.setState({
          editing: {
            ...editing,
            coordinates: [
              ...editing.coordinates,
              e.nativeEvent.coordinate,
            ],
          },
        });
      }

    }

    onLongPressCreateMarker(e) {
      console.log(this.state.polylines)
      this.createOrUpdateMarker(e, {})
    }





  render() {
    return (
      <View style={styles.container}>
        <FirebaseFunctions ref={(child) => { this._child = child; }} />
            <MapView
              provider={this.props.provider}
              style={styles.map}
              initialRegion={this.state.region}
              showsUserLocation = {true}
              onLongPress = {this.onLongPressCreateMarker}
              onPress = {() => {this.setState({
                showDetailsList: false
              })}}
            >
              {this.state.locations.map((location,i) =>{
                return (
                  <MapView.Marker
                    key={location.key}
                    onPress={() => {this.setState({
                      showDetailsList: true,
                      selectedMarker: location
                    })}}
                    onDragEnd={(e) => {
                      this.createOrUpdateMarker(e, location);
                    }}

                    draggable
                    {... location}
                    >
                      <View style={styles.marker}>
                        <Text style={styles.text}>{location.name}</Text>
                      </View>
                  </MapView.Marker>
                )
              })}

              {this.state.polylines.map(polyline => (
                <MapView.Polyline
                  key={polyline.id}
                  coordinates={polyline.coordinates}
                  strokeColor="#F00"
                  fillColor="rgba(255,0,0,0.5)"
                  strokeWidth={1}
                />
              ))}
              {this.state.editing &&
                <MapView.Polyline
                  key="editingPolyline"
                  coordinates={this.state.editing.coordinates}
                  strokeColor="#808080"
                  fillColor="rgba(255,0,0,0.5)"
                  strokeWidth={5}
                />
              }
            </MapView>

            <ShowLoading
              isLoading={this.state.isLoading}
            />
            <DetailsViews
              selectedMarker={this.state.selectedMarker}
              showDetailsList={this.state.showDetailsList}
            />

      </View>
    );
  }
}


JustMap.propTypes = {
    provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    marker: {
    //  marginLeft: -18,
      marginTop: 0,
    },
    map: {
     ...StyleSheet.absoluteFillObject,
    },
});
