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
    constructor(props){
      super();
      this.state = {
        //showAddTrip:false,
      }
    }

    render(){
        return (
          <View style={styles.container}>
            <View style={styles.row}>
              <SaveToMyTripsButton
                trip={this.props.trip}
                isEditingMyTrip={this.props.isEditingMyTrip}
                onEditTripMode={this.props.onEditTripMode}
                userData={this.props.userData}
                onSelectTrip={this.props.onSelectTrip}
              />
              <AddLocationButton
                trip={this.props.trip}
                isEditingMyTrip={this.props.isEditingMyTrip}
                onEditTripMode={this.props.onEditTripMode}
                userData={this.props.userData}
              />


              <View>
                <Text>{this.props.trip.userData.name}</Text>
                <Text>{this.props.trip.title}</Text>
                <Text>{this.props.trip.googleData.address_components.administrative_area_level_1}</Text>
                <Text>{this.props.trip.googleData.address_components.country}</Text>
                <Text>{this.props.trip.googleData.address_components.locality}</Text>
              </View>
            </View>
          </View>
      );
    }
};

let Window = Dimensions.get('window');
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  container: {
    // position: 'absolute',
    // bottom:0,
    // width: width,
    // padding : 40,
    // paddingBottom:25,
    // zIndex:0,
  },
});
