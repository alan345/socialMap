import React, { Component } from 'react';
import { Modal, Text, TextInput, TouchableHighlight, View } from 'react-native';
import AutocompleteAddress from "./AutocompleteAddress";
import FirebaseFunctions from "../../includes/FirebaseFunctions";
import GoogleAPI from '../../includes/GoogleAPI';

export default class EditDescription extends Component {

  state = {
    modalVisible: false,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  _onChangeText(text) {
    let selectedMarker = this.props.selectedMarker;
    selectedMarker.description = text
    console.log(selectedMarker, this.props.trip)
    this._child.updateLocationToFirebase(selectedMarker, this.props.trip.key)
  //  this.setModalVisible(false)
    //il faut animer ici

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
            <TextInput
              placeholder = "Description"
              onChangeText={(text)=>this._onChangeText(text)}
              value={this.props.selectedMarker.description}
            />


        </Modal>
      </View>
    );
  }
}
