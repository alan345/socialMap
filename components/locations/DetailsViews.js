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
  TouchableOpacity,
  Button,
} from 'react-native';
import FirebaseFunctions from "../../includes/FirebaseFunctions";
const { width, height } = Dimensions.get('window');


class DetailsViews extends Component {
  constructor(props){
    super();
    this.state = {
      isEditMode:false,
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
          yPosition = -300

        if(position == 3)
          yPosition = -600

        Animated.spring(
            this.state.pan,
            {toValue:{x:0,y:yPosition}}
        ).start();
      }

      onPressDelete(){
        this.onSetPositionDetails(0)
        let marker = this.props.selectedMarker;
        this._child.deleteLocationToFirebase(marker, this.props.trip.key)
      }

      isDropZone(gesture){
          return gesture.moveY > 0 && gesture.moveY <  420;
      }

      _onChangeText(description) {
        let marker = this.props.selectedMarker;
        marker.description = description
        this._child.updateLocationToFirebase(marker, this.props.trip.key)
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
        if(this.props.trip.key=='')
          return null

          return (

            <View style={styles.draggableContainer}>
                <FirebaseFunctions ref={(child) => { this._child = child; }} />
                <Animated.View
                    {...this.panResponder.panHandlers}
                    style={[this.state.pan.getLayout(), styles.detailsList]}>

                    <View style={styles.headerDetails}>
                      <Image
                        style={styles.icon}
                        source={{uri: this.props.selectedMarker.imagePin}}
                      />
                      <Text
                        style={styles.text}
                      >{this.props.selectedMarker.address_components.neighborhood}</Text>

                      <Image
                        style={styles.iconRight}
                        source={{uri: this.props.trip.userData.picture.data.url}}
                      />


                    </View>
                      {this.state.isEditMode ?
                        <TextInput
                          placeholder = "Description"
                          style={styles.inputField}
                          onChangeText={this._onChangeText.bind(this)}
                          value={this.props.selectedMarker.description}
                        />
                        :
                        <Text>{this.props.selectedMarker.address}</Text>
                      }

                      <Text>Country: {this.props.selectedMarker.address_components.country}</Text>
                      <Text>Locality: {this.props.selectedMarker.address_components.locality}</Text>
                      <Text>State: {this.props.selectedMarker.address_components.administrative_area_level_1}</Text>
                      <Text>Neighborhood: {this.props.selectedMarker.address_components.neighborhood}</Text>

                      <Text>Date: {this.props.selectedMarker.datePin}</Text>
                      <Text>{this.props.selectedMarker.description}</Text>

                      <View style={styles.row}>
                        <Text>Description</Text>
                        <TextInput
                          placeholder = "Description"
                          style={styles.inputField}
                          onChangeText={this._onChangeText.bind(this)}
                          value={this.props.selectedMarker.description}
                        />
                      </View>
                      <View style={styles.row}>
                        <Button
                          onPress={this.onPressDelete.bind(this)}
                          title="✘"
                          color="#841584"
                          accessibilityLabel="✘"
                        />
                        <Text>  </Text>

                        <Button
                          onPress={this.toggleEditMode.bind(this)}
                          title="✎"
                          color="#841584"
                          accessibilityLabel="✎"
                        />
                      </View>
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
    row: {
      flexDirection: 'row',
      padding: 5,
    },
    inputField:{
      height: 40,
      width: 200,
      padding: 5,
      borderColor: 'gray',
      borderWidth: 1,
      marginTop   : 5,
      marginLeft  : 5,
      marginRight : 5,
    },
    deleteIcon:{
      width: 50,
      height: 50,
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
  //       top         : Window.height,
        left        : 0,
     },
     detailsList      : {

      backgroundColor     : '#F7F7F7',
      width               : Window.width,
      height              : 600,
      borderRadius        : 5
     }
});



module.exports = DetailsViews;
