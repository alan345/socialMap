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
          <View style={styles.row}>
            <View>
              <Image source={{ uri: this.props.trip.userData.picture.data.url}} style={styles.photo} />

              <Text>{this.props.trip.userData.name}</Text>
            </View>
            <View>
              <Text>{this.props.trip.title}</Text>
              <Text>{this.props.trip.googleData.address_components.administrative_area_level_1}</Text>
              <Text>{this.props.trip.googleData.address_components.country}</Text>
              <Text>{this.props.trip.googleData.address_components.locality}</Text>

            </View>
          </View>
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
  },
  row: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
  },
});
