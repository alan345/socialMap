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
  TouchableHighlight,
} from 'react-native';
import ShowLoading from '../ShowLoading';
import AutocompleteAddress from "../../includes/AutocompleteAddress";
import FirebaseFunctions from "../../includes/FirebaseFunctions";
import GoogleAPI from '../../includes/GoogleAPI';

var firebaseFunctions = new FirebaseFunctions();


const { width, height } = Dimensions.get('window');

export default class SearchLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emptySelectedMarker: {
        key:'',
        title:'',
        description:'',
        googleData : {
          address : '',
          coordinateGoogleAddress : {
            latitude: '',
            longitude: '',
          },
          address_components : {
            neighborhood:''
          },
          imagePin : 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
        },
        coordinates : {
          latitude: '',
          longitude: '',
        },
      }
    };
  }

  _onChangeText(text) {

    let selectedMarker = this.state.emptySelectedMarker;
    var component = this;
    this._childGoogleAPI.getDataFromGoogleAPiByAddress(text).then(function(marker){
      selectedMarker.googleData.address_components = marker.googleData.address_components
      selectedMarker.googleData.address = marker.googleData.address
      selectedMarker.coordinates = marker.coordinates
      selectedMarker.googleData.coordinateGoogleAddress = marker.googleData.coordinateGoogleAddress
      firebaseFunctions.addOrUpdateLocation(selectedMarker, component.props.trip.key)
      component.props.onMarkerSelected(selectedMarker)
    })
  }

  render() {
    if(!this.props.isEditingMyTrip)
      return null
    return (
      <View style={styles.container}>
        <GoogleAPI ref={(child) => { this._childGoogleAPI = child; }} />
        <AutocompleteAddress
          onChangeText={this._onChangeText.bind(this)}
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
    paddingTop:40,
    padding:55,

  },
});
