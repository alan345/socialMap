import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Button,
  Image
} from 'react-native';


import DetailsTrip from './detailsTrip/DetailsTrip';

export default class ShowDetailsTripModal extends Component {

  state = {
    modalVisible: false,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }


  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setModalVisible(!this.state.modalVisible)
        }}
        >
       <View style={{margin: 22}}>
         <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
           <Button
             onPress={() => {
               this.setModalVisible(!this.state.modalVisible)
             }}
             title="← Back"
             color="#841584"
             accessibilityLabel="← Back"
           />
           <Text>Trip!</Text>
         </View>
        <DetailsTrip
          trip={this.props.trip}
        />
       </View>
      </Modal>
    );
  }
}
