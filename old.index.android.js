
 import React, { Component } from 'react';
 import {
   AppRegistry,
   Navigator
 } from 'react-native';

 import MapAndDetails from './components/map/MapAndDetails';
 import ListTrips from './components/trips/listTrips/ListTrips';
 import FBLoginView from './components/FBLoginView';

 import FirebaseFunctions from "./includes/FirebaseFunctions";
 var firebaseFunctions = new FirebaseFunctions();

 export default class Index extends Component {

  constructor(props){
     super(props);
     this.state = {
         userData: {},
         trips: []
     }
  }

  componentDidMount() {
      firebaseFunctions.getRef().child('trips').on('value', (snap) => {
          var trips = [];
          snap.forEach((child) => {
              trips.push({
                title: child.val().title,
                googleData: child.val().googleData,
                image: child.val().image,
                city: child.val().city,
                locations:child.val().locations,
                userData: child.val().userData,
                nbLocationsPerTrip: 0,
                isMyTrip: false, // @TODO : need fix
                key: child.key,
              })
          })
          console.log('trips', trips)
          this.setState({trips: trips})
      })
  }

  renderScene(route, navigator) {
    if(route.name == 'fBLoginView') {
     return <FBLoginView
      updateUserData={this.updateUserData.bind(this)}
      navigator={navigator} {...route.passProps}
      />
    }
    if(route.name === 'listTrips') {
     return <ListTrips
      trips={this.state.trips}
      userData={this.state.userData}
      onSelecetTrip={this.onSelecetTrip.bind(this)}
      navigator={navigator} {...route.passProps} />
    }
    if(route.name === 'mapTrip') {
     return <MapAndDetails
        trip={this.state.trip}
        navigator={navigator} {...route.passProps}
        locationsArr={this.state.locationsArr}
      />
    }
    if(route.name === 'capture') {
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
    console.log("onSelecetTrip", trip);
  }


  updateUserData(userData){
    this.setState({
      userData: userData
    })
  }

  render() {
    return (
        <Navigator
          trips={this.state.trips}
          style={{ flex:1 }}
          initialRoute={{ name: 'fBLoginView'}}
          renderScene={ this.renderScene.bind(this) }
          configureScene={(route, routeStack) =>
            Navigator.SceneConfigs.PushFromRight}
        />
    );
  }
}

 AppRegistry.registerComponent('socialMap', () => Index);
