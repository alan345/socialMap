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

export default class ShowDetailsTripModal extends Component {

  state = {
    modalVisible: false,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible)
          }}
          >
         <View style={{margin: 22}}>
          <View>
            <Text>Trip!</Text>

            <Image source={{ uri: this.props.trip.userData.picture.data.url}} style={styles.photo} />
            <Text>{this.props.trip.title}</Text>
            <Text>{this.props.trip.userData.name}</Text>
            <Button
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
              }}
              title="Cancel"
              color="#841584"
              accessibilityLabel="cancel"
            />



          </View>
         </View>
        </Modal>

        <TouchableHighlight onPress={() => {
          this.setModalVisible(true)
        }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  photo: {
    height: 50,
    width: 50,
    borderRadius: 20,
  }
});
