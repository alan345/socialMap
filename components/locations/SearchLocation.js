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


const { width, height } = Dimensions.get('window');

export default class SearchLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _onChangeText(text) {
  }

  render() {
    if(!this.props.isEditingMyTrip)
      return null
    return (
      <View style={styles.container}>
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
    paddingTop:30,
    padding:55,

  },
});
