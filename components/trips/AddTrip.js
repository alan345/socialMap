import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  Modal
} from 'react-native'
import ShowLoading from '../ShowLoading'
import FirebaseFunctions from '../../includes/FirebaseFunctions'
import GoogleAPI from '../../includes/GoogleAPI'
import LoginFunctions from '../../includes/LoginFunctions'
import AutocompleteAddress from '../../includes/AutocompleteAddress'

var firebaseFunctions = new FirebaseFunctions()
var loginFunctions = new LoginFunctions()
var googleAPI = new GoogleAPI()

export default class AddTrip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      showAddTrip: false,
      inputAutocomplete: '',
      trip: {
        googleData: {},
        locations: {},
        title: '',
        image: 'http://ozandgo.com/wp-content/uploads/2014/10/covoiturage-australie-van-roadtrip.jpg'
      }
    }
  }

  saveTrip () {
    this._childShowLoading.showLoading()
    let inputAutocomplete = this.state.inputAutocomplete
    let component = this
    googleAPI.getDataFromGoogleAPiByAddress(inputAutocomplete).then(function (marker) {
      if(component.props.trip.key) {
        firebaseFunctions.addLocationToFirebase(marker, component.props.trip)
      } else {
          let trip = component.state.trip
          trip.googleData = marker.googleData
          trip.title = 'new title'
          trip.city = marker.googleData.address_components.locality
          trip.userData = loginFunctions.getUserData()
          var firstMarker = {
            coordinates: trip.googleData.coordinateGoogleAddress,
            googleData: trip.googleData,
            description: 'My new fresh Trip'
          }
          firebaseFunctions.addTrip(trip).then(function (trip) {
            component.props.onSelectTrip(trip)
            firebaseFunctions.addLocationToFirebase(firstMarker, trip.key)
            component.closeWindows()
          }).catch(function (e) {
             console.log(e)
          })

        }
      })
  }

  _onChangeText (description) {
    this.setState({
      inputAutocomplete: description
    })
  }

  closeWindows(){
    this.setState({
      showAddTrip:false
    })
  }

  showAddTrip(){
    this.setState({
      showAddTrip:true
    })
  }

  render () {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showAddTrip}
          onRequestClose={() => { this.closeWindows() }}
          >

         <View style={styles.container}>
          <View>
            <ShowLoading
              ref={(child) => { this._childShowLoading = child }}
            />
            <Text>Chose your departure</Text>
            <View style={styles.searchView}>
            <AutocompleteAddress
              onChangeText={this._onChangeText.bind(this)}
            />
            </View>
            <Text></Text>
            <Text></Text>
            <Button
              onPress={this.saveTrip.bind(this)}
              title='Ok'
              color='#841584'
              accessibilityLabel='ok'
            />
            <Text></Text>
            <Button
              onPress={this.closeWindows.bind(this)}
              title='Cancel'
              color='#841584'
              accessibilityLabel='cancel'
            />
          </View>
         </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchView: {
    flexDirection: 'row'
  },
  container: {
    padding: 40
  }
})
