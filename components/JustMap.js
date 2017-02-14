
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
import markerImg from '../assets/flag-black.png';

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
import GoogleAPI from '../includes/GoogleAPI';


// const SideMenu = require('react-native-side-menu');
// const Menu = require('./Menu');
import FBLoginView from './FBLoginView';
import DetailsViews from './DetailsViews';
import ShowLoading from './ShowLoading';


let keyId = 0

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
      polylines: [],
      locations: [],
      isLoading : true,
      selectedMarker: {
        key:'',
        address : '',
        imagePin : '',
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
    this.itemsRef = this.getRef().child('locations');
  }


    getRef() {
       return firebase.database().ref();
    }

    listenForItems() {

      // NICO NEEDS HELP.

      // component = this;
      // this._child.getLocations().then(function(items){
      //   console.log(items)
      //   component.setState({
      //     dataSource: component.state.dataSource.cloneWithRows(items),
      //     locations: items,
      //     isLoading:false,
      //   });
      // })

      let queryMyMap = this.itemsRef.orderByChild("userData/id").equalTo("10158181137300068")
      let querySearch = this.itemsRef.orderByChild("city").equalTo("San Francisco")
      let queryToUse

      if(this.props.isMyMaps) {
        queryToUse = queryMyMap
      } else {
        queryToUse = querySearch
      }
       queryToUse.on('value', (snap) => {
         var items = [];
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
            key:keyId++,
            coordinateGoogleAddress: coordinates,
            image: markerImg,
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

      this._childGoogleAPI.getDataFromGoogleAPiByCoordinates(coordinates).then(function(data){
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
      this.createOrUpdateMarker(e, {})
    }


    onPressMap(){
      this._childDetailsViews.onReduceDetails()
    }


  render() {
    return (
      <View style={styles.container}>
        <FirebaseFunctions ref={(child) => { this._child = child; }} />
        <GoogleAPI ref={(child) => { this._childGoogleAPI = child; }} />


            <MapView
              provider={this.props.provider}
              style={styles.map}
              initialRegion={this.state.region}
              showsUserLocation = {true}
              onLongPress = {this.onLongPressCreateMarker}
              onPress = {this.onPressMap.bind(this)}
            >
              {this.state.locations.map((location,i) =>{
                return (
                  <MapView.Marker
                    key={location.key}
                    onPress={() => {this.setState({
                    //  showDetailsList: true,
                      selectedMarker: location
                    })
                    this._childDetailsViews.onSetPositionDetails(1)

                  }}
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
              ref={(child) => { this._childDetailsViews = child; }}
            />
      </View>
    );
  }
}


const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    marker: {
      marginTop: 0,
    },
    map: {
     ...StyleSheet.absoluteFillObject,
    },
});
