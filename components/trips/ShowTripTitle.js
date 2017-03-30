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
import AutocompleteAddress from "../../includes/AutocompleteAddress";

const { width, height } = Dimensions.get('window');

export default class ShowTripTitle extends Component {
  editTitleTripButton(){
  }

  render() {

    // if(!this.props.isEditingMyTrip)
    //   return null
    // if(!this.props.trip.key)
    //   return null

    return (
      <View style={styles.container}>
        <Button
          onPress={this.editTitleTripButton.bind(this)}
          title={this.props.trip.title}
          color="#841584"
          accessibilityLabel={this.props.trip.title}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top:0,
    width: width,
    padding : 60,
    paddingTop:10,
    zIndex:0,
  },
})
