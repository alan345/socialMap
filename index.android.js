
 import React, { Component } from 'react';
 import {
   AppRegistry,
   Navigator
 } from 'react-native';

 import MapAndDetails from './components/map/MapAndDetails';
 import ListTrips from './components/trips/listTrips/ListTrips';
 import FBLoginView from './components/FBLoginView';
 import Capture from './components/Capture';


 export default class Index extends Component {
   constructor(props){
     super(props);
     this.state = {
       userData:{}
     }

  //   this.onSelecetTrip = this.onSelecetTrip.bind(this);
   }

  renderScene(route, navigator) {
    if(route.name == 'fBLoginView') {
     return <FBLoginView
      updateUserData={this.updateUserData.bind(this)}
      navigator={navigator} {...route.passProps}
      />
    }
    if(route.name == 'listTrips') {
     return <ListTrips
      userData={this.state.userData}
      onSelecetTrip={this.onSelecetTrip.bind(this)}
      navigator={navigator} {...route.passProps} />
    }
    if(route.name == 'mapTrip') {
     return <MapAndDetails
        trip={this.state.trip}
        navigator={navigator} {...route.passProps}
        locationsArr={this.state.locationsArr}
      />
    }
    if(route.name == 'capture') {
      return <Capture navigator={navigator} {...route.passProps} />
    }
  }

  onSelecetTrip(trip){
    let locations = trip.locations
    arr = []
    for(var key in locations){
        var location = locations[key]
        location['key'] = key
        location['title'] = locations[key].googleData.address_components.neighborhood
        arr.push(location)
    }
    this.setState({
      locationsArr: arr,
      trip: trip
    });

  }


  updateUserData(userData){
    this.setState({
      userData: userData
    })
  }

  render() {
    return (
        <Navigator
          style={{ flex:1 }}
          initialRoute={{ name: 'fBLoginView'}}
          renderScene={ this.renderScene.bind(this) }
          configureScene={(route, routeStack) =>
            Navigator.SceneConfigs.FloatFromBottom}
        />
    );
  }
}

 AppRegistry.registerComponent('socialMap', () => Index);
