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
  TouchableOpacity,
  Image,
  TouchableHighlight,
} from 'react-native';
import * as firebase from 'firebase';
import Firebase from "../../includes/firebase";
import SingleTrip from './SingleTrip';
import AddTrip from './AddTrip';
import ShowLoading from '../ShowLoading';
import FirebaseFunctions from "../../includes/FirebaseFunctions";

export default class ListTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:true,
      showAddTrip:false,
      search:{
        city:'',
      },
      trip:{},
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };

    this.itemsRef = this.getRef().child('trips');
  }


  getRef() {
     return firebase.database().ref();
  }

  showAddTrip() {
    this.setState({showAddTrip:true})
  }

  hideAddTrip() {
    this.setState({showAddTrip:false})
  }

  listenForItems() {
    let querySearch
    if(this.state.search.city) {
      querySearch = this.getRef().child('trips').orderByChild("city").equalTo(this.state.search.city)
    } else {
      querySearch = this.getRef().child('trips')
    }

     querySearch.on('value', (snap) => {
       var items = [];
       snap.forEach((child) => {
         items.push({
           title: child.val().title,
           image: child.val().image,
           city: child.val().city,
           key: child.key
         });
       });

       this.setState({
         isLoading:false,
         dataSource: this.state.dataSource.cloneWithRows(items)
       });
   });
  }

  onItemSelected(){
    this.props.onItemSelected('MyMaps')
  }


  onPressButtonTrip(){
  //  this.props.onItemSelected('MyMaps')
    this.setState({
      showAddTrip:true,
      trip:{
        city:'',
        title:'',
        image:'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
      }
    }, function(){
      this._childAddTrip.propsToState()
    })
  }

  onPressTrip(item){
    this.setState({
      showAddTrip:true,
      trip:item
    },function(){
      this._childAddTrip.propsToState()
    })
  }

  _renderRow(item) {
    return (
      <SingleTrip
        item={item}
        onPressTrip={this.onPressTrip.bind(this)}
        onItemSelected={this.onItemSelected.bind(this)}
      />
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
        <AddTrip
          showAddTrip={this.state.showAddTrip}
          hideAddTrip={this.hideAddTrip.bind(this)}
          trip={this.state.trip}
          ref={(child) => { this._childAddTrip = child; }}
        />
        <FirebaseFunctions ref={(child) => { this._child = child; }} />
        <ShowLoading isLoading={this.state.isLoading} />
        <TextInput
          placeholder = "City"
          style={styles.inputField}
          onChangeText={this._onChangeText.bind(this)}
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
        <TouchableOpacity
          style={styles.addIconTouchableOpacity}
          onPress={this.onPressButtonTrip.bind(this)}
        >
          <Image
            style={styles.addIcon}
            source={require('../../assets/add_button.png')}
          />
        </TouchableOpacity>


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
  addIcon:{
    width: 60,
    height: 60,
  },
  addIconTouchableOpacity : {
    right:10,
    bottom:50,
    position: 'absolute',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
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
