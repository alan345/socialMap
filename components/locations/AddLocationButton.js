


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
} from 'react-native';
import ShowLoading from '../ShowLoading';
import AddTrip from '../trips/AddTrip';

const { width, height } = Dimensions.get('window');
export default class AddLocationButton extends Component {



  addLocation(){
    this._childAddTrip.showAddTrip()
    //this.props.onEditTripMode()
  }

  render() {

    // if(this.props.isEditingMyTrip)
    //   return null
    if(!this.props.trip.isMyTrip)
      return null

    return (

      <View style={styles.container}>
        <Button
          onPress={this.addLocation.bind(this)}
          title="Add Location"
          color="#841584"
          accessibilityLabel="Edit my Trip"
        />
        <AddTrip
          trip={this.props.trip}
          ref={(child) => { this._childAddTrip = child; }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // bottom:0,
    // width: width,
    // padding : 40,
    // paddingBottom:25,
    // zIndex:0,
  },
});
