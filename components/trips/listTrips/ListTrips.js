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
      this._childShowLoading.showLoading()
      firebaseFunctions.listenForTrips();
      let _this = this;
      _this.updateListDataSource(_this);
      firebaseFunctions.addObserver('trips_changed', _this.updateListDataSource.bind(_this))


  }

  updateListDataSource() {
      let _this = this;
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(firebaseFunctions.tripsCache)
      }, function() {
        _this._childShowLoading.hideLoading()
      })
  }

  showAddTrip() {

  }

  hideAddTrip() {

  }



  listenForItems() {
  }


  onPressButtonTrip(){
    this._childAddTrip.showAddTrip()
  }

  onSelectTrip (trip) {
    let _this = this
    this._childShowLoading.showLoading()
    firebaseFunctions.listenTrip(trip.key)

    setTimeout(function () {
      _this.props.navigation.navigate('MapAndDetailsScreen')
    }, 20)
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
        onSelectTrip={this.onSelectTrip.bind(this)}
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
            onSelectTrip={this.onSelectTrip.bind(this)}
            ref={(child) => { this._childAddTrip = child; }}
          />


          <View style={styles.searchView}>
            <AutocompleteAddress
              onChangeText={this._onChangeText.bind(this)}
            />
          </View>

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
          <ShowLoading
            ref={(child) => { this._childShowLoading = child; }}
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
