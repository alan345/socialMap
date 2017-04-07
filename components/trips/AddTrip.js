import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Button,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import * as firebase from 'firebase';
import Firebase from "../../includes/firebase";
import ShowLoading from '../ShowLoading';
import FirebaseFunctions from "../../includes/FirebaseFunctions";
import GoogleAPI from '../../includes/GoogleAPI';
import LoginFunctions from '../../includes/LoginFunctions';
import AutocompleteAddress from "../../includes/AutocompleteAddress";
const { width, height } = Dimensions.get('window');

var firebaseFunctions = new FirebaseFunctions();
var loginFunctions = new LoginFunctions();

export default class AddTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      showAddTrip:false,
      inputAutocomplete:'',
      trip: {
        googleData:{},
        locations:{},
      //  city:'',
        title:'',
        image:'http://ozandgo.com/wp-content/uploads/2014/10/covoiturage-australie-van-roadtrip.jpg',
      }
    };
    this._addTripToFireBase = this._addTripToFireBase.bind(this);
    this.itemsRef = this.getRef().child('trips');
  }


  getRef() {
     return firebase.database().ref();
  }

  propsToState(){
    this.setState({
      trip:this.props.trip
    })
  }


  addLocationToTrip(marker, trip){
    // let component = this;
    firebaseFunctions.addLocationToFirebase(marker, trip.key).then(function(key){
      //component.closeWindows()
    }).catch(function(e) {
       console.log(e);
    })
  }


  saveTrip(){
    this._childShowLoading.showLoading()
    let inputAutocomplete = this.state.inputAutocomplete
    let component = this;
    this._childGoogleAPI.getDataFromGoogleAPiByAddress(inputAutocomplete).then(function(marker){
      if(component.props.trip.key) {
        component.addLocationToTrip(marker, component.props.trip)
      } else {

          let trip = component.state.trip
          trip.googleData = marker.googleData
          trip.title = 'new title'
          trip.city = marker.googleData.address_components.locality
          trip.userData = loginFunctions.getUserData()
          var marker = {
            coordinates: trip.googleData.coordinateGoogleAddress,
            googleData:trip.googleData,
            description: 'My new fresh Trip',
          }
          firebaseFunctions.addTrip(trip).then(function(trip) {
            component.addLocationToTrip(marker, trip)
            component.closeWindows()
            component.props.onSelecetTrip(trip)
          }).catch(function(e) {
             console.log(e);
          })
          //component.props.onSelecetTrip(trip)

        }
      })


    //this.props.hideAddTrip()
  }

  _onChangeText(description) {
    this.setState({
      inputAutocomplete : description
    })


    // this.setState({
    //   isLoading:true,
    //   search : {
    //     city:description
    //   }
    // }, function() {
    //   this.listenForItems()
    // })
  }

  _addTripToFireBase(trip){
    if(!trip.locations)
      trip.locations={}

    //help nico need help // should be in firebase Function mais jai un bug a cause de la promise.
    //Je ne comprends pas je fais la meme chose L60 dans seacrhLocations. Promesses, puis save..
    //this._childFirebaseFunctions.addOrUpdateTrip(trip)
    this.addOrUpdateTrip(trip)
  }
  // should be in firebase Function mais jai un bug
    addOrUpdateTrip(_trip){
      console.log(_trip)
      if(_trip.key == null  ) {
        this.addTrip(_trip)
      } else {
        console.log(_trip)
        this.updateTrip(_trip)

      }
    }
    // should be in firebase Function mais jai un bug
    addTrip(trip){
      let itemsRef = firebase.database().ref().child('trips');
      var newRef = itemsRef.push();
      var key = newRef.key;
      trip.key = key
      this.updateTrip(trip)
    }
    // should be in firebase Function mais jai un bug
    updateTrip(trip){
      let itemsRef = firebase.database().ref().child('trips');
      itemsRef.child(trip.key).set({
        title: trip.title,
        image: trip.image,
        city: trip.city,
        googleData: trip.googleData,
        userData: trip.userData,
        locations: trip.locations,
      });
    }


  deleteTrip(){
    firebaseFunctions.deleteTrip(this.state.trip)
    this.props.hideAddTrip()
  }
  closeWindows(){
    this.setState({
      showAddTrip:false
    })
  }

  showAddTrip(){
    this.setState({
      showAddTrip:true
    })
  }



  render() {
    return (

      <View style={{marginTop: 22}}>
        <GoogleAPI ref={(child) => { this._childGoogleAPI = child; }} />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showAddTrip}
          onRequestClose={() => {this.closeWindows()}}
          >

         <View style={styles.container}>
          <View>

                <ShowLoading
                  ref={(child) => { this._childShowLoading = child; }}
                />
                <Text>Chose your departure</Text>
                <View style={styles.searchView}>
                <AutocompleteAddress
                  onChangeText={this._onChangeText.bind(this)}
                />
                </View>

                  <Text> </Text>
                  <Text> </Text>
                  <Button
                    onPress={this.saveTrip.bind(this)}
                    title="Ok"
                    color="#841584"
                    accessibilityLabel="ok"
                  />
                  <Text> </Text>
                  <Button
                    onPress={this.closeWindows.bind(this)}
                    title="Cancel"
                    color="#841584"
                    accessibilityLabel="cancel"
                  />
          </View>
         </View>
        </Modal>
      </View>


    );
  }
}
const styles = StyleSheet.create({
  searchView:{
    flexDirection: 'row',
  },
  container: {
    padding:40,
  },
  row: {
  },
  inputField:{

  }
});
