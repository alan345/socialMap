const React = require('react');
const SideMenu = require('react-native-side-menu');
const Menu = require('./components/Menu');
//const JustMap = require('./JustMap');

import JustMap from './components/JustMap';
import Contacts from './components/Contacts';



const {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} = require('react-native');
const { Component } = React;

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
    selectedItem: 'About',
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen, });
  }

  onMenuItemSelected = (item) => {

    this.setState({
      isOpen: false,
      selectedItem: item,
    });
  }

  render() {
    const menu = <Menu onItemSelected={this.onMenuItemSelected} />;
    let isMenu1=false;
    let isMenu2=false;
    let isMenu3=false;
    if(this.state.selectedItem == "About") {
      isMenu1 = true;
    }
    if(this.state.selectedItem == "Contacts") {
      isMenu2 = true;
    }

    return (
      <SideMenu
        menu={menu}
        disableGestures={true}
        isOpen={this.state.isOpen}
        onChange={(isOpen) => this.updateMenuState(isOpen)}>
        {isMenu1 ?
          <JustMap/> : <Text></Text>
        }
        {isMenu2 ?
          <Contacts/> : <Text></Text>
        }


        <Button style={styles.button} onPress={() => this.toggle()}>
          <Image
            source={require('./assets/menu.png')} style={{width: 50, height: 50}} />
        </Button>
      </SideMenu>
    );
  }
};
