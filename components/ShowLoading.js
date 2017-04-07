import React, { Component } from 'react';
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
} from 'react-native';

const { width, height } = Dimensions.get('window');

class ShowLoading extends Component {
  constructor(props){
    super();
    this.state = {
      isLoading : false
    }
  }
  showLoading() {
    this.setState({
      isLoading : true
    });
  }
  hideLoading() {
    this.setState({
      isLoading : false
    });
  }

  render(){
    if(!this.state.isLoading)
      return null

    return (
      <View style={styles.showLoading}>
        <Text>LOADING...</Text>
        <Image
          style={styles.imageLoading}
          source={require('../assets/loading.png')}
        />
      </View>
    );
  }
};


let Window = Dimensions.get('window');
const styles = StyleSheet.create({
  showLoading: {
    position: 'absolute',
    top: 300,
    right: width/2 - 50,
    zIndex:99
  },
  imageLoading: {
    width: 50,
    height: 50,
  },
});



module.exports = ShowLoading;
