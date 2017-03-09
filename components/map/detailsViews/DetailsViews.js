import React, { Component } from 'react';
import  {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  LayoutAnimation,
  PanResponder,
  Animated,
  TouchableOpacity,
  Button,
} from 'react-native';
import DetailsLocation from '../../locations/detailsLocation/DetailsLocation';
import DetailsTrip from '../../trips/detailsTrip/DetailsTrip';



const { width, height } = Dimensions.get('window');

export default class DetailsViews extends Component {
  constructor(props){
    super();
    this.state = {
      isEditMode:false,
      isEditAddress:false,
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
            if(gesture.moveY > 100) {
             if(this.isDropZone(gesture)){
               this.onSetPositionDetails(2)
             }else{
                this.onSetPositionDetails(1)
             }
           } else {
             if(e.nativeEvent.pageY > 500) {
              this.onSetPositionDetails(2)
              } else {
                this.onSetPositionDetails(1)
              }
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



      onSetPositionDetails(position) {
        this.setState({position:position})
        let yPosition = 0
        if(position == 0)
          yPosition = 0

        if(position == 1)
          yPosition = -70

        if(position == 2)
          yPosition = -400

        if(position == 3)
          yPosition = -600

        Animated.spring(
            this.state.pan,
            {toValue:{x:0,y:yPosition}}
        ).start();
      }



      isDropZone(gesture){
          return gesture.moveY > 0 && gesture.moveY <  400;
      }



      inputFocused (refName) {
        setTimeout(() => {
          let scrollResponder = this.refs.scrollView.getScrollResponder();
          scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            React.findNodeHandle(this.refs[refName]),
            110, //additionalOffset
            true
          );
        }, 50);
      }

      toggleEditMode(){
        if(this.state.isEditMode) {
          this.setState({isEditMode:false})
        } else {
          this.setState({isEditMode:true})
        }
      }


      render(){
        if(!this.props.trip.key)
          return null

          return (
            <View style={styles.draggableContainer}>

                <Animated.View
                  {...this.panResponder.panHandlers}
                  style={[this.state.pan.getLayout(), styles.detailsList]}
                >
                  <DetailsTrip
                    selectedMarker={this.props.selectedMarker}
                    trip={this.props.trip}
                  />

                  <DetailsLocation
                    trip={this.props.trip}
                    selectedMarker={this.props.selectedMarker}
                  />
                </Animated.View>
            </View>
        );
      }
};

let Window = Dimensions.get('window');
const styles = StyleSheet.create({

     draggableContainer: {
         position    : 'absolute',
  //       top         : Window.height,
        left        : 0,
     },
     detailsList      : {
      backgroundColor     : '#F7F7F7',
      width               : Window.width,
      height              : 400,
      borderRadius        : 5
     }
});
