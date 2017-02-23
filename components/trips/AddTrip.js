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
const { width, height } = Dimensions.get('window');
import GoogleAPI from '../../includes/GoogleAPI';


export default class AddTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      trip: {
        googleData:{},
        city:'',
        title:'',
        image:'http://ozandgo.com/wp-content/uploads/2014/10/covoiturage-australie-van-roadtrip.jpg',
      }
    };
    this._addTripToFireBase = this._addTripToFireBase.bind(this);
    this.saveTrip = this.saveTrip.bind(this);





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

  saveTrip(){
    let address = "paris, france"
    let component = this;

    this._childGoogleAPI.getDataFromGoogleAPiByAddress(address).then(function(marker){
      // component.setState({
      //   trip:{
      //     googleData:marker
      //   }
      // },function(){
      //     component._child.addOrUpdateTrip(this.state.trip)
      // })
    //  component._childFirebaseFunctions.addOrUpdateTrip(this.state.trip)

      let trip = component.state.trip
      trip.googleData = marker
      component._addTripToFireBase(trip)

    //  console.log(marker)

      // marker.key = key
      // marker.datePin = Date()
      // marker.description = ""
      // marker.userData = component.props.userData
      //
      // component._addLocationToFirebase(marker);
    })


    this.props.hideAddTrip()
  }

  _addTripToFireBase(trip){
    this._childFirebaseFunctions.addOrUpdateTrip(trip)
  }

  deleteTrip(){
    this._childFirebaseFunctions.deleteTrip(this.state.trip)
    this.props.hideAddTrip()
  }
  closeWindows(){
    this.props.hideAddTrip()
  }
  render() {
    if(!this.props.showAddTrip)
      return null
    return (

      <View style={{marginTop: 22}}>
        <FirebaseFunctions ref={(child) => { this._childFirebaseFunctions = child; }} />
        <GoogleAPI ref={(child) => { this._childGoogleAPI = child; }} />

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={styles.container}>
          <View>

                <ShowLoading
                  isLoading={this.state.isLoading}
                />
                <Text>Your Trip</Text>
                <TextInput
                  value={this.state.trip.title}
                  placeholder = "Title"
                  style={styles.inputField}
                  onChangeText={(text) => this.setState({
                    trip: {
                      city:this.state.trip.city,
                      title:text,
                      image:this.state.trip.image,
                      key:this.state.trip.key,
                    }

                  })}
                />
                <TextInput
                  value={this.state.trip.city}
                  placeholder = "City"
                  style={styles.inputField}
                  onChangeText={(text) => this.setState({
                    trip: {
                      city:text,
                      title:this.state.trip.title,
                      image:this.state.trip.image,
                      key:this.state.trip.key,
                    }
                  })}
                />

                  <Button
                    onPress={this.closeWindows.bind(this)}
                    title="Cancel"
                    color="#841584"
                    accessibilityLabel="cancel"
                  />
                  <Text> </Text>
                  <Button
                    onPress={this.deleteTrip.bind(this)}
                    title="Delete"
                    color="#841584"
                    accessibilityLabel="delete"
                  />
                  <Text> </Text>
                  <Button
                    onPress={this.saveTrip}
                    title="Ok"
                    color="#841584"
                    accessibilityLabel="ok"
                  />

          </View>
         </View>
        </Modal>
      </View>


    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding:40,



  },
  row: {

  },
  inputField:{

  }
});
