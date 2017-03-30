import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import ListLocations from '../../locations/listLocations/ListLocations';


export default class AddTripButton extends Component {


  render() {
    if(this.props.selectedMarker.key)
      return null

    return (
      <View>
        <View style={{marginTop: 0}}>
          <View style={styles.row}>

          </View>
          <ListLocations
            trip={this.props.trip}
            onSelecetLocation={this.props.onSelecetLocation}
          />
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  photo: {
    height: 50,
    width: 50,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
  },
});
