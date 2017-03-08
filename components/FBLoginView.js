import React, { Component } from 'react';
import {View, Text, Button, StyleSheet, Dimensions} from 'react-native';
var {FBLogin, FBLoginManager} = require('react-native-facebook-login');
import FirebaseFunctions from "../includes/FirebaseFunctions";
const { width, height } = Dimensions.get('window');

let initUserData = {
    name : "",
    picture : {
      data : {
        url: 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png'
      }
    }
}

class FBLoginView extends Component {
  constructor(props){
    super();
    this.state = {
      userData:initUserData
    }
  }

  updateUserData(userData){
    // this.setState({
    //   userData: userData
    // })
    // this.updateUserData(this.state.userData)
  }

  componentDidMount() {
  //  this.updateUserData(this.state.userData)
  }

  onLogoutFunction(){
    // this.state = {
    //   userData:initUserData
    // }
    // this.updateUserData(this.state.userData)
  }
  onLoginFoundFunction(userData) {
    let component = this
    this._child.getUser(userData.credentials).then(function(data){


      component.props.updateUserData(data)
      component.goToNextScreen()
    })
  }


  goToNextScreen(){
    this.props.navigator.replace({
        name: 'listTrips'
    });
  }

  onLoginFunction(userData) {
    this._child.updateOrCreateUserToFirebase(userData)
    // this.setState({
    //   userData: userData
    // })
    this.goToNextScreen()
    //this.updateUserData(userData.profile)
  }


  render() {
    return (
      <View style={styles.container}>
        <FirebaseFunctions ref={(child) => { this._child = child; }} />
        <FBLogin
          style={styles.FBLogin}
          ref={(fbLogin) => { this.fbLogin = fbLogin }}
          permissions={["email","user_friends"]}
          loginBehavior={FBLoginManager.LoginBehaviors.Native}
          onLogin={this.onLoginFunction.bind(this)}
          onLogout={this.onLogoutFunction.bind(this)}
          onLoginFound={this.onLoginFoundFunction.bind(this)}
          onLoginNotFound={function(){
            console.log("No user logged in.");
          }}
          onError={function(data){
            console.log("ERROR");
            console.log(data);
          }}
          onCancel={function(){
            console.log("User cancelled.");
          }}
          onPermissionsMissing={function(data){
            console.log("Check permissions!");
            console.log(data);
          }}
        />
      </View>
    );
  }
};



const styles = StyleSheet.create({
    FBLogin: {
      width: window.width,
      height: window.height,
    },
    container: {
      position: 'absolute',
      top:0,

      width: window.width,
      height: window.height,
      padding: 20,
    },
});



module.exports = FBLoginView;
