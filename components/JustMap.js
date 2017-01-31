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
  ListView,
  Button,
  Dimensions
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
let id = 0;


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
      initialPosition: 'unknown',
      polylines: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.onLongPressCreateMarker = this.onLongPressCreateMarker.bind(this);
    this.onDrageEndMarker = this.onDrageEndMarker.bind(this);

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
             _key: child.key
           });
         });

         this.setState({
           dataSource: this.state.dataSource.cloneWithRows(items)
         });
     });
    }

   componentDidMount() {
     this.listenForItems(this.itemsRef);


    //  navigator.geolocation.getCurrentPosition(
    //    (position) => {
    //      var initialPosition = JSON.stringify(position);
    //      this.setState({initialPosition});
    //    },
    //    (error) => alert(JSON.stringify(error)),
    //    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    //  );
    //  Check here : https://facebook.github.io/react-native/docs/permissionsandroid.html

   }

   _addItem() {
      this.itemsRef.push({ title: "testtest" });
   }

   _addLocationToFirebase(title, coordinates) {
      this.itemsRef.push({ title: title, coordinates: coordinates });
   }

   _renderItem(item) {
     return (
       <ListItem item={item} />
     );
   }
  // end firebase Example

    onDrageEndMarker(e) {
      this.setState({ x: e.nativeEvent.coordinate })
      console.log(this.state);
      alert("alan");
    }

    onPressMarker() {
      console.log("onPressMarker");
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
      });

      this._addLocationToFirebase('test_'+id, e.nativeEvent.coordinate);

      const { editing } = this.state;
      if (!editing) {
        this.setState({
          editing: {
            id: id++,
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
              initialRegion={this.state.region}
              onLongPress = {this.onLongPressCreateMarker}>


              {this.state.markers.map((marker,i) =>{
                return (
                  <MapView.Marker
                    key={i}
                    draggable
                    {... marker}
                    onDragEnd={this.onDrageEndMarker}
                    onPress={this.onPressMarker}
                    >
                      <View style={styles.marker}>
                        <Text style={styles.text}>{marker.name}</Text>
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

            <Button onPress={this._addItem.bind(this)} title="Add to FireBase test" />

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
    scrollview: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    map: {
     ...StyleSheet.absoluteFillObject,
    },
});
