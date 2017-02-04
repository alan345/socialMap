
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
      user:{},
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },

      markers: [],
      polylines: [],
      locations: [],
      heightDetailsList: {
        height: 0,
      },
      isLoading : true,
      selectedMarker: {
        key:"",
        address : "",
        imagePin : "",
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
    this.onDrageEndMarker = this.onDrageEndMarker.bind(this);

    this._onPressDetailsViews = this._onPressDetailsViews.bind(this);


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
             title: child.val().city,
             city: child.val().city,
             country: child.val().country,
             coordinate: child.val().coordinates,
             key: child.getKey(),
             address: child.val().address,
             description: child.val().country,
             image: child.val().image,
             imagePin: child.val().imagePin,
             datePin:  child.val().datePin
           });
         });

         this.setState({
           dataSource: this.state.dataSource.cloneWithRows(items),
           locations: items,
           isLoading:false,
         });


     });
    }




      getDataFromGoogleAPi(data, typeData) {
        return new Promise(function(resolve,reject){



          let urlGoogpleApi = 'https://maps.google.com/maps/api/'
          let urlGoogpleApiAPI = 'https://maps.googleapis.com/maps/api/'
          let urlGoogleGeocode = urlGoogpleApi + 'geocode/json'
          let googleKey = 'AIzaSyAYPpKi0JDHdmhIuuuVndD96VEyavNAlHY'
          let urlFetch = ""
          if(typeData == "address") {
            urlFetch = urlGoogleGeocode + '?address=' + data + '&key=' + googleKey
          } else if(typeData == "coordinates") {
            urlFetch = urlGoogleGeocode + '?latlng=' + data + '&key=' + googleKey
          }

          fetch(urlFetch)
          .then((response) => response.json())
          .then((responseJson) => {

            if(responseJson.status == "OK") {
                let coordinates = responseJson.results[0].geometry.location.lat + "," + responseJson.results[0].geometry.location.lng
                let imagePin = urlGoogpleApiAPI + "streetview?size=600x300&location=" + coordinates + "&heading=151.78&pitch=-0.76&key=" + googleKey
                responseJson.results[0].imagePin = imagePin
                resolve(responseJson.results[0])

              // console.log(responseJson.results[0])
              // return responseJson.results[0];
            }
          })
          .catch((error) => {
            console.error(error);
          });
        })
      }

    

      onChangeAddressInput() {

        // if (typeof this.state.selectedMarker.address == "undefined")
        //   return;
        //
        // if (typeof this.state.selectedMarker.address == "undefined")
        //   return;
        //
        // if(this.state.selectedMarker.address == "")
        //   return;

        component = this;
        this.getDataFromGoogleAPi(this.state.selectedMarker.address, "address").then(function(data){

          let marker= {
            key: component.state.selectedMarker.key,
            address : data.formatted_address,
            imagePin: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/3/005/01b/27a/240ddec.jpg',

            coordinate : {
              latitude : data.geometry.location.lat,
              longitude : data.geometry.location.lng,
            }
          }
          component._updateLocationToFirebase(marker);
        })



      }



    componentDidMount() {
      this.listenForItems(this.itemsRef);

    }



    _updateLocationToFirebase(marker) {

       this.itemsRef.child(marker.key).set({
         title: "title",
         coordinates: marker.coordinate,
         address: marker.address,

         name: 'New PinUPDATED',
         title: 'title',
         description: 'description',
         image: flagBlackImg,
         imagePin: marker.imagePin,
         datePin:  Date()
        });
    }

   _addLocationToFirebase(marker) {
      var component = this;
      this.itemsRef.push({
        title: "title",
        coordinates: marker.coordinate,
        address: marker.address,
        description: marker.description,
        country: marker.country,
        city: marker.city,
        image: flagBlackImg,
        imagePin: marker.imagePin,
        datePin:  marker.datePin
      },
        component.setState({isLoading:false})
      );
   }

    onDrageEndMarker(e) {
      this.setState({ x: e.nativeEvent.coordinate })

    }





    onLongPressCreateMarker(e) {
      this.setState({isLoading:true})
      var component = this;
      let coordinatesGoogle = e.nativeEvent.coordinate.latitude + "," + e.nativeEvent.coordinate.longitude

      this.getDataFromGoogleAPi(coordinatesGoogle, "coordinates").then(function(data){
        console.log(data)
        let marker= {
          key:"",
          address : data.formatted_address,
          imagePin: data.imagePin,
          city: data.address_components[3].long_name,
          country:data.address_components[6].long_name,
          datePin: Date(),
          description: "",
          coordinate : {
            latitude : data.geometry.location.lat,
            longitude : data.geometry.location.lng,
          }
        }
        component._addLocationToFirebase(marker);



      })

      //
      // this.setState({
      //   locations: [
      //     ...this.state.locations,
      //     {
      //       coordinate: e.nativeEvent.coordinate,
      //
      //       name: 'New Pin',
      //       title: 'title',
      //
      //       image: flagBlackImg,
      //       imagePin: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/3/005/01b/27a/240ddec.jpg',
      //       datePin:  Date(),
      //     },
      //   ]
      // });


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


    _onPressDetailsViews() {
      if(this.state.heightDetailsList.height == height /2) {
        this.setState({
          heightDetailsList: {
            height: height /3,
          }
        })
      } else {
        this.setState({
          heightDetailsList: {
            height: height /2,
          }
        })
      }

    }


  render() {
    return (
      <View style={styles.container}>

            <MapView
              provider={this.props.provider}
              style={styles.map}
              initialRegion={this.state.region}
              showsUserLocation = {true}
              onLongPress = {this.onLongPressCreateMarker}
              onPress = {() => {this.setState({
                heightDetailsList: {
                  height: 0,
                }
              })}}
            >



              {this.state.locations.map((location,i) =>{
                return (
                  <MapView.Marker
                    key={location.key}
                    onPress={() => {this.setState({
                      heightDetailsList: {
                        height: height /3,
                      },
                      selectedMarker: location
                    })}}
                    onDragEnd={(e) => {
                      this.setState({
                        showViewDetails:true,
                        selectedMarker: location
                      })

                      this.setState({selectedMarker : {
                        coordinate : {
                          latitude : e.nativeEvent.coordinate.latitude,
                          longitude : e.nativeEvent.coordinate.longitude,
                        }
                      }},
                        //this._updateLocationToFirebase(this.selectedMarker.key, this.selectedMarker.coordinate, this.selectedMarker.address)
                      //  console.log(this.selectedMarker.key)
                      )
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





            <TouchableHighlight onPress={this._onPressDetailsViews}>
              <View style={[this.state.heightDetailsList, styles.eventList]}>
                <ScrollView>
                    <Image
                      style={styles.icon}
                      source={{uri: this.state.selectedMarker.imagePin}}
                    />
                    {/*

                    <TextInput
                      onChangeText={(address) => this.setState({
                          selectedMarker: {
                            key: this.state.selectedMarker.key,
                            imagePin: this.state.selectedMarker.imagePin,
                            address : address,
                            coordinate : {
                              latitude : this.state.selectedMarker.coordinate.latitude,
                              longitude : this.state.selectedMarker.coordinate.latitude,
                            }
                          }
                        })}
                        onChange = {this.onChangeAddressInput()}
                        value={this.state.selectedMarker.address}
                      />
                      */ }
                    <Text>Address: {this.state.selectedMarker.address}</Text>



                    <Text>City: {this.state.selectedMarker.city}</Text>
                    <Text>Country: {this.state.selectedMarker.country}</Text>
                    <Text>Coordinates: {this.state.selectedMarker.coordinate.latitude}</Text>
                    <Text>Coordinates: {this.state.selectedMarker.coordinate.longitude}</Text>
                    <Text>Date: {this.state.selectedMarker.datePin}</Text>
                    <Text>Key: {this.state.selectedMarker.key}</Text>

                    <TextInput
                      onChangeText={(description) => this.setState({
                          selectedMarker: {
                            key: this.state.selectedMarker.key,
                            imagePin: this.state.selectedMarker.imagePin,
                            address : this.state.selectedMarker.address,
                            description: description,
                            coordinate : this.state.selectedMarker.coordinate
                          }
                        })}

                        value={this.state.selectedMarker.description}
                      />

                  </ScrollView>

              </View>
            </TouchableHighlight>
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
    //  marginLeft: -18,
      marginTop: 0,
    },
    eventList: {
      top: 0,
      left: 0,
      right: 0,

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
    icon: {
      width: 60,
      height: 60,
    },
    imageLoading: {
      width: 30,
      height: 30,
    },

    map: {
     ...StyleSheet.absoluteFillObject,
    },
});
