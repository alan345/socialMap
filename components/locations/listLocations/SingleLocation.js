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


export default class SingleLocation extends Component {



  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.onSelecetTrip(this.props.item)
        }}
      >

        <View style={{flex: 1, flexDirection: 'column', borderRadius: 5, marginRight:10, padding: 10, backgroundColor: '#ffffff'}} >

            <View style={styles.row}>
              <View>
                <Image
                  style={styles.icon}
                  source={{uri: this.props.item.googleData.imagePin}}
                />
              </View>
            </View>
            <View>
              <Text>{this.props.item.googleData.address}</Text>
              <Text>{this.props.item.googleData.address_components.neighborhood}</Text>

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
  row: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
  },
  imageStar:{
    height: 18,
    width: 75,
  },
  icon: {
    width: 60,
    height: 60,
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
  roundButton: {
    borderRadius: 40,
    backgroundColor: '#841584',
    height: 30,
    width: 30,
    paddingTop:0
  }
});
