import React, { Component } from 'react'
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

  constructor (props) {
    super(props);
    this.state = {
      isEditingMyTrip: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      polylines: [],
      locations: this.props.locations,
      locationsArr: [],
      selectedMarker: initSelectedMarker
    }
  }

  componentDidMount() {
      this._updateLocationsArr()
  }

  componentWillReceiveProps() {
      console.log('componentDidUpdate', this.props.locations)
      this._updateLocationsArr()
  }

  _updateLocationsArr() {
      console.log('location array update')
      let locations = this.props.locations
      let locationsArr = []
      for(var key in locations) {
          var location = locations[key]
          location['key'] = key
          // location['title'] = locations[key].googleData.address_components.neighborhood
          locationsArr.push(location)
      }
      this.setState({locationsArr: locationsArr})
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


          {this.state.locationsArr.map((location,i) =>{
            // WARNING: marker image property (pin icon) can conflict with location.image (location image). Don't use  "...location" in the iterator
            return (
              <MapView.Marker
                key={location.key}
                coordinate={location.coordinates}
                onPress={()=>{this.props.onSelecetLocation(location)}}
                onDragEnd={(e) => {
                  this.createOrUpdateMarker(e, location);
                }}
                image={require('../../../assets/map_marker_default.png')}
                draggable>
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
})

MapScreen.propTypes = {
  locations: React.PropTypes.object
}
