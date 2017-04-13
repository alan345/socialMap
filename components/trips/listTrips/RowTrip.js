import React, {Component} from 'react';
import ReactNative from 'react-native';
import  {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Button
} from 'react-native';
import ShowDetailsTripModal from '../ShowDetailsTripModal';



export default class RowTrip extends Component {


  actionToDetermine(){

  }
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.onSelectTrip(this.props.item)
        }}
      >
        <View style={{flex: 1, flexDirection: 'column', borderRadius: 5, marginRight:10, padding: 10, backgroundColor: '#ffffff'}} >

            <View style={styles.row}>
              <View>
                    <Image source={require('../../../assets/trip_pic_example.png')} />
              </View>
              <View>
                <TouchableWithoutFeedback onPress={this.actionToDetermine.bind(this)}>
                  <View
                    title="❐"
                    color="#841584"
                    style={styles.roundButton}>
                       <Text style={{color:"#ffffff", textAlign: 'center', fontSize: 18}}>❐</Text>
                       <ShowDetailsTripModal
                        trip={this.props.item}
                        ref={(child) => { this._childShowDetailsTripModal = child; }}
                       />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View>
              <Text>{this.props.item.title}</Text>
              <Text>{this.props.item.googleData.address}</Text>
              <Text>4 cities</Text>
              <Text>{this.props.item.nbLocationsPerTrip} stops</Text>
              <Image source={{ uri: 'https://daveexaminesmovies.files.wordpress.com/2012/10/5-star_rating_system_pcar_011-e1349505423547.png'}} style={styles.imageStar} />
            </View>

            <View style={{flex: 1, flexDirection: 'row'}}>
            
                <Text>{this.props.item.userData.name}</Text>
            </View>

        </View>
      </TouchableWithoutFeedback>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
  },
  imageStar:{
    height: 18,
    width: 75,

  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 20,
    width: 20,
    borderRadius: 20,
  },
  roundButton: {
    borderRadius: 40,
    backgroundColor: '#841584',
    height: 30,
    width: 30,
    paddingTop:0
  }
});
