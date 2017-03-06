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
 import Capture from './components/Capture';


 export default class Index extends Component {

  renderScene(route, navigator) {
     if(route.name == 'trip_ideas') {
       return <SocialMap navigator={navigator} {...route.passProps} />
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
          initialRoute={{ name: 'trip_ideas'}}
          renderScene={ this.renderScene }
          />
    );
  }
}

 AppRegistry.registerComponent('socialMap', () => Index);
