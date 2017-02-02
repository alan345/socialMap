
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

const SideMenu = require('react-native-side-menu');
const Menu = require('./Menu');

import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import FBLoginView from './FBLoginView';


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
      initialPosition: 'unknown',
      polylines: [],
      locations: [],
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

   componentDidMount() {
     this.listenForItems(this.itemsRef);
   }

   //  navigator.geolocation.getCurrentPosition(
   //    (position) => {
   //      var initialPosition = JSON.stringify(position);
   //      this.setState({initialPosition});
   //    },
   //    (error) => alert(JSON.stringify(error)),
   //    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
   //  );
   //  Check here : https://facebook.github.io/react-native/docs/permissionsandroid.html


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
      console.log(this.state);
      alert("alan");
    }

    onPressMarker() {
      console.log("onPressMarker");
    }

    onLongPressCreateMarker(e) {

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
              initialRegion={this.state.region}
              onLongPress = {this.onLongPressCreateMarker}>
              <MapView.Marker
                title="This is a title"
                description="This is a description"
                coordinate={this.state.region}
              />

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

            <FBLogin
                buttonView={<FBLoginView />}
                ref={(fbLogin) => { this.fbLogin = fbLogin }}
                loginBehavior={FBLoginManager.LoginBehaviors.Native}
                permissions={["email","user_friends"]}
                onLogin={function(e){console.log(e)}}
                onLoginFound={function(e){console.log(e)}}
                onLoginNotFound={function(e){console.log(e)}}
                onLogout={function(e){console.log(e)}}
                onCancel={function(e){console.log(e)}}
                onPermissionsMissing={function(e){console.log(e)}}
              />
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
