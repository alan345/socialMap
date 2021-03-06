
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
  TouchableWithoutFeedback
} = require('react-native');
const { Component } = React;


const window = Dimensions.get('window');


module.exports = class Menu extends Component {
  constructor(props){
    super(props);
    this.state = {
      userData:{
          name : '',
          picture : {
            data : {
              url: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png'
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


          <TouchableWithoutFeedback  onPress={() => this.props.onItemSelected('Contacts')}>
                <View style={styles.avatarContainer}>
                      <Image
                        style={styles.avatar}
                        source={{uri: this.state.userData.picture.data.url}}
                      />
                      <Text style={styles.name}>{this.state.userData.name}</Text>
                </View>
            </TouchableWithoutFeedback>


            <Text
              onPress={() => this.props.onItemSelected('MyMaps')}
              style={styles.item}>
              My Trips
            </Text>

            <Text
              onPress={() => this.props.onItemSelected('MyMaps')}
              style={styles.item}>
              Trip Ideas
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
