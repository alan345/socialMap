/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
import flagGreyImg from './assets/flag-grey.png';
import MapView, {Marker} from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class socialMap extends Component {

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
    };
    this.onLongPressCreateMarker = this.onLongPressCreateMarker.bind(this);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }



    onLongPressCreateMarker(e) {

      this.setState({
        markers: [
          ...this.state.markers,
          {
            coordinate: e.nativeEvent.coordinate,
            key: this.getRandomInt(0, 999999),
            name: 'New Pin',

            image: flagGreyImg,
            imagePin: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/3/005/01b/27a/240ddec.jpg',
            datePin:  Date(),
          },
        ],
      });
    }

  render() {
    return (
      <View style={styles.container}>

      <MapView
        provider={this.props.provider}
        style={styles.map}
        initialRegion={this.state.region}
        onLongPress = {this.onLongPressCreateMarker}
      >
        <MapView.Marker
          title="This is a title"
          description="This is a description"
          coordinate={this.state.region}
        />



        {this.state.markers.map((marker,i) =>{
          return (
            <MapView.Marker
              key={i}
              {... marker}

              >
                <View style={styles.marker}>
                  <Text style={styles.text}>{marker.name}</Text>
                </View>
            </MapView.Marker>

          )
        })}
      </MapView>


        <Text style={styles.welcome}>
          Welcome to React Native!enorm
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}


socialMap.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollview: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});



AppRegistry.registerComponent('socialMap', () => socialMap);
