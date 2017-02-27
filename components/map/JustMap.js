
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
import markerImg from '../../assets/flag-black.png';

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


// const SideMenu = require('react-native-side-menu');
// const Menu = require('./Menu');
import FBLoginView from '../FBLoginView';
import DetailsViews from '../locations/DetailsViews';
import ShowLoading from '../ShowLoading';
import ListTrips from '../trips/ListTrips';
import CreateLocationButton from '../locations/CreateLocationButton';
import SearchLocation from '../locations/SearchLocation';
import SaveToMyTripsButton from '../trips/SaveToMyTripsButton';



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
      isLoading : true,
      isEditingMyTrip : false,
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

      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.onLongPressCreateMarker = this.onLongPressCreateMarker.bind(this);
    this.changeRegionAnimate = this.changeRegionAnimate.bind(this);

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
      /*
      let queryMyMap = this.itemsRef.orderByChild("userData/id").equalTo("10158181137300068")
      let querySearch = this.itemsRef.orderByChild("address_components/locality").equalTo("San Francisco")
      let queryToUse

      if(this.props.isMyMaps) {
        queryToUse = queryMyMap
      } else {
        queryToUse = querySearch
      }
      */

      let queryToUse = this.getRef().child('trips').child(this.state.trip.key).child('locations');
       queryToUse.on('value', (snap) => {
         var items = [];
         snap.forEach((child) => {
           items.push({

             title: child.val().googleData.address_components.route,
             googleData:child.val().googleData,
        //     address_components: child.val().address_components,
             coordinate: child.val().coordinates,
             coordinates: child.val().coordinates,
        //     coordinateGoogleAddress: child.val().coordinateGoogleAddress,
             key: child.getKey(),
          //   address: child.val().address,
             description: child.val().description,
             image: child.val().image,
             datePin:  child.val().datePin,
          //   userData:  child.val().userData,
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
      //this.listenForItems();
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
      if(!this.props.userData.id) {
        alert("You must be logged !")
        return;
      }
      if(!this.state.trip.key) {
        alert("Select or Create a trip first!")
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
            coordinates: coordinates,
            title: "title",
            key:keyId++,
            coordinateGoogleAddress: coordinates,
            image: markerImg,
            // userData: {
            //   picture: {
            //     data: {
            //       url: ''
            //     }
            //   }
            // }
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
      this._childListTrips.onReduceTrips()
    }

    onSetPositionDetails(position){
      this._childDetailsViews.onSetPositionDetails(position)
    }

    onTripSelected(item) {
      // help nico. Ici, on a deja les markers. dans item.locations. Pas besoin de listenForItems() qui refait un appel dans la base de donnee
      this.setState({
        trip:item
      },function(){
        this.listenForItems();
      })
      this.changeRegionAnimate(item)
    }

    onPressDeleteMarker(marker){
      this._child.deleteLocationToFirebase(marker, this.state.trip.key)
    }
    onMarkerSelected(item)
    {
      this.changeRegionAnimate(item)
    }
    changeRegionAnimate(item) {
      //console.log(item)
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

    onEditTripMode(){
      this.setState({isEditingMyTrip:true})
    }

    saveTrip(trip){
      this.t._addTripToFireBase(component.state.trip)
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
            >
              {this.state.locations.map((location,i) =>{
                return (
                  <MapView.Marker
                    key={location.key}
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

            <ShowLoading
              isLoading={this.state.isLoading}
            />
            <SaveToMyTripsButton
              trip={this.state.trip}
  
              isEditingMyTrip={this.state.isEditingMyTrip}
              onEditTripMode={this.onEditTripMode.bind(this)}
            />
            <ListTrips
              onItemSelected={this.onMenuItemSelected}
              userData={this.props.userData}
              trip={this.state.trip}
              isEditingMyTrip={this.state.isEditingMyTrip}
              onTripSelected={this.onTripSelected.bind(this)}
              ref={(child) => { this._childListTrips = child; }}
            />
            <SearchLocation
              trip={this.state.trip}
              isEditingMyTrip={this.state.isEditingMyTrip}
            />
            <CreateLocationButton
              trip={this.state.trip}
              isEditingMyTrip={this.state.isEditingMyTrip}
              onPressMarker={this.onPressMarker.bind(this)}
              onSetPositionDetails={this.onSetPositionDetails.bind(this)}
            />
            <DetailsViews
              selectedMarker={this.state.selectedMarker}
              trip={this.state.trip}
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
