import React, { Component } from 'react';
import  {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  LayoutAnimation,
  PanResponder,
  Animated,
} from 'react-native';
import FirebaseFunctions from "../includes/FirebaseFunctions";
const { width, height } = Dimensions.get('window');


class DetailsViews extends Component {
  constructor(props){
    super();
    this.state = {
      pan     : new Animated.ValueXY()
    };


    this.panResponder = PanResponder.create({
           onStartShouldSetPanResponder    : () => true,
           onPanResponderMove              : Animated.event([null,{
               dx  : 0,
               dy  : this.state.pan.y
           }]),
           onPanResponderRelease           : (e, gesture) => {
               if(this.isDropZone(gesture)){
                  //  this.setState({
                  //      showDraggable : true
                  //  });
                  Animated.spring(
                      this.state.pan,
                      {toValue:{x:0,y:-300}}
                  ).start();
               }else{
                   Animated.spring(
                       this.state.pan,
                       {toValue:{x:0,y:0}}
                   ).start();
               }
           }
       });
      }



      onPressDelete(){
        let marker = this.props.selectedMarker;
        this._child.deleteLocationToFirebase(marker)
      }

      isDropZone(gesture){
          return gesture.moveY > 0 && gesture.moveY <  350;
      }

      _onChangeText(description) {


        let marker = this.props.selectedMarker;
        marker.description = description
        this._child.updateLocationToFirebase(marker)
      }

      render(){
              return (

                <View style={styles.draggableContainer}>
                    <FirebaseFunctions ref={(child) => { this._child = child; }} />
                    {this.props.showDetailsList ?
                    <Animated.View
                        {...this.panResponder.panHandlers}
                        style={[this.state.pan.getLayout(), styles.detailsList]}>

                        <View style={styles.countainerPicture}>
                          <Image
                            style={styles.icon}
                            source={{uri: this.props.selectedMarker.imagePin}}
                          />
                          <Text style={styles.text}>City: {this.props.selectedMarker.city}</Text>
                          <Image
                            style={styles.iconRight}
                            source={{uri: this.props.selectedMarker.userData.picture.data.url}}
                          />
                          <Text style={styles.deleteText}
                            onPress={this.onPressDelete.bind(this)}
                          >X</Text>

                        </View>




                          <Text>Address: {this.props.selectedMarker.address}</Text>




                          <Text>Country: {this.props.selectedMarker.country}</Text>
                          <Text>Coordinates: {this.props.selectedMarker.coordinate.latitude}</Text>
                          <Text>Coordinates: {this.props.selectedMarker.coordinate.longitude}</Text>
                          <Text>Date: {this.props.selectedMarker.datePin}</Text>
                          <Text>Key: {this.props.selectedMarker.key}</Text>

                          <TextInput
                            // onChangeText={(description) => this.setState({
                            //     selectedMarker: {
                            //       key: this.props.selectedMarker.key,
                            //       imagePin: this.props.selectedMarker.imagePin,
                            //       address : this.props.selectedMarker.address,
                            //       description: description,
                            //       coordinate : this.props.selectedMarker.coordinate
                            //     }
                            //   })}

                                onChangeText={this._onChangeText.bind(this)}

                              value={this.props.selectedMarker.description}
                            />
                    </Animated.View>
                    : <Text></Text>
                    }
                </View>
            );

      }
};


let Window = Dimensions.get('window');
const styles = StyleSheet.create({
    FBLogin: {
      width:200,
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
    deleteText : {
       marginTop   : 10,
      // marginLeft  : 5,
       marginRight : 5,
      // textAlign   : 'center',
      color       : 'black',
      fontSize : 30
    },
     text        : {
         marginTop   : 25,
         marginLeft  : 5,
         marginRight : 5,
         textAlign   : 'center',
         color       : 'black'
     },
     draggableContainer: {
         position    : 'absolute',
         top         : Window.height-200,
         left        : 0,
     },
     detailsList      : {
         backgroundColor     : '#F7F7F7',
         width               : Window.width,
         height              : 800,
         borderRadius        : 5
     }
});



module.exports = DetailsViews;
