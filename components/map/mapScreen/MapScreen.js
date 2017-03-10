import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapStyle from "./MapStyle";


let initSelectedMarker = {
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
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MapScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      trip : {
        key:''
      },
      isEditingMyTrip: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polylines: [],
      locations: [],

      selectedMarker: initSelectedMarker

    };

  }




  render() {
    return (
      <View style={styles.container}>

        <MapView
          ref={ref => { this.map = ref; }}
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
          showsUserLocation = {true}
          onLongPress = {this.props.onLongPressCreateMarker}
          onPress = {this.props.onPressMap}
          customMapStyle={MapStyle}
        >


          {this.props.locations.map((location,i) =>{
            return (
              <MapView.Marker
                key={location.key}
                coordinate={location.coordinates}
                onPress={()=>{this.props.onSelecetLocation(location)}}
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


        </MapView>
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