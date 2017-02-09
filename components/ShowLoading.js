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
    };

  }


  render(){
    return (
      <View style={styles.showLoading}>

            {this.props.isLoading ? (
              <Image
                style={styles.imageLoading}
                source={require('../assets/loading.png')}
              />
            ) : (
              <Text></Text>
            )}

      </View>
    );
  }
};


let Window = Dimensions.get('window');
const styles = StyleSheet.create({
  showLoading: {
    position: 'absolute',
    top: 0,
    right: width/2,
  },
  imageLoading: {
    width: 30,
    height: 30,
  },  
});



module.exports = ShowLoading;
