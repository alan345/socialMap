import React, { Component } from 'react';
import View, {Button, StyleSheet} from 'react-native';
var {FBLogin, FBLoginManager} = require('react-native-facebook-login');


class FBLoginView extends Component {
  render() {
    return (

          <FBLogin style={styles.FBLogin}

            ref={(fbLogin) => { this.fbLogin = fbLogin }}
            permissions={["email","user_friends"]}
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            onLogin={function(data){
              console.log("Logged in!");
              console.log(data);
            }}
            onLogout={function(){
              console.log("Logged out.");
            }}
            onLoginFound={function(data){
              console.log("Existing login found.");
              console.log(data);
            }}
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
    );
  }
};


const styles = StyleSheet.create({

    FBLogin: {

      width:200,
    },

});



module.exports = FBLoginView;
