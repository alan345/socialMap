import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import AutocompleteAddress from "../../../includes/AutocompleteAddress";
import FirebaseFunctions from "../../../includes/FirebaseFunctions";
import GoogleAPI from '../../../includes/GoogleAPI';


export default class EditAddress extends Component {

  state = {
    modalVisible: false,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  _onChangeText(text) {

    let selectedMarker = this.props.selectedMarker;

      var component = this;
      this._childGoogleAPI.getDataFromGoogleAPiByAddress(text).then(function(marker){
        selectedMarker.googleData.address_components = marker.googleData.address_components
        selectedMarker.googleData.address = marker.googleData.address
        selectedMarker.coordinates = marker.coordinates
        selectedMarker.googleData.coordinateGoogleAddress = marker.googleData.coordinateGoogleAddress
        console.log(selectedMarker, component.props.trip.key)
        component._child.addOrUpdateLocation(selectedMarker, component.props.trip.key)
        component.setModalVisible(false)
        //il faut animer ici

        component.props.onMarkerSelected(selectedMarker)
      })

  }

  render() {
    return (
      <View style={{marginTop: 22}}>
        <FirebaseFunctions ref={(child) => { this._child = child; }} />
        <GoogleAPI ref={(child) => { this._childGoogleAPI = child; }} />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false)
          }}
          >

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>


            <Text>Hello World!</Text>
            <AutocompleteAddress
              onChangeText={this._onChangeText.bind(this)}
            />


        </Modal>
      </View>
    );
  }
}
