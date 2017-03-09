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
    return (
      <View>
        <View style={{marginTop: 22}}>
          <Image source={{ uri: this.props.trip.userData.picture.data.url}} style={styles.photo} />
          <Text>{this.props.trip.title}</Text>
          <Text>{this.props.trip.userData.name}</Text>
          <Text>{this.props.trip.googleData.address_components.administrative_area_level_1}</Text>
          <Text>{this.props.trip.googleData.address_components.country}</Text>
          <Text>{this.props.trip.googleData.address_components.locality}</Text>
          <ListLocations
            trip={this.props.trip}
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
  }
});
