import React from 'react'
import {
  AppRegistry,
  Text,
  View,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation'

import MapAndDetails from './map/MapAndDetails'
import ListTrips from './trips/listTrips/ListTrips'
import FBLoginView from './FBLoginView'
import Capture from './Capture'
import FirebaseFunctions from "../includes/FirebaseFunctions"
const firebaseFunctions = new FirebaseFunctions()
import { Client, Configuration } from "bugsnag-react-native"
const configuration = new Configuration(),
      client = new Client(configuration)


export default class App extends React.Component {
    render() {
      return (
        <Navigator />
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
      <FBLoginView navigation={this.props.navigation} updateUserData={this.updateUserData.bind(this)} />
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
  render() {
    return (
      <ListTrips navigation={this.props.navigation} />
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
      <MapAndDetails navigation={this.props.navigation} />
    )
  }
}


class CaptureScreen extends React.Component {
    static navigationOptions = {
        header: {
          visible: false
        }
    }

    render() {
      return (
        <Capture navigation={this.props.navigation} />
      )
    }
}



const Navigator = StackNavigator({
    LoginPageScreen: { screen: LoginPageScreen },
    ListTripsScreen: { screen: ListTripsScreen },
    MapAndDetailsScreen: { screen: MapAndDetailsScreen },
    CaptureScreen: { screen: CaptureScreen }
})






AppRegistry.registerComponent('socialMap', () => App);
