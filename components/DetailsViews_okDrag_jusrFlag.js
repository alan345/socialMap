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
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY()
    };
  }






      componentWillMount() {
        this._panResponder = PanResponder.create({
          onMoveShouldSetResponderCapture: () => true,
          onMoveShouldSetPanResponderCapture: () => true,

          // Initially, set the value of x and y to 0 (the center of the screen)
          onPanResponderGrant: (e, gestureState) => {
            this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
this.state.pan.setValue({x: 0, y: 0});
          },

          // When we drag/pan the object, set the delate to the states pan position
          onPanResponderMove: Animated.event([
            null, {dx: this.state.pan.x, dy: this.state.pan.y},
          ]),

          onPanResponderRelease: (e, {vx, vy}) => {
            this.state.pan.flattenOffset();
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
        // Destructure the value of pan from the state
let { pan } = this.state;

// Calculate the x and y transform from the pan value
let [translateX, translateY] = [pan.x, pan.y];

// Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
let imageStyle = {transform: [{translateX}, {translateY}]};

              return (
                <View style={styles.container}>

                <Animated.View style={imageStyle} {...this._panResponder.panHandlers}>
                  <Image source={require('../assets/flag-blue.png')} />
                </Animated.View>

                </View>
            );

      }
};


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});


module.exports = DetailsViews;
