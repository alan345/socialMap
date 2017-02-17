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
} from 'react-native';
import * as firebase from 'firebase';
import Firebase from "../../includes/firebase";
import ListItem from './ListItem';
import ShowLoading from '../ShowLoading';


export default class ListSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      search:{
        city:'',
      },
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };

    this.itemsRef = this.getRef().child('trips');
  }


  getRef() {
     return firebase.database().ref();
  }

  listenForItems() {
    let querySearch = this.getRef().child('trips').orderByChild("city").equalTo(this.state.search.city)
     querySearch.on('value', (snap) => {
       var items = [];
       snap.forEach((child) => {
         items.push({
           title: child.val().title,
           _key: child.key
         });
       });

       this.setState({
         isLoading:false,
         dataSource: this.state.dataSource.cloneWithRows(items)
       });
   });
  }

  _renderItem(item) {
    return (
      <ListItem item={item} />
    );
  }

  componentDidMount() {
    this.listenForItems();
  }
  _onChangeText(description) {

    this.setState({
      isLoading:true,
      search : {
        city:description
      }
    }, function() {
      this.listenForItems()
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <ShowLoading
          isLoading={this.state.isLoading}
        />
        <TextInput
          placeholder = "City"
          style={styles.inputField}
          onChangeText={this._onChangeText.bind(this)}
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
        />
        <Text>
          Welcome ! {this.state.search.city}
        </Text>
        <Text style={styles.instructions}>
          YO
        </Text>

        <Text style={styles.instructions}>
          Current selected
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    padding: 10,
  },
  viewInputSearch: {
    position: 'absolute',

  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  inputField:{
    width:100,
  }
});
