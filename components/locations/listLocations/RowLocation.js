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


export default class RowLocation extends Component {

  constructor(props) {
      super(props)

      this.state = {
          address: this.props.item.googleData && this.props.item.googleData.address || 'no adress',
          neighborhood: this.props.item.googleData && this.props.item.googleData.address_components.neighborhood || 'no neighborhood',
          uri: this.props.item.googleData && this.props.item.googleData.imagePin || this.props.item.image
      }
  }


  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.onSelecetLocation(this.props.item)
        }}
      >

        <View style={styles.singleItem} >
            <View style={styles.row}>
              <View>
                <Image
                  style={styles.icon}
                  source={{uri:this.state.uri}}
                />
              </View>
            </View>
            <View>
              <Text>{this.state.address}</Text>
              <Text>{this.state.neighborhood}</Text>
            </View>


        </View>
      </TouchableWithoutFeedback>

    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  singleItem:{
    flex: 1,
    flexDirection: 'column',
    borderRadius: 5,
    marginRight:10,
    padding: 10,
    backgroundColor: '#ffffff'
  },
  row: {
    flexDirection: 'row',

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
