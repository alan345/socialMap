import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import MapAndDetails from './map/MapAndDetails';
import ListTrips from './trips/listTrips/ListTrips';
import FBLoginView from './FBLoginView';
import FirebaseFunctions2 from "../includes/FirebaseFunctions2";
const firebaseFunctions = new FirebaseFunctions2();



export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            trips: ['sd'],
            trips: {}
        }
    }

    componentDidMount() {
        firebaseFunctions.getRef().child('trips').on('value', (snap) => {
            let trips = [];
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
            // console.log('trips', trips)
            this.setState({trips: trips})
        })
    }

    render() {
      return (
        <Navigator screenProps={ {trips: this.state.trips }} />
      )
    }
}

class LoginPageScreen extends React.Component {
  static navigationOptions = {
      header: {
        visible: false
      }
  }
  render() {
    return (
      <FBLoginView navigation={this.props.navigation} updateUserData={this.updateUserData.bind(this)}/>
    )
  }

  updateUserData(userData){
    this.setState({
      userData: userData
    })
  }
}


class ListTripsScreen extends React.Component {
  static navigationOptions = {
      header: {
        visible: false
      }
  }
  componentDidMount() {
    //  console.log("LoginPage screenProps", this.props.screenProps);
  }
  render() {
    return (
      <ListTrips navigation={this.props.navigation} trips={this.props.screenProps.trips}/>
    )
  }
}


class MapAndDetailsScreen extends React.Component {
  static navigationOptions = {
      header: {
        visible: false
      }
  }
  componentDidMount() {
    //  console.log("LoginPage screenProps", this.props.screenProps);
  }
  render() {
    return (
      <MapAndDetails navigation={this.props.navigation} trip={this.props.screenProps.trips[0]}/>
    )
  }
}

const Navigator = StackNavigator({
  LoginPageScreen: { screen: LoginPageScreen },
  ListTripsScreen: { screen: ListTripsScreen },
  MapAndDetailsScreen: { screen: MapAndDetailsScreen },
})






AppRegistry.registerComponent('socialMap', () => App);
