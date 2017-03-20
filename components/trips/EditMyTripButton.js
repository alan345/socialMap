


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

const { width, height } = Dimensions.get('window');

export default class EditMyTripButton extends Component {



  editMyTrip(){
    this.props.onEditTripMode()
  }

  render() {
    //console.log(this.props.trip)
    if(this.props.isEditingMyTrip)
      return null
    if(!this.props.trip.isMyTrip)
      return null

    return (

      <View style={styles.container}>
        <Button
          onPress={this.editMyTrip.bind(this)}
          title="Edit my Trip"
          color="#841584"
          accessibilityLabel="Edit my Trip"
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
