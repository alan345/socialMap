import React, { Component } from 'react';
import {View, Text, Button, StyleSheet, Dimensions} from 'react-native';
var {FBLogin, FBLoginManager} = require('react-native-facebook-login');

import LoginFunctions from "../includes/LoginFunctions";
const { width, height } = Dimensions.get('window');
import ShowLoading from './ShowLoading';

var loginFunctions = new LoginFunctions();


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
    loginFunctions.updateOrCreateUserToFirebase(userData)
    this.props.updateUserData(userData)
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
    let _this = this
    this._childShowLoading.showLoading()
    loginFunctions.getUser(userData.credentials).then(function(data){
      let updatedUserData = {
        credentials:userData.credentials,
        provider:userData.provider,
        type:userData.type,
        profile:data.profile
      }
      _this.updateUserData(updatedUserData)
      loginFunctions.saveUserData(updatedUserData)
      _this.goToNextScreen()
    })
  }


  goToNextScreen(){

    this.props.navigation.navigate('ListTripsScreen');
  }

  onLoginFunction(userData) {
    loginFunctions.updateOrCreateUserToFirebase(userData)
    this.props.updateUserData(userData)
    // this.setState({
    //   userData: userData
    // })

    this.goToNextScreen()
    //this.updateUserData(userData.profile)
  }


  render() {
    return (
      <View style={styles.container}>
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
            // console.log(data);
          }}
        />
        <ShowLoading
          ref={(child) => { this._childShowLoading = child; }}
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
