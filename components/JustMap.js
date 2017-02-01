
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
      showViewDetails : false,
      isLoading : true,
      slectedMarker: {
        address : "",
        coordinates : {},
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

         console.log("items", items);
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





      onChangeslectedMarkerAddress(text) {

        this.state.slectedMarker.address = text.text;
        this.forceUpdate()
        if(text.text != '') {

          let urlGoogleGeocode = 'https://maps.google.com/maps/api/geocode/json'
          //let address = '1600+Amphitheatre+Parkway,+Mountain+View,+CA'
          let address = text.text
          let googleKey = 'AIzaSyDU3WcMEEugmd03GjG45fYCJ8nVqZJp9Fo'
          let urlFetch = urlGoogleGeocode + '?address=' + address + '&key=' + googleKey
          fetch(urlFetch)
          .then((response) => response.json())
          .then((responseJson) => {

            if(responseJson.status == "OK") {
              this.state.slectedMarker.coordinates.longitude = responseJson.results[0].geometry.location.lng;
              this.state.slectedMarker.coordinates.latitude = responseJson.results[0].geometry.location.lat;


              this.setState({
                region: {
                  latitude: responseJson.results[0].geometry.location.lat,
                  longitude: responseJson.results[0].geometry.location.lng,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }
              })
            }
          })
          .catch((error) => {
            console.error(error);
          });
        }
    }



    componentWillMount() {
      this._setInitialPosition();
    }

    componentDidMount() {
      this.listenForItems(this.itemsRef);
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

      // IDEM ICI. Je ne sais pas acualiser 1 marker precis dans la liste des markers
    }

    onPressMarker(e) {
      this.state.showViewDetails = true;
      this.setState({
        region: {
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }
      })
      this.forceUpdate()
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
            key: id++,
            name: 'New Pin',
            title: 'title',
            description: 'description' + id,
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

            <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderItem.bind(this)}
              enableEmptySections={true}
            />


            <View style={[styles.eventList, this.state.showViewDetails ? {} : styles.eventListHidden ]}>
              <ScrollView>
                  <Text>Details</Text>

                  <TextInput
                    onChangeText={(text) => this.onChangeslectedMarkerAddress({text})}
                    value={this.state.slectedMarker.address}
                  />
                  <Text>Coordinates: {this.state.slectedMarker.coordinates.latitude}</Text>
                  <Text>Coordinates: {this.state.slectedMarker.coordinates.longitude}</Text>
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
