import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
  ListView,
} from 'react-native';
import SingleLocation from './SingleLocation';

export default class ListLocations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  }
  onSelecetLocation(location){

  }

  _renderRow(item) {
    return (
      <SingleLocation
        item={item}
        onSelecetTrip={this.onSelecetLocation.bind(this)}
        userData={this.props.userData}
      />
    );
  }

  componentDidMount() {
    this.listenForItems();
  }


  listenForItems() {
    let locations = this.props.trip.locations
    arr = []
    for(var key in locations){
        var location = locations[key]
        location['key'] = key
        arr.push(location)
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(arr),
      isLoading:false,
    })
  }


  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
        //  renderSectionHeader={this._renderSectionHeader.bind(this)}
          enableEmptySections={true}
          horizontal={false}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 30,
    bottom: 70,
    right: 15,
  }
});
