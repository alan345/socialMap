
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import FBLoginView from './FBLoginView';
FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web); // defaults to Native


const React = require('react');
const {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
} = require('react-native');
const { Component } = React;


const window = Dimensions.get('window');


module.exports = class Menu extends Component {
  constructor(){
    super();
    this.state = {
      userData:{
          name : '',
          picture : {
            data : {
              url: ''
            }
          }
      }
    }
  }


  onChangeUserData(userData){
    this.setState({
      userData: userData
    })
    this.props.updateUserData(this.state.userData)
  }

  render() {
    return (

      <ScrollView scrollsToTop={false} style={styles.menu}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{uri: this.state.userData.picture.data.url}}
          />
          <Text style={styles.name}>{this.state.userData.name}</Text>
        </View>

        <Text
          onPress={() => this.props.onItemSelected('About')}
          style={styles.item}>
          Map
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('Contacts')}
          style={styles.item}>
          Contacts
        </Text>

        <FBLoginView
          updateUserData={this.onChangeUserData.bind(this)}/>


      </ScrollView>
    );
  }
};



const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#f5fcff',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',

    paddingBottom: 30,
  },
});
