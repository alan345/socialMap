
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
  TextInput
} from 'react-native';
import flagBlackImg from '../assets/flag-black.png';
import MapView, {Marker} from 'react-native-maps';
import ListItem from './ListItem';
import * as firebase from 'firebase';
import Firebase from "../includes/firebase";

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const SideMenu = require('react-native-side-menu');
const Menu = require('./Menu');

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
      showViewDetails : false,
      isLoading : true,
      selectedMarker: {
        key:"",
        address : "",
        coordinate : {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },
      },

      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.onLongPressCreateMarker = this.onLongPressCreateMarker.bind(this);
    this.onDrageEndMarker = this.onDrageEndMarker.bind(this);
    this.onPressMarker = this.onPressMarker.bind(this);
    this.onMapPress = this.onMapPress.bind(this);


    // firebase reference
    this.itemsRef = this.getRef().child('locations');
  }

    // firebase Example
    getRef() {
       return firebase.database().ref();
    }

    listenForItems(itemsRef) {
       itemsRef.on('value', (snap) => {
         var items = [];
         snap.forEach((child) => {
           items.push({
             title: child.val().title,
             coordinate: child.val().coordinates,
             key: child.getKey(),
             name: child.val().name,
             title: child.val().title,
             description: child.val().description,
             image: child.val().image,
             imagePin: child.val().imagePin,
             datePin:  child.val().datePin
           });
         });

         this.setState({
           dataSource: this.state.dataSource.cloneWithRows(items),
           locations: items
         });


     });
    }



    _setInitialPosition() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            region : {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            isLoading : false
          });
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
      );
    }





      onChangeselectedMarkerAddress(text) {
        if(text.text == '')
          return;

          if (typeof this.state.selectedMarker.key == "undefined")
            return;

          if (typeof this.state.selectedMarker == "undefined")
            return;

          if(this.state.selectedMarker.key == "")
            return;

        this.state.selectedMarker.address = text.text;
        this.forceUpdate()


          let urlGoogleGeocode = 'https://maps.google.com/maps/api/geocode/json'
          //let address = '1600+Amphitheatre+Parkway,+Mountain+View,+CA'
          let address = text.text
          let googleKey = 'AIzaSyDU3WcMEEugmd03GjG45fYCJ8nVqZJp9Fo'
          let urlFetch = urlGoogleGeocode + '?address=' + address + '&key=' + googleKey
          fetch(urlFetch)
          .then((response) => response.json())
          .then((responseJson) => {

            if(responseJson.status == "OK") {
              //let locations = this.state.locations;
              //let objIndex = locations.findIndex((obj => obj.key == this.state.selectedMarker.key));
              // locations[objIndex].coordinates.longitude = responseJson.results[0].geometry.location.lat
              // locations[objIndex].coordinates.latitude = responseJson.results[0].geometry.location.lat

              let coordinates = {
                latitude : responseJson.results[0].geometry.location.lat,
                longitude : responseJson.results[0].geometry.location.lng,
              }
              this._updateLocationToFirebase("toto", coordinates, this.state.selectedMarker.key)

              this.setState({
                region: {
                  latitude: responseJson.results[0].geometry.location.lat,
                  longitude: responseJson.results[0].geometry.location.lng,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                },
                selectedMarker : {
                  key:this.state.selectedMarker.key,
                  address: text.text,
                  coordinate : {
                    latitude: responseJson.results[0].geometry.location.lat,
                    longitude: responseJson.results[0].geometry.location.lng,
                  }
                }
              })
            }
          })
          .catch((error) => {
            console.error(error);
          });

    }



    componentWillMount() {
    //  this._setInitialPosition();
    }

    componentDidMount() {
      this.listenForItems(this.itemsRef);
    }



    _updateLocationToFirebase(title, coordinates, key) {
      if (typeof this.state.selectedMarker.key == "undefined") {
        return;
      }
      if (this.state.selectedMarker.key == "") {
        return;
      }

       this.itemsRef.child(key).set({
         title: title,
         coordinates: coordinates,
         name: 'New PinUPDATED',
         title: 'title',
         description: 'description',
         image: flagBlackImg,
         imagePin: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/3/005/01b/27a/240ddec.jpg',
         datePin:  Date()
        });
    }

   _addLocationToFirebase(title, coordinates) {
      this.itemsRef.push({
        title: title,
        coordinates: coordinates,
        name: 'New Pin',
        title: 'title',
        description: 'description',
        image: flagBlackImg,
        imagePin: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/3/005/01b/27a/240ddec.jpg',
        datePin:  Date()
       });
   }

    onDrageEndMarker(e) {
      this.setState({ x: e.nativeEvent.coordinate })

    }

    onPressMarker() {


      if (typeof this.state.selectedMarker.key == "undefined")
        return;

      if (typeof this.state.selectedMarker == "undefined")
        return;

      if(this.state.selectedMarker.key == "")
        return;


        this.state.showViewDetails = true;
        this.state.region = {
              latitude: this.state.selectedMarker.coordinate.latitude,
              longitude: this.state.selectedMarker.coordinate.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,

        }

    }

    onMapPress(e)
    {
      this.state.showViewDetails = false;
      this.forceUpdate()
    }

    onLongPressCreateMarker(e) {

      this.setState({
        markers: [
          ...this.state.markers,
          {
            coordinate: e.nativeEvent.coordinate,

            name: 'New Pin',
            title: 'title',

            image: flagBlackImg,
            imagePin: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/3/005/01b/27a/240ddec.jpg',
            datePin:  Date(),
          },
        ],
        region: {
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }
      });


      this._addLocationToFirebase('test', e.nativeEvent.coordinate);

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

  render() {
    return (
      <View style={styles.container}>

            <MapView
              provider={this.props.provider}
              style={styles.map}
              region={this.state.region}
              showsUserLocation = {true}
              onLongPress = {this.onLongPressCreateMarker}
              onPress = {this.onMapPress}
            >



              {this.state.locations.map((location,i) =>{

                return (
                  <MapView.Marker
                    key={location.key}
                    onPress={() => {this.setState({selectedMarker: location})}}
                    onMarkerPress={this.onPressMarker()}
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




            <View style={[styles.eventList, this.state.showViewDetails ? {} : styles.eventListHidden ]}>
              <ScrollView>
                  <Text>Key: {this.state.selectedMarker.key}</Text>

                  <TextInput
                    onChangeText={(text) => this.onChangeselectedMarkerAddress({text})}
                    value={this.state.selectedMarker.address}
                  />
                  <Text>Coordinates: {this.state.selectedMarker.coordinate.latitude}</Text>
                  <Text>Coordinates: {this.state.selectedMarker.coordinate.longitude}</Text>
                </ScrollView>
            </View>
            <View style={styles.showLoading}>
              <ScrollView>
                  {this.state.isLoading ? (
                    <Image
                      style={styles.imageLoading}
                      source={require('../assets/loading.png')}
                    />
                  ) : (
                    <Text></Text>
                  )}
                </ScrollView>
            </View>


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
      marginLeft: -18,
      marginTop: 0,
    },
    eventList: {

      top: 0,
      left: 0,
      right: 0,
      bottom: height /1.7,
      backgroundColor: '#F5FCFF',
      width: width/1.4
    },
    showLoading: {
      position: 'absolute',
      top: 0,

      right: width/2,

    },
    eventListHidden: {
      position: 'absolute',
      top: height ,
      left: 0,
      right: 0,
      bottom: 0,
    },
    imageLoading: {
      width: 30,
      height: 30,
    },
    scrollview: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    map: {
     ...StyleSheet.absoluteFillObject,
    },
});
