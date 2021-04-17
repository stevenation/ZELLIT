/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import FastImage from 'react-native-fast-image';
import {styles} from './styles';
import {AirbnbRating} from 'react-native-ratings';
import {COLORS} from '../../../constants';
import {Shadow} from 'react-native-neomorph-shadows';
import {Dimensions} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ImageModal from 'react-native-image-modal';
import {FlatList} from 'react-native';

const WIDTH = Dimensions.get('screen').width;

export default class ShowProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.route.params.userData,
      img_url: '',
      itemsData: [],
      itemData: [],
      rating_count: 0,
      rating_total: 0,
      showListing: true,
    };
  }
  noItems() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: Dimensions.get('screen').width,
          height: 400,
        }}>
        <Fontisto name={'dropbox'} size={200} color={COLORS.blue} />
        <Text style={{fontSize: 24, paddingTop: 20}}>
          This User Has Not Listed Items Yet
        </Text>
      </View>
    );
  }

  Listing(data) {
    return (
      <Shadow style={styles.cell1}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: WIDTH - 10,
            paddingHorizontal: 5,
            alignItems: 'center',
            // marginVertical: 5,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View>
              <FastImage
                source={{uri: data.img_url, priority: FastImage.priority.high}}
                style={{
                  height: 80,
                  width: 80,
                  position: 'relative', // because it's parent
                  top: 0,
                  left: 0,
                }}
              />
              {data.sold && (
                <View
                  style={{
                    width: 50,
                    padding: 5,
                    height: 30,
                    position: 'absolute',
                    left: 0, // position where you want
                    bottom: 0,
                    justifyContent: 'center',
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    backgroundColor: COLORS.green,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: 12,
                    }}>
                    SOLD
                  </Text>
                </View>
              )}
            </View>
            <View style={{paddingHorizontal: 10}}>
              <Text style={{paddingTop: 10, fontWeight: '500'}}>
                {data.name}
              </Text>
              <Text style={{paddingTop: 10, color: COLORS.gray}}>
                Posted {showDate(data.timestamp)}
              </Text>
            </View>
          </View>
        </View>
      </Shadow>
    );
  }

  async UNSAFE_componentWillMount() {
    // console.log(this.props.route.params);
    var snapshot = await database()
      .ref(`Users/${this.state.userData.uid}`)
      .once('value');
    let data = snapshot.val();
    // console.log(snapshot.val());
    this.Unsubscribe(this.state.userData.college);

    var url = await storage()
      .ref(`images/profile_pictures/${snapshot.val().profile_picture}`)
      .getDownloadURL();
    FastImage.preload([{uri: url}]);
    this.setState({
      rating_total: data.rating_total,
      rating_count: data.rating_count,
      img_url: url,
      name: data.name,
    });

    this.props.navigation.addListener('blur', () => {
      database().ref(`${this.state.userData.college}/items`).off();
      database().ref(`Users/${this.state.userId}`).off();
    });
  }

  componentWillUnmount() {
    database().ref(`${this.state.userData.college}/items`).off();
    database().ref(`Users/${this.state.userId}`).off();
  }

  Unsubscribe = (college) => {
    database()
      .ref(`${college}/Items`)
      .orderByValue()
      .on('value', async (snapshot) => {
        var ls = [];
        snapshot.forEach(async (child) => {
          if (child.val().uid === this.state.userData.uid) {
            var status = await database()
              .ref(`transactions/${child.key}`)
              .once('value');
            FastImage.preload([{uri: child.val().img_url}]);
            this.setState({upLoadUri: child.val().img_url});
            status.val()
              ? ls.push({
                  ...child.val(),
                  key: child.val().key,
                  sold: status.val(),
                  id: child.key,
                })
              : ls.push({
                  ...child.val(),
                  key: child.val().key,
                  sold: false,
                  id: child.key,
                });
          }
        });
        this.setState({itemsData: ls});
      });
  };

  Capitalize(str) {
    if (str) {
      return str.replace(/\w\S*/g, (w) =>
        w.replace(/^\w/, (c) => c.toUpperCase()),
      );
    }
  }

  render() {
    return (
      //   <SafeAreaView>
      <View>
        <View
          style={{
            position: 'relative',
            //   height: 200,
            backgroundColor: COLORS.blue,
            borderBottomLeftRadius: 50,
            borderTopRightRadius: 50,
            justifyContent: 'center',
            marginBottom: 10,
            //   top: 0,
            //   left: 0,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 24,
                marginLeft: 10,
                color: COLORS.white,
              }}>
              {this.state.name}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity>
              <ImageModal
                resizeMode="cover"
                modalImageResizeMode="center"
                modalImageStyle={{height: 400, width: 400}}
                style={styles.imageRectangular}
                source={{
                  uri: this.state.img_url,
                  //   userData.profile_picture_url,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                marginTop: 10,
                alignContent: 'flex-start',
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}>
              <Text style={styles.collegeText}>
                {this.Capitalize(this.state.userData.college)}
              </Text>
              <AirbnbRating
                starContainerStyle={{
                  paddingVertical: 5,
                  left: 0,
                  margin: 0,
                  alignSelf: 'flex-start',
                }}
                type="star"
                showRating={false}
                fraction={2}
                defaultRating={
                  this.state.rating_total / this.state.rating_count
                }
                isDisabled={true}
                size={15}
              />
              <Text style={{color: COLORS.white}}>
                {this.state.userData.trades} Trades
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}></View>
            </View>
          </View>
        </View>
        {this.state.itemsData.length !== 0 && (
          <FlatList
            keyExtractor={(item, index) => item.id}
            data={this.state.itemsData}
            renderItem={({item}) => this.Listing(item)}
          />
        )}
        {this.state.itemsData.length === 0 && this.noItems()}
      </View>

      // <View styles={{height: 100}}></View>
      //   </SafeAreaView>
    );
  }
}
export const showDate = (timestamp) => {
  var diff = (new Date().getTime() - timestamp) / 1000;
  var date = new Date(timestamp);

  switch (true) {
    case diff > 86400:
      return `on ${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;

    case diff < 60:
      return `${Math.floor(diff)} seconds ago`;

    case diff >= 60 && diff < 3600:
      return `${Math.floor(diff / 60)} minutes ago`;
    case diff >= 3600 && diff < 86400:
      return `${Math.ceil(diff / 3600)} hours ago`;
  }
};
