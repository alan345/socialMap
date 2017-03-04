import React, {Component} from 'react';
import ReactNative from 'react-native';
import  {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Button
} from 'react-native';

// ({this.props.item.googleData.address_components.locality}...)

class SingleTrip extends Component {
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.onSelecetTrip(this.props.item)
        }}
      >
        <View style={{flex: 1, flexDirection: 'column', borderRadius: 5, marginRight:10, padding: 10, backgroundColor: '#ffffff'}} >

            <View>
                  <Image source={require('../../assets/trip_pic_example.png')} />
            </View>

            <View>
              <Text>{this.props.item.title}</Text>
              <Text>{this.props.item.googleData.address}</Text>
              <Text>4 cities</Text>
              <Text>34 stops</Text>
              <Image source={{ uri: 'https://daveexaminesmovies.files.wordpress.com/2012/10/5-star_rating_system_pcar_011-e1349505423547.png'}} style={styles.imageStar} />
            </View>

            <View style={{flex: 1, flexDirection: 'row'}}>
                <Image source={{ uri: this.props.item.userData.picture.data.url}} style={styles.photo} />
                <Text>{this.props.item.userData.name}</Text>
            </View>


        </View>
      </TouchableWithoutFeedback>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    flexDirection: 'row',
  },
  imageStar:{
    height: 18,
    width: 75,

  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 20,
    width: 20,
    borderRadius: 20,
  },
});

module.exports = SingleTrip;
