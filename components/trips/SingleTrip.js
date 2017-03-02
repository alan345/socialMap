import React, {Component} from 'react';
import ReactNative from 'react-native';
import  {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  Button,
  TouchableOpacity,
} from 'react-native';


class SingleTrip extends Component {
  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.onSelecetTrip(this.props.item)
        }}
      >
        <View>
          <View style={styles.container}>
            <Image source={{ uri: this.props.item.userData.picture.data.url}} style={styles.photo} />
            <Text> </Text>

            <Image source={{ uri: 'https://daveexaminesmovies.files.wordpress.com/2012/10/5-star_rating_system_pcar_011-e1349505423547.png'}} style={styles.imageStar} />

            <Text> {this.props.item.googleData.address_components.locality}</Text>
            <Text style={styles.text}>{this.props.item.title}</Text>



          </View>
        </View>
      </TouchableHighlight>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
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
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

module.exports = SingleTrip;
