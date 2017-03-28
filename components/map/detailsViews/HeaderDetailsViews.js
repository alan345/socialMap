import React, { Component } from 'react';
import  {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  LayoutAnimation,
  PanResponder,
  Animated,
  TouchableOpacity,
  Button,
} from 'react-native';
import SaveToMyTripsButton from '../../trips/SaveToMyTripsButton';
import AddLocationButton from '../../locations/AddLocationButton';



export default class HeaderDetailsViews extends Component {


      render(){

          return (
            <View style={styles.container}>
              <SaveToMyTripsButton
                trip={this.props.trip}
                isEditingMyTrip={this.props.isEditingMyTrip}
                onEditTripMode={this.props.onEditTripMode}
                userData={this.props.userData}
                onSelecetTrip={this.props.onSelecetTrip}
              />
              <AddLocationButton
                trip={this.props.trip}
                isEditingMyTrip={this.props.isEditingMyTrip}
                onEditTripMode={this.props.onEditTripMode}
                userData={this.props.userData}
              />
            </View>
        );
      }
};

let Window = Dimensions.get('window');
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
