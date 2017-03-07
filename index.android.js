/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


 /**
  * Sample React Native App
  * https://github.com/facebook/react-native
  * @flow
  */

 import React, { Component } from 'react';
 import {
   AppRegistry, Navigator
 } from 'react-native';

 import SocialMap from './socialMap';
 import JustMap from './components/map/JustMap';
 import ListTrips from './components/trips/ListTrips';

 import Capture from './components/Capture';


 export default class Index extends Component {

  renderScene(route, navigator) {
     if(route.name == 'listTrips') {
       return <ListTrips navigator={navigator} {...route.passProps} />
     }
     if(route.name == 'mapTrip') {
       return <JustMap navigator={navigator} {...route.passProps} />
     }


     if(route.name == 'my_trip') {
       return <SocialMap navigator={navigator} {...route.passProps} />
     }
     if(route.name == 'capture') {
       return <Capture navigator={navigator} {...route.passProps} />
     }
  }


  render() {
    return (
        <Navigator
          style={{ flex:1 }}
          initialRoute={{ name: 'listTrips'}}
          renderScene={ this.renderScene }
          configureScene={(route, routeStack) =>
            Navigator.SceneConfigs.FloatFromBottom}
        />
    );
  }
}

 AppRegistry.registerComponent('socialMap', () => Index);
