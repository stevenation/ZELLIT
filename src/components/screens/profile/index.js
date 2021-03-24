import React, {Component, useContext, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../../../navigation/AuthProvider';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import FastImage from 'react-native-fast-image';
import {styles} from './styles';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {COLORS} from '../../../constants';
import {FlatGrid} from 'react-native-super-grid';
import {Dimensions} from 'react-native';
import {BackgroundImage} from 'react-native-elements/dist/config';

const WIDTH = Dimensions.get('screen').width;

export default class Profile extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.uid,
      userData: '',
      img_url: '',
      itemsData: [],
      rating_count: 0,
      rating_total: 0,
    };
  }

  UNSAFE_componentWillMount() {
    database()
      .ref(`Users/${this.state.userId}`)
      .once('value')
      .then(async (snapshot) => {
        this.Unsubscribe(snapshot.val().college);
        let data = snapshot.val();
        this.setState({
          userData: snapshot.val(),
          rating_total: data.rating_total,
          rating_count: data.rating_count,
        });

        var url = await storage()
          .ref(`images/profile_pictures/${snapshot.val().profile_picture}`)
          .getDownloadURL();
        this.setState({img_url: url});
      });

    this.getUpdates();
  }
  componentWillUnmount() {
    database()
      .ref(`${this.state.userData.college}/items`)
      .off('value', this.Unsubscribe);
    database()
      .ref(`Users/${this.state.userId}`)
      .off('child_changed', this.getUpdates());
  }
  getUpdates() {
    database()
      .ref(`Users/${this.state.userId}`)
      .on('child_changed', (snapshot) => {
        if (snapshot.key === 'rating_total') {
          this.setState({rating_total: snapshot.val()});
        }
        if (snapshot.key === 'rating_count') {
          this.setState({rating_count: snapshot.val()});
        }
        if (snapshot.key === 'trades') {
          this.setState({trades: snapshot.val()});
        }
      });
  }
  Unsubscribe(college) {
    database()
      .ref(`${college}/Items`)
      .on('value', async (snapshot) => {
        var ls = [];
        snapshot.forEach((child) => {
          if (child.val().uid === firebase.auth().currentUser.uid) {
            FastImage.preload([{uri: child.val().img_url}]);
            ls.push({...child.val(), key: child.val().key});
          }
        });
        this.setState({itemsData: ls});
      });
  }
  render() {
    return (
      <SafeAreaView>
        <Text style={{fontWeight: '700', fontSize: 24, alignSelf: 'center'}}>
          {this.state.userData.name}
        </Text>
        <View>
          <View
            style={{
              position: 'relative',
              height: 200,
              backgroundColor: COLORS.blue,
              borderBottomLeftRadius: 50,
              borderTopRightRadius: 50,
              justifyContent: 'center',
              top: 0,
              left: 0,
            }}>
            <View style={{flexDirection: 'row'}}>
              <FastImage
                style={styles.imageRectangular}
                source={{
                  uri: this.state.img_url,
                }}
              />
              <View style={{marginTop: 10}}>
                <Text style={{fontWeight: '500', fontSize: 14}}>
                  {this.state.userData.college}
                </Text>
                <AirbnbRating
                  type="star"
                  showRating={false}
                  fraction={5}
                  defaultRating={
                    this.state.rating_total / this.state.rating_count
                  }
                  isDisabled={true}
                  size={20}
                />
                <Text>{this.state.userData.trades} trades</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: 100,
              width: WIDTH,
              borderBottomLeftRadius: 50,
              borderBottomWidth: 10,
              borderLeftWidth: 1,
              borderColor: COLORS.blue,
              position: 'absolute',
              bottom: -40,
              left: 0,
              // backgroundColor: 'black',
            }}>
            <View
              style={{
                bottom: -65,
                left: 0,

                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Buying');
                }}>
                <Text>Buying</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Selling');
                }}>
                <Text>Selling</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('CachedImageExample');
                }}>
                <Text>Cache</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <TouchableOpacity
          styles={{width: 40}}
          onPress={() => {
            this.context.logout();
          }}>
          <Text>Log Out</Text>
        </TouchableOpacity> */}

        <FlatGrid
          style={{height: 430, marginTop: 25}}
          itemDimension={Dimensions.get('screen').width / 2.5}
          data={this.state.itemsData}
          renderItem={({item}) => ItemCell(item)}
        />
        <View styles={{height: 100}}></View>
      </SafeAreaView>
    );
  }
}
function ItemCell(data) {
  let source = {uri: data.img_url, priority: FastImage.priority.high};
  return (
    <TouchableOpacity style={{height: 130}}>
      <BackgroundImage
        source={{uri: data.img_url}}
        style={{
          height: 130,
          width: WIDTH / 2.2,
          position: 'relative', // because it's parent
          top: 0,
          left: 0,
        }}
      />
      {data.sold && (
        <View
          style={{
            width: 60,
            padding: 10,
            height: 40,
            position: 'absolute',
            top: 0, // position where you want
            right: 0,
            justifyContent: 'center',
            borderTopLefttRadius: 20,
            borderBottomLeftRadius: 20,
            backgroundColor: COLORS.green,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
            }}>
            SOLD
          </Text>
        </View>
      )}
      <View
        style={{
          maxWidth: 90,
          padding: 10,
          height: 40,
          position: 'absolute',
          bottom: 0, // position where you want
          left: 0,
          justifyContent: 'center',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          backgroundColor: COLORS.blue,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'white',
          }}>
          ${data.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
