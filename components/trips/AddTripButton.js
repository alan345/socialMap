import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

const { width, height } = Dimensions.get('window');
export default class AddTripButton extends Component {

  render() {
    return (

      <View style={styles.container}>
            <TouchableWithoutFeedback onPress={this.props.onPressButtonTrip}>
              <View
                title="✚"
                color="#841584"
                style={{borderRadius: 40, backgroundColor: '#841584', height: 40, width: 40, paddingTop:5}}>
                   <Text style={{color:"#ffffff", textAlign: 'center', fontSize: 22}}>+</Text>
              </View>
          </TouchableWithoutFeedback>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 30,
    marginTop: 70
  },
});
