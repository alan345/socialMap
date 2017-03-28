import React, { Component } from 'react'; import {
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
import Firebase from "../../../includes/firebase";
import RowTrip from './RowTrip';
import AddTrip from '../AddTrip';
import AddTripButton from '../AddTripButton';
import ShowLoading from '../../ShowLoading';
import FirebaseFunctions from "../../../includes/FirebaseFunctions";
import AutocompleteAddress from "../../../includes/AutocompleteAddress";

var firebaseFunctions = new FirebaseFunctions();

const { width, height } = Dimensions.get('window');
const heightSearchTopMenuOpen = height / 2.5
const heightSearchTopMenuClose = 60

export default class ListTrips extends Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //console.log(firebaseFunctions.tripsCache)
    this.state = {
        styleHeight :{
          height:heightSearchTopMenuOpen
        },
        isLoading:false,
        showAddTrip:false,
        search:{
          city:'',
        },
        trip:{},
        trips: firebaseFunctions.tripsCache,
        dataSource: ds.cloneWithRows(firebaseFunctions.tripsCache)
    }
  }

  componentDidMount() {
      firebaseFunctions.listenForTrips();
      let _this = this;
      _this.updateListDataSource(_this);
      firebaseFunctions.addObserver('trips_changed', _this.updateListDataSource.bind(_this));
  }

  updateListDataSource() {
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(firebaseFunctions.tripsCache)
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

    /*
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
           nbLocationsPerTrip:this.nbLocationsPerTrip(child.val()),
           isMyTrip:this.isMyTrip(child.val()),
           key: child.key,
         });
       });
       */

       //
      //  this.setState({
      //      isLoading:false,
      //      dataSource: _this.state.dataSource.cloneWithRows(items)
      //   });



  // });
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

  onSelecetTrip(trip){
    console.log("ListTrip trip", trip)
    this.props.navigation.navigate('MapAndDetailsScreen', { trip: trip })
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
      <RowTrip
        item={item}
        onEditTrip={this.onEditTrip.bind(this)}
        onSelecetTrip={this.onSelecetTrip.bind(this)}
        userData={this.props.userData}
      />
    )
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
            userData={this.props.userData}
            showAddTrip={this.state.showAddTrip}
            hideAddTrip={this.hideAddTrip.bind(this)}
            trip={this.state.trip}
            onSelecetTrip={this.onSelecetTrip.bind(this)}
            ref={(child) => { this._childAddTrip = child; }}
          />

          <View style={styles.searchView}>
            <AutocompleteAddress
              onChangeText={this._onChangeText.bind(this)}
            />
          </View>
          <ShowLoading isLoading={this.state.isLoading} />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
          //  renderSectionHeader={this._renderSectionHeader.bind(this)}
            enableEmptySections={true}
            horizontal={false}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
          <AddTripButton
            onPressButtonTrip={this.onPressButtonTrip.bind(this)}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchView:{
    marginLeft: 40,
    marginRight: 10,
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
    height:height,
    paddingBottom:5,
    backgroundColor:'white',
  },
})
