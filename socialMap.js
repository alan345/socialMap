const React = require('react');
const SideMenu = require('react-native-side-menu');
const Menu = require('./components/Menu');

import JustMap from './components/map/JustMap';
import Contacts from './components/Contacts';
import ListTrips from './components/trips/ListTrips';


const {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} = require('react-native');
const { Component } = React;


class Button extends Component {
  handlePress(e) {
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={this.props.style}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

module.exports = class socialMap extends Component {
  state = {
    isOpen: false,
    selectedItem: 'MyMaps',
    userData :{}
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen, });
  }

  onChangeUserData(userData){
    this.setState({
      userData: userData
    })
  }

  onMenuItemSelected = (item) => {
    //nico help. si je change de menu, jai une erreur. je perds lhistorique
    //setState(…): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op


    this._childJustMap.onEditTripMode(false)

    this.setState({
      isOpen: false,
      selectedItem: item,
    });
  }

  render() {



    const menu = <Menu onItemSelected={this.onMenuItemSelected} updateUserData={this.onChangeUserData.bind(this)}/>;
    let isMenuAbout=false;
    let isMenuContacts=false;
    let isMenuMyMaps=false;

    // if(this.state.selectedItem == "About") {
    //   isMenuAbout = true;
    // }
    if(this.state.selectedItem == "MyMaps") {
      isMenuMyMaps = true;
    }

    if(this.state.selectedItem == "Contacts") {
      isMenuContacts = true;
    }


    return (
      <SideMenu
        menu={menu}
        disableGestures={true}
        isOpen={this.state.isOpen}
        onChange={(isOpen) => this.updateMenuState(isOpen)}>


        {isMenuMyMaps ?
          <JustMap
            ref={(child) => { this._childJustMap = child; }}
            userData={this.state.userData}
          /> : <View/>
        }
        {isMenuContacts ?
          <Contacts userData={this.state.userData}/> : <Text></Text>
        }


        <Button style={styles.button} onPress={() => this.toggle()}>
          <Image
            source={require('./assets/menu.png')} style={{width: 50, height: 50}} />
        </Button>
      </SideMenu>
    );
  }
};


const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    padding: 10,
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
