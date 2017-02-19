import React, {Component} from 'react';
import ReactNative from 'react-native';
import  {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';


class ListItem extends Component {
  render() {
    return (

        <View style={styles.container}>
          <Image source={{ uri: this.props.item.image}} style={styles.photo} />
          <Text style={styles.text}>{this.props.item.title}</Text>
        </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
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

module.exports = ListItem;
