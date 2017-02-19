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
} from 'react-native';
import * as firebase from 'firebase';
import Firebase from "../../includes/firebase";
import ShowLoading from '../ShowLoading';
import FirebaseFunctions from "../../includes/FirebaseFunctions";
const { width, height } = Dimensions.get('window');


export default class AddTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      trip: {
        city:'',
        title:'',
        image:'http://ozandgo.com/wp-content/uploads/2014/10/covoiturage-australie-van-roadtrip.jpg',
      }
    };

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
    this._child.addOrUpdateTrip(this.state.trip)
    this.props.hideAddTrip()
  }
  deleteTrip(){
    this._child.deleteTrip(this.state.trip)
    this.props.hideAddTrip()
  }
  closeWindows(){
    this.props.hideAddTrip()
  }
  render() {
    if(!this.props.showAddTrip)
      return null
    return (

      <View style={styles.container}>
        <FirebaseFunctions ref={(child) => { this._child = child; }} />
        <ShowLoading
          isLoading={this.state.isLoading}
        />
        <Text>Add TRIP</Text>
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
        <View style={styles.row}>
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
            onPress={this.saveTrip.bind(this)}
            title="Ok"
            color="#841584"
            accessibilityLabel="ok"
          />
        </View>
      </View>


    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputField:{
    width:180,
  }
});
