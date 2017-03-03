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

import AddTripButton from './AddTripButton';

import ShowLoading from '../ShowLoading';
import FirebaseFunctions from "../../includes/FirebaseFunctions";

import SearchInput from './SearchInput'
const { width, height } = Dimensions.get('window');
const heightSearchTopMenuOpen = height / 2.5
const heightSearchTopMenuClose = 60

export default class ListTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styleHeight :{
        height:heightSearchTopMenuOpen
      },
      isLoading:true,

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

  onTogggleTrips(){
    if(this.state.styleHeight.height == heightSearchTopMenuClose) {
      this.onIncreaseTrips()
    } else {
      this.onReduceTrips()
    }
  }
  onReduceTrips() {
    this.setState({
      styleHeight:{
        height:heightSearchTopMenuClose
      }
    })
  }

  onIncreaseTrips() {
    this.setState({
      styleHeight:{
        height:heightSearchTopMenuOpen
      }
    })
  }

  getRef() {
     return firebase.database().ref();
  }



  listenForItems() {
    let querySearch
    if(this.state.search.city) {
      querySearch = this.getRef().child('trips').orderByChild("googleData/address").equalTo(this.state.search.city)
    } else {
      querySearch = this.getRef().child('trips')
    }

     querySearch.on('value', (snap) => {
       var items = [];
       snap.forEach((child) => {
         items.push({
           title: child.val().title,
           googleData: child.val().googleData,
           image: child.val().image,
           city: child.val().city,
           locations:child.val().locations,
           userData: child.val().userData,
           key: child.key,

         });
       });

       this.setState({
         isLoading:false,
         dataSource: this.state.dataSource.cloneWithRows(items)
       });
   });
  }




  onPressButtonTrip(){
  //  this.props.onItemSelected('MyMaps')
    this.setState({
      showAddTrip:true,
      trip:{
        city:'',
        title:'',
        image:'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png',
        locations:{},
      }
    }, function(){
      this._childAddTrip.propsToState()
    })
  }

  onSelecetTrip(item){
    this.props.onSelecetTrip(item)
  }



  _renderRow(item) {
    return (
      <SingleTrip
        item={item}
//        onEditTrip={this.onEditTrip.bind(this)}
        onSelecetTrip={this.onSelecetTrip.bind(this)}
        userData={this.props.userData}
      />
    );
  }


  componentDidMount() {
    this.listenForItems();
  }
  _onChangeText(description) {
    this.onIncreaseTrips()
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
    if(this.props.isEditingMyTrip)
      return null
    return (

      <View style={[styles.container,this.state.styleHeight]}>

        <AddTripButton
          onPressButtonTrip={this.onPressButtonTrip.bind(this)}
        />
        <TouchableOpacity onPress={this.onTogggleTrips.bind(this)}>

          <FirebaseFunctions ref={(child) => { this._child = child; }} />
          <ShowLoading isLoading={this.state.isLoading} />
          <View style={styles.searchView}>
            <SearchInput
              onChangeText={this._onChangeText.bind(this)}
            />
            <TouchableOpacity onPress={this.onTogggleTrips.bind(this)}>
              <Text style={styles.TouchableOpacityCleanInput}> ⇅</Text>
            </TouchableOpacity>
            <View style={{width: 75}}>
            </View>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
        </TouchableOpacity>
      </View>


    );
  }
}
const styles = StyleSheet.create({
  searchView:{
    marginLeft: 40,
    flexDirection: 'row',
  },
  TouchableOpacityCleanInput:{
    paddingTop:22,
    fontSize: 25,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  container: {
    position: 'absolute',
    top:0,
    width: width,
    backgroundColor: '#F5FCFF',
    paddingBottom:5,
  },
});
