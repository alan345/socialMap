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

const { width, height } = Dimensions.get('window');

export default class CreateLocationButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emptySelectedMarker: {
        key:'',
        address : '',
        address_components : {
          neighborhood:''
        },
        imagePin : 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
        coordinate : {
          latitude: '',
          longitude: '',
        },
        coordinateGoogleAddress : {
          latitude: '',
          longitude: '',
        },
        userData: {
          picture: {
            data: {
              url: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png'
            }
          }
        }
      }
    }
  }
  addLocation(){

    this.props.onPressMarker(this.state.emptySelectedMarker)
    this.props.onSetPositionDetails(2)
  }
  render() {
    if(!this.props.trip.key)
      return null
    return (
      <View style={styles.container}>
          <Button
            onPress={this.addLocation.bind(this)}
            title="✚"
            color="#841584"
            accessibilityLabel="✚"
          />
      </View>


    );
  }
}
const styles = StyleSheet.create({
  container: {
    position    : 'absolute',
    bottom      : 100,
    right       : 20,
  }
});
