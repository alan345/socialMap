import React, { Component } from 'react';
import  {View, Text, Button, StyleSheet} from 'react-native';
var {FBLogin, FBLoginManager} = require('react-native-facebook-login');


class FBLoginView extends Component {
  constructor(props){
    super();
    this.state = {
      userData:{}
    }
  }




  onUpdateUserData(userData) {
    this.setState({
      userData: userData
    })
    this.props.updateUserData(this.state.userData)
  }


  render() {
    return (
          <View>
            <FBLogin style={styles.FBLogin}

              ref={(fbLogin) => { this.fbLogin = fbLogin }}
              permissions={["email","user_friends"]}
              loginBehavior={FBLoginManager.LoginBehaviors.Native}
              onLogin={this.onUpdateUserData.bind(this)}
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

          </View>
    );
  }
};


const styles = StyleSheet.create({

    FBLogin: {

      width:200,
    },

});



module.exports = FBLoginView;
