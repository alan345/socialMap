import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import EditAddress from './EditAddress';
import EditDescription from './EditDescription';
import BackToDetailsTripButton from './BackToDetailsTripButton';


export default class DetailsLocation extends Component {
  onPressDeleteMarker(){
    this.onSetPositionDetails(0)
    let marker = this.props.selectedMarker;
    this.props.onPressDeleteMarker(marker)
  }



  render() {
    if(!this.props.selectedMarker.key)
      return null

    return (
      <View style={styles.container}>

          <View style={styles.headerDetails}>
            <BackToDetailsTripButton
              showDetailsTrip={this.props.showDetailsTrip}
            />
            <Image
              style={styles.icon}
              source={{uri: this.props.selectedMarker.googleData.imagePin}}
            />
            <Text
              style={styles.text}
            >{this.props.selectedMarker.googleData.address_components.neighborhood}</Text>

            <Image
              style={styles.iconRight}
              source={{uri: this.props.trip.userData.picture.data.url}}
            />


          </View>

              <View>
                <View style={styles.row}>
                  <Button
                    onPress={() => {
                      this._childEditAddress.setModalVisible(true)
                    }}
                    title="✎"
                    color="#841584"
                    accessibilityLabel="✎"
                  />
                  <Text>{this.props.selectedMarker.googleData.address}</Text>
                  <EditAddress
                    onMarkerSelected={this.props.onMarkerSelected}
                    selectedMarker={this.props.selectedMarker}
                    trip={this.props.trip}
                    ref={(child) => { this._childEditAddress = child; }}
                  />
                </View>
                <View style={styles.row}>
                  <Button
                    onPress={() => {
                      this._childEditDescription.setModalVisible(true)
                    }}
                    title="✎"
                    color="#841584"
                    accessibilityLabel="✎"
                  />
                  <Text>{this.props.selectedMarker.description}</Text>
                  <EditDescription
                    selectedMarker={this.props.selectedMarker}
                    trip={this.props.trip}
                    ref={(child) => { this._childEditDescription = child; }}
                  />
                </View>

              </View>

            <Text>Country: {this.props.selectedMarker.googleData.address_components.country}</Text>
            <Text>Locality: {this.props.selectedMarker.googleData.address_components.locality}</Text>
            <Text>State: {this.props.selectedMarker.googleData.address_components.administrative_area_level_1}</Text>
            <Text>Neighborhood: {this.props.selectedMarker.googleData.address_components.neighborhood}</Text>

            <Text>Date: {this.props.selectedMarker.datePin}</Text>

            <View style={styles.row}>
              <Button
                onPress={this.onPressDeleteMarker.bind(this)}
                title="✘"
                color="#841584"
                accessibilityLabel="✘"
              />
              <Text>  </Text>


            </View>
      </View>
    );
  }
}

let Window = Dimensions.get('window');
const styles = StyleSheet.create({
    headerDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 65,
      padding: 5
    },
    row: {
      flexDirection: 'row',
      padding: 5,
    },
    inputField:{
      height: 40,
      width: 200,
      padding: 5,
      borderColor: 'gray',
      borderWidth: 1,
      marginTop   : 5,
      marginLeft  : 5,
      marginRight : 5,
    },
    deleteIcon:{
      width: 50,
      height: 50,
    },
    icon: {
      width: 60,
      height: 60,
    },
    iconRight: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    deleteText : {
       marginTop   : 10,
      // marginLeft  : 5,
       marginRight : 5,
      // textAlign   : 'center',
      color       : 'black',
      fontSize : 30
    },
     text        : {
       marginTop   : 25,
       marginLeft  : 5,
       marginRight : 5,
       textAlign   : 'center',
       color       : 'black'
     },
});
