import React, { Component } from 'react';
import  {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import FirebaseFunctions from "../includes/FirebaseFunctions";
const { width, height } = Dimensions.get('window');



class DetailsViews extends Component {
  constructor(props){
    super();
    this.state = {
    }
    this._onPressDetailsViews = this._onPressDetailsViews.bind(this);

  }


  _onPressDetailsViews() {
    if(this.props.heightDetailsList.height == height /2) {
      this.setState({
        heightDetailsList: {
          height: height /3,
        }
      })
    } else {
      this.setState({
        heightDetailsList: {
          height: height /2,
        }
      })
    }

  }

  render() {
    return (
      <View>
          <TouchableHighlight
            onPress={this._onPressDetailsViews}
          >
            <View style={[this.props.heightDetailsList, styles.eventList]}>
              <ScrollView>
                <View style={styles.countainerPicture}>
                  <Image
                    style={styles.icon}
                    source={{uri: this.props.selectedMarker.imagePin}}
                  />
                  <Image
                    style={styles.iconRight}
                    source={{uri: this.props.selectedMarker.userData.picture.data.url}}
                  />
                </View>


                  <Text>Address: {this.props.selectedMarker.address}</Text>



                  <Text>City: {this.props.selectedMarker.city}</Text>
                  <Text>Country: {this.props.selectedMarker.country}</Text>
                  <Text>Coordinates: {this.props.selectedMarker.coordinate.latitude}</Text>
                  <Text>Coordinates: {this.props.selectedMarker.coordinate.longitude}</Text>
                  <Text>Date: {this.props.selectedMarker.datePin}</Text>
                  <Text>Key: {this.props.selectedMarker.key}</Text>

                  <TextInput
                    onChangeText={(description) => this.setState({
                        selectedMarker: {
                          key: this.props.selectedMarker.key,
                          imagePin: this.props.selectedMarker.imagePin,
                          address : this.props.selectedMarker.address,
                          description: description,
                          coordinate : this.props.selectedMarker.coordinate
                        }
                      })}

                      value={this.props.selectedMarker.description}
                    />

                </ScrollView>

            </View>
          </TouchableHighlight>

      </View>
    );
  }
};


const styles = StyleSheet.create({

    FBLogin: {

      width:200,
    },
    eventList: {
      backgroundColor: '#F5FCFF',
      width: width/1.8
    },
    countainerPicture: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 65,
      padding: 5
    },
    icon: {
      width: 60,
      height: 60,
    },
    iconRight: {
      width: 60,
      height: 60,
      borderRadius: 30,

    },
});



module.exports = DetailsViews;
