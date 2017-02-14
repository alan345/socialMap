import React, {Component} from 'react';
import ReactNative from 'react-native';
import  {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  LayoutAnimation,
  PanResponder,
  Animated,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

class SearchInput extends Component {
  render() {
    return (

        <View style={styles.viewInputSearch}>
          <TextInput
            style={styles.inputField}
          />
        </View>

    );
  }
}


const styles = StyleSheet.create({
    viewInputSearch: {
      position: 'absolute',
      top: 30,
      left:width/2 - (150/2),
    },
    inputField:{
      height: 35,
      width: 150,
      borderColor: 'gray',
      borderWidth: 1,

      backgroundColor: 'white'

    },
});
module.exports = SearchInput;
