import React, {Component} from 'react';
import ReactNative from 'react-native';
import  {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  LayoutAnimation,
  PanResponder,
  Animated,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

const homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = {description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

const { width, height } = Dimensions.get('window');

class SearchInput extends Component {
  render() {
    return (
      <View style={styles.viewInputSearch}>
      <GooglePlacesAutocomplete
             placeholder='Search'
             minLength={2} // minimum length of text to search
             autoFocus={true}
             listViewDisplayed='auto'    // true/false/undefined
             fetchDetails={true}
             renderDescription={(row) => row.description} // custom description render
             onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
               console.log(data);
               console.log(details);
             }}
             getDefaultValue={() => {
               return ''; // text input default value
             }}
             query={{
               // available options: https://developers.google.com/places/web-service/autocomplete
               key: 'AIzaSyAYPpKi0JDHdmhIuuuVndD96VEyavNAlHY',
               language: 'en', // language of the results
               types: '(cities)', // default: 'geocode'
             }}
             styles={{
               description: {
                 fontWeight: 'bold',
               },
               predefinedPlacesDescription: {
                 color: '#1faadb',
               },
               listView: {
                 backgroundColor: 'white',
                 width: 270,
               },

               textInputContainer: {
                 backgroundColor: 'rgba(0,0,0,0)',
                 borderTopWidth: 0,
                 borderBottomWidth:0,
               },
               textInput: {
                 marginLeft: 0,
                 marginRight: 0,
                 height: 38,
                 width: 150,
                 color: '#5d5d5d',
                 fontSize: 16,
                 backgroundColor: 'white'
               },
               predefinedPlacesDescription: {
                 color: '#1faadb',
                 backgroundColor: 'white'
               },
             }}

            // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
             //currentLocationLabel="Current location"
             nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
             GoogleReverseGeocodingQuery={{
               // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
             }}
             GooglePlacesSearchQuery={{
               // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
               rankby: 'distance',
               types: 'food',
             }}


             filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

             //predefinedPlaces={[homePlace, workPlace]}
           />
           </View>

    );
  }
}




const styles = StyleSheet.create({
    viewInputSearch: {
      position: 'absolute',
      top: 8,
      left:50,
    }
});
module.exports = SearchInput;
