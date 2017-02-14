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
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import FirebaseFunctions from "../includes/FirebaseFunctions";
const { width, height } = Dimensions.get('window');


class DetailsViews extends Component {
  constructor(props){
    super();
    this.state = {
      pan     : new Animated.ValueXY(),
      position : 0
    };


    this.panResponder = PanResponder.create({
         onStartShouldSetPanResponder    : () => true,
         onPanResponderMove              : Animated.event([null,{
             dx  : 0,
             dy  : this.state.pan.y
         }]),
         onPanResponderRelease           : (e, gesture) => {
            this.state.pan.flattenOffset();
             if(this.isDropZone(gesture)){
               this.onSetPositionDetails(2)
             }else{
                this.onSetPositionDetails(1)
             }
         },
         onPanResponderGrant: (e, gestureState) => {
            this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
            this.state.pan.setValue({x: 0, y: 0});
          },
       });
      }

      onReduceDetails() {
        if(this.state.position == 2)
          this.onSetPositionDetails(1)
        if(this.state.position == 1)
          this.onSetPositionDetails(0)
      }
      onShowDetails() {
        if(this.state.position == 0)
          this.onSetPositionDetails(1)
        // if(this.state.position == 1)
        //   this.onSetPositionDetails(2)
        if(this.state.position == 2)
          this.onSetPositionDetails(1)
      }

      onPressImage() {
        if(this.state.position == 1)
          this.onSetPositionDetails(2)
        if(this.state.position == 2)
          this.onSetPositionDetails(1)

      }


      onSetPositionDetails(position) {
        this.setState({position:position})
        let yPosition = 0
        if(position == 0)
          yPosition = 0

        if(position == 1)
          yPosition = -90

        if(position == 2)
          yPosition = -400

        if(position == 3)
          yPosition = -600

        Animated.spring(
            this.state.pan,
            {toValue:{x:0,y:yPosition}}
        ).start();
      }

      componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
      }

      componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }


      _keyboardDidShow () {
        this.onSetPositionDetails(3)
      }

      _keyboardDidHide () {
        this.onSetPositionDetails(2)
      }


      onPressDelete(){
        this.onSetPositionDetails(0)
        let marker = this.props.selectedMarker;
        this._child.deleteLocationToFirebase(marker)
      }

      isDropZone(gesture){
          return gesture.moveY > 0 && gesture.moveY <  380;
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
                    <Animated.View
                        {...this.panResponder.panHandlers}
                        style={[this.state.pan.getLayout(), styles.detailsList]}>

                        <View
                          style={styles.headerDetails}
                        >
                          <Image
                            style={styles.icon}
                            source={{uri: this.props.selectedMarker.imagePin}}
                          />
                          <Text
                            style={styles.text}
                          >{this.props.selectedMarker.city}</Text>

                          <Image
                            style={styles.iconRight}
                            source={{uri: this.props.selectedMarker.userData.picture.data.url}}
                          />
                          <TouchableOpacity onPress={this.onPressImage.bind(this)}>
                            <Text style={styles.deleteText}
                            >^</Text>
                            </TouchableOpacity>


                        </View>
                          <Text>Address: {this.props.selectedMarker.address}</Text>
                          <Text>Country: {this.props.selectedMarker.country}</Text>
                          <Text>Coordinates: {this.props.selectedMarker.coordinate.latitude}</Text>
                          <Text>Coordinates: {this.props.selectedMarker.coordinate.longitude}</Text>
                          <Text>Date: {this.props.selectedMarker.datePin}</Text>
                          <Text>Key: {this.props.selectedMarker.key}</Text>

                          <TextInput
                            onChangeText={this._onChangeText.bind(this)}
                            value={this.props.selectedMarker.description}
                          />
                          <Text style={styles.deleteText}
                            onPress={this.onPressDelete.bind(this)}
                          >X  Delete</Text>
                    </Animated.View>
                </View>
            );

      }
};


let Window = Dimensions.get('window');
const styles = StyleSheet.create({
    headerDetails: {
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
         top         : Window.height,
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
