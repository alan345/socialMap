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
import RowLocation from './RowLocation';

export default class ListLocations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  }


  _renderRow(item) {
    return (
      <RowLocation
        item={item}
        onSelecetLocation={this.props.onSelecetLocation}
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

  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});
