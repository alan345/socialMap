import React, { Component } from 'react';
import  {View, Text, Button, StyleSheet} from 'react-native';
var {FBLogin, FBLoginManager} = require('react-native-facebook-login');
import FirebaseFunctions from "../includes/FirebaseFunctions";


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


  componentDidMount() {
    this.props.updateUserData(this.state.userData)

  }

  onLogoutFunction(){
    this.state = {
      userData:initUserData
    }
    this.props.updateUserData(this.state.userData)
  }
  onLoginFoundFunction(userData) {
    component = this;
    this._child.getUser(userData.credentials).then(function(data){
      component.setState({
        userData: data
      })
      component.props.updateUserData(data)
    })
  }

  onLoginFunction(userData) {
    this._child.updateOrCreateUserToFirebase(userData)
    // this.setState({
    //   userData: userData.profile
    // })
    this.props.updateUserData(userData.profile)
  }


  render() {
    return (


          <View>
          <FirebaseFunctions ref={(child) => { this._child = child; }} />

            <FBLogin style={styles.FBLogin}

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

      width:200,
    },

});



module.exports = FBLoginView;
