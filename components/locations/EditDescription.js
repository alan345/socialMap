import React, { Component } from 'react';
import { Modal, Text, Button, TextInput, TouchableHighlight, View } from 'react-native';

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
    this._child.updateLocationToFirebase(selectedMarker, this.props.trip.key)
  //  this.setModalVisible(false)
    //il faut animer ici
    //this.props.onMarkerSelected(selectedMarker)

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
            <View>
              <Button
                onPress={() => {
                  this.setModalVisible(false)
                }}
                title="✎"
                color="#841584"
                accessibilityLabel="✎"
              />

              <TextInput
                placeholder = "Description"
                onChangeText={(text)=>this._onChangeText(text)}
                value={this.props.selectedMarker.description}
              />

            </View>
        </Modal>
      </View>
    );
  }
}
