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

export default class Profile extends Component {
  _isMounted = false;
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.uid,
      userData: '',
      img_url: '',
    };
  }

  UNSAFE_componentWillMount() {
    this._isMounted = true;
    if (this._isMounted) {
      database()
        .ref(`Users/${this.state.userId}`)
        .once('value', async (snapshot) => {
          this.setState({userData: snapshot.val()});
          var url = await storage()
            .ref(`images/profile_pictures/${snapshot.val().profile_picture}`)
            .getDownloadURL();
          this.setState({img_url: url});
        });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  
  render() {
    return (
      <SafeAreaView>
        <Text style={{fontWeight: '700', fontSize: 24, alignSelf: 'center'}}>
          {this.state.userData.name}
        </Text>
        <View
          style={{
            height: 200,
            backgroundColor: COLORS.blue,
            borderBottomLeftRadius: 50,
            // borderBottomRightRadius: 50,
            borderTopRightRadius: 50,
            justifyContent: 'center',
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
                defaultRating={this.state.userData.rating}
                isDisabled={true}
                size={20}
              />
              <Text>{this.state.userData.trades} trades</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.context.logout();
          }}>
          <Text>Log Out</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
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
        <FlatGrid
          itemDimension={Dimensions.get('screen').width / 2.5}
          data={[1, 2, 3, 4, 5, 6]}
          renderItem={({item}) => (
            <View style={{backgroundColor: 'blue'}}>
              <Text>{item}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    );
  }
}

