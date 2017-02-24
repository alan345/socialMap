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

import SearchInput from './SearchInput'
const { width, height } = Dimensions.get('window');
const heightSearchTopMenuOpen = height / 3
const heightSearchTopMenuClose = 60

export default class ListTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styleHeight :{
        height:heightSearchTopMenuOpen
      },
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

  showAddTrip() {
    this.setState({showAddTrip:true})
  }

  hideAddTrip() {
    this.setState({showAddTrip:false})
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

  onTripSelected(item){
    this.props.onTripSelected(item)
  }

  onEditTrip(item){
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
        onEditTrip={this.onEditTrip.bind(this)}
        onTripSelected={this.onTripSelected.bind(this)}
      />
    );
  }
  onCleanInput(){
  //  this.refs['GooglePlacesAutocomplete'].setNativeProps({text: ''});
    this.setState({
      isLoading:true,
      search : {
        city:''
      }
    }, function() {
      this.listenForItems()
    })

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
    return (

      <View style={[styles.container,this.state.styleHeight]}>
      <TouchableOpacity onPress={this.onTogggleTrips.bind(this)}>

        <AddTrip
          userData={this.props.userData}
          showAddTrip={this.state.showAddTrip}
          hideAddTrip={this.hideAddTrip.bind(this)}
          trip={this.state.trip}
          onTripSelected={this.onTripSelected.bind(this)}
          ref={(child) => { this._childAddTrip = child; }}
        />
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
        <TouchableOpacity
          style={styles.addIconTouchableOpacity}
          onPress={this.onPressButtonTrip.bind(this)}
        >
          <Image
            style={styles.addIcon}
            source={require('../../assets/add_button.png')}
          />
        </TouchableOpacity>

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
  button: {
    position: 'absolute',
    top: 20,
    padding: 10,
  },
  viewInputSearch: {
    position: 'absolute',
  },
  addIcon:{
    width: 35,
    height: 35,
  },
  addIconTouchableOpacity : {
    right:10,
    top:10,
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
    position: 'absolute',
    top:0,
    width: width,
    backgroundColor: '#F5FCFF',
    paddingBottom:5,

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
  }
});
