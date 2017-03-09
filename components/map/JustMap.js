
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
  TouchableHighlight
} from 'react-native';
import markerImg from '../../assets/map_marker_default.png';
import MapStyle from "./MapStyle";
import MapView, {Marker} from 'react-native-maps';
import * as firebase from 'firebase';
import Firebase from "../../includes/firebase";

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import FirebaseFunctions from "../../includes/FirebaseFunctions";
import GoogleAPI from '../../includes/GoogleAPI';


import FBLoginView from '../FBLoginView';
import DetailsViews from '../locations/detailsViews/DetailsViews';
import ShowLoading from '../ShowLoading';
import BackToTripButton from './BackToTripButton';

import TakePictureButton from '../locations/TakePictureButton';
import SearchLocation from '../locations/SearchLocation';
import SaveToMyTripsButton from '../trips/SaveToMyTripsButton';
import EditMyTripButton from '../trips/EditMyTripButton';


import ShowTripTitle from '../trips/ShowTripTitle';


let keyId = 0

export default class JustMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      trip : {
        key:''
      },
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polylines: [],
      locations: [],

      selectedMarker: {
        key:'',

        googleData:{
          imagePin : 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
          address : '',
          address_components : {
            neighborhood:''
          },
          coordinateGoogleAddress : {
            latitude: LATITUDE,
            longitude: LONGITUDE,
          },
        },

        coordinates:{},
        coordinate : {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },

      },

    };
    this.onLongPressCreateMarker = this.onLongPressCreateMarker.bind(this);
    this.changeRegionAnimate = this.changeRegionAnimate.bind(this);

  }






    componentDidMount() {
      this.listenForItems();
      let component = this
      setTimeout(function(){
        component.changeRegionAnimate(component.props.trip)
      }, 1000);

    }

    listenForItems() {
     let locations = this.props.trip.locations
     arr = []
     for(var key in locations){
         var location = locations[key]
         location['key'] = key
         arr.push(location)
     }
     this.setState({
       locations: arr,
       isLoading:false,
     });
    }



    _updateLocationToFirebase(marker, tripId) {
      this._child.updateLocationToFirebase(marker, tripId)
    }

   _addLocationToFirebase(marker, tripId) {
     if(marker.key) {
       this._child.updateLocationToFirebase(marker, tripId)
     } else {
       this._child.addLocationToFirebase(marker, tripId)
     }
   }



    createOrUpdateMarker(e, marker) {
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
            coordinates: coordinates,
            title: "title",
            key:keyId++,
            coordinateGoogleAddress: coordinates,
            image: markerImg,
            googleData : {
              imagePin:'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
              address_components:{
                neighborhood:''
              }
            }

          }
        ]
      })

      this._childGoogleAPI.getDataFromGoogleAPiByCoordinates(coordinates).then(function(marker){
        marker.key = key
        marker.datePin = Date()
        marker.description = ""
      //  marker.userData = component.props.userData
        //marker.title = marker.googleData.address_components.route
        component._addLocationToFirebase(marker, component.state.trip.key);
        component.listenForItems()
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

    onSetPositionDetails(position){
      this._childDetailsViews.onSetPositionDetails(position)
    }

    onSelecetTrip(item) {
      let isTripSelectedIsMine = false;
      if(item.userData.id == this.props.userData.id) {
        isTripSelectedIsMine = true;
      } else {
        isTripSelectedIsMine = false;
      }

      this.setState({
        trip:item,
        isTripSelectedIsMine:isTripSelectedIsMine,
      },function(){
        this.listenForItems();
      })
      this.changeRegionAnimate(item)
    }

    onPressDeleteMarker(marker){
      this._child.deleteLocationToFirebase(marker, this.state.trip.key)
    }
    onMarkerSelected(item) {
      this.listenForItems();
      this.changeRegionAnimate(item)
    }
    changeRegionAnimate(item) {

      let newRegion = {
        ...this.state.region,
        latitude: item.googleData.coordinateGoogleAddress.latitude,
        longitude: item.googleData.coordinateGoogleAddress.longitude,
      }
      this.map.animateToRegion(newRegion);
    }

    onPressMarker(location){

      this.setState({
        selectedMarker: location
      })
      this._childDetailsViews.onShowDetails()
    }

    onEditTripMode(editTripMode = true){
      this.setState({isEditingMyTrip:editTripMode})
    }

    saveTrip(trip){
      this.t._addTripToFireBase(component.state.trip)
    }

    capture(){
      this.props.navigator.replace({
          name: 'capture'
      });
    }
    goToListTrips(){
      this.props.navigator.replace({
          name: 'listTrips'
      });
    }


  render() {
    return (
      <View style={styles.container}>
        <FirebaseFunctions ref={(child) => { this._child = child; }} />
        <GoogleAPI ref={(child) => { this._childGoogleAPI = child; }} />

            <MapView
              ref={ref => { this.map = ref; }}
              provider={this.props.provider}
              style={styles.map}
              initialRegion={this.state.region}
              showsUserLocation = {true}
              onLongPress = {this.onLongPressCreateMarker}
              onPress = {this.onPressMap.bind(this)}
              customMapStyle={MapStyle}
            >
              {this.state.locations.map((location,i) =>{
                return (
                  <MapView.Marker
                    key={location.key}
                    coordinate={location.coordinates}
                    onPress={()=>{this.onPressMarker(location)}}
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
            <BackToTripButton
              goToListTrips={this.goToListTrips.bind(this)}
            />
            <ShowLoading
              isLoading={this.state.isLoading}
            />
            <ShowTripTitle
              trip={this.props.trip}
              isEditingMyTrip={this.state.isEditingMyTrip}
            />
            <SaveToMyTripsButton
              isTripSelectedIsMine={this.state.isTripSelectedIsMine}
              trip={this.state.trip}
              isEditingMyTrip={this.state.isEditingMyTrip}
              onEditTripMode={this.onEditTripMode.bind(this)}
              userData={this.props.userData}
              onSelecetTrip={this.onSelecetTrip.bind(this)}
            />
            <EditMyTripButton
              trip={this.state.trip}
              isEditingMyTrip={this.state.isEditingMyTrip}
              onEditTripMode={this.onEditTripMode.bind(this)}
              userData={this.props.userData}
              isTripSelectedIsMine={this.state.isTripSelectedIsMine}
            />
            <SearchLocation
              trip={this.state.trip}
              isEditingMyTrip={this.state.isEditingMyTrip}
              onPressMarker={this.onPressMarker.bind(this)}
              onMarkerSelected={this.onMarkerSelected.bind(this)}
              onSetPositionDetails={this.onSetPositionDetails.bind(this)}
            />
            <TakePictureButton
              trip={this.state.trip}
              isEditingMyTrip={this.state.isEditingMyTrip}
              onPressMarker={this.onPressMarker.bind(this)}
              onSetPositionDetails={this.onSetPositionDetails.bind(this)}
              capture={this.capture.bind(this)}
            />
            <DetailsViews
              selectedMarker={this.state.selectedMarker}
              trip={this.props.trip}
              onMarkerSelected={this.onMarkerSelected.bind(this)}
              onPressDeleteMarker={this.onPressDeleteMarker.bind(this)}
              changeRegionAnimate={this.changeRegionAnimate}
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
