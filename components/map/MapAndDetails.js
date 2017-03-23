
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
import MapScreen from "./mapScreen/MapScreen";
import MapView, {Marker} from 'react-native-maps';
import FirebaseFunctions from "../../includes/FirebaseFunctions";
import GoogleAPI from '../../includes/GoogleAPI';

import FBLoginView from '../FBLoginView';
import DetailsViews from './detailsViews/DetailsViews';
import ShowLoading from '../ShowLoading';
import BackToTripButton from './BackToTripButton';

import TakePictureButton from '../locations/TakePictureButton';
import SearchLocation from '../locations/SearchLocation';

import ShowTripTitle from '../trips/ShowTripTitle';

var firebaseFunctions = new FirebaseFunctions();


let keyId = 0

let initSelectedMarker = {
    key: '',
    googleData: {
      imagePin: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
      address: '',
      address_components: {
        neighborhood: ''
      },
    },
    coordinates:{}
}

export default class MapAndDetails extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          trip : this.props.navigation.state.params.trip,
          isEditingMyTrip: false,
          polylines: [],
          locations: [],
          selectedMarker: initSelectedMarker
        }
        this.changeRegionAnimate = this.changeRegionAnimate.bind(this)
    }

    componentDidMount() {
        let _this = this
        firebaseFunctions.listenTrip(this.props.navigation.state.params.trip.key)
        firebaseFunctions.addObserver('trip_changed', _this._updateTripData.bind(_this))
    }

    componentWillUnmount() {
        firebaseFunctions.removeObserver('trip_changed')
    }

    _updateTripData() {
         this.setState({
             trip: firebaseFunctions.currentTrip
         })
     }

    // _updateLocationToFirebase(marker, tripId) {
    //     firebaseFunctions.updateLocationToFirebase(marker, tripId)
    // }
    //
    // _addLocationToFirebase(marker, tripId) {
    //     firebaseFunctions.addOrUpdateLocation(marker, tripId)
    // }

    createOrUpdateMarker(e, marker) {
      let key=""
      if(marker)
        key = marker.key

      // this.setState({isLoading:true})
      var component = this;
      let coordinates = {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      }

/*
      this.setState({
        locations: [
          ...this.state.locations,
          {
            coordinate: coordinates,
            coordinates: coordinates,
            title: "title",
            key:keyId++,
            coordinateGoogleAddress: coordinates,
            // image: markerImg,
            googleData : {
              imagePin:'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
              address_components:{
                neighborhood:''
              }
            }

          }
        ]
      })
*/


      this._childGoogleAPI.getDataFromGoogleAPiByCoordinates(coordinates).then(function(marker){
        marker.key = key
        marker.datePin = Date()
        marker.description = ""

      //  marker.userData = component.props.userData
        //marker.title = marker.googleData.address_components.route
        firebaseFunctions.addLocationToFirebase(marker, component.state.trip.key)
        this.setState({isLoading: false})
      })


    }

    onLongPressCreateMarker(e) {
      this.createOrUpdateMarker(e, {})
    }

    showDetailsTrip(){
      this.setState({
        selectedMarker: initSelectedMarker
      })
  //    this._childDetailsViews.onReduceDetails()
    }

    onPressMap(){
      this.showDetailsTrip()
    }


    onSetPositionDetails(position){
      this._childDetailsViews.onSetPositionDetails(position)
    }

    onSelecetTrip(item) {
      this.setState({
        trip:item,
      },function(){
        this.listenForItems();
      })
      this.changeRegionAnimate(item)
    }

    onPressDeleteMarker(marker){
      firebaseFunctions.deleteLocationToFirebase(marker, params.trip.key)
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
    //  this.map.animateToRegion(newRegion);
    }


    onSelecetLocation(location) {
      this.setState({
        selectedMarker: location
      })
    //  this._childDetailsViews.onShowDetails()
    }
    onPressMarker(location){
      this.onSelecetLocation(location)
    }

    onEditTripMode(editTripMode = true){
      this.setState({isEditingMyTrip:editTripMode})
    }

    // saveTrip(trip){
    //   this.t._addTripToFireBase(component.state.trip)
    // }

    capture(){
      // this.props.navigator.replace({
      //     name: 'capture'
      // });
    }
    goToListTrips(){
      this.props.navigation.goBack()
    }



  render() {
    const { params } = this.props.navigation.state;
    return (

      <View style={styles.container}>
            <GoogleAPI ref={(child) => { this._childGoogleAPI = child }} />

            <MapScreen
              locations={this.state.trip.locations}
              onPressMap={this.onPressMap.bind(this)}
              provider={this.props.provider}
              onSelecetLocation={this.onSelecetLocation.bind(this)}
              onLongPressCreateMarker={this.onLongPressCreateMarker.bind(this)}
            />
            <BackToTripButton
              goToListTrips={this.goToListTrips.bind(this)}
            />
            <ShowLoading
              isLoading={this.state.isLoading}
            />
            <ShowTripTitle
              trip={this.state.trip}
              isEditingMyTrip={this.state.isEditingMyTrip}
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
              trip={params.trip}
              isEditingMyTrip={this.state.isEditingMyTrip}
              showDetailsTrip={this.showDetailsTrip.bind(this)}
              onMarkerSelected={this.onMarkerSelected.bind(this)}
              onSelecetLocation={this.onSelecetLocation.bind(this)}
              onPressDeleteMarker={this.onPressDeleteMarker.bind(this)}
              onEditTripMode={this.onEditTripMode.bind(this)}
              onSelecetTrip={this.onSelecetTrip.bind(this)}


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
    }
})
