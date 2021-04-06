/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../../../navigation/AuthProvider';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import FastImage from 'react-native-fast-image';
import {styles} from './styles';
import {AirbnbRating} from 'react-native-ratings';
import {COLORS} from '../../../constants';
import {FlatGrid} from 'react-native-super-grid';
import {Dimensions} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageModal from 'react-native-image-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {FlatList} from 'react-native';

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
      name: '',
      wishList: [],
      showWishList: false,
      showListing: true,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.navigation.addListener('focus', async () => {
      var snapshot = await database()
        .ref(`Users/${this.state.userId}`)
        .once('value');
      let data = snapshot.val();
      this.Unsubscribe(data.college);

      this.getWishList(data.college);

      this.getUpdates();

      var url = await storage()
        .ref(`images/profile_pictures/${snapshot.val().profile_picture}`)
        .getDownloadURL();

      this.setState({
        userData: snapshot.val(),
        rating_total: data.rating_total,
        rating_count: data.rating_count,
        img_url: url,
        name: data.name,
      });
      // }, 5000);
    });

    this.props.navigation.addListener('blur', () => {
      database().ref(`${this.state.userData.college}/items`).off();
      database().ref(`Users/${this.state.userId}`).off();
      database().ref('wishlist').off('value', this.getWishList);
    });
  }
  componentWillUnmount() {
    database().ref(`${this.state.userData.college}/items`).off();
    database().ref(`Users/${this.state.userId}`).off();
    database().ref('wishlist').off();
  }
  getUpdates = () => {
    database()
      .ref(`Users/${this.state.userId}`)
      .on('child_changed', async (snapshot) => {
        if (snapshot.key === 'rating_total') {
          this.setState({rating_total: snapshot.val()});
        }
        if (snapshot.key === 'rating_count') {
          this.setState({rating_count: snapshot.val()});
        }
        if (snapshot.key === 'trades') {
          this.setState({trades: snapshot.val()});
        }
        if (snapshot.key === 'name') {
          this.setState({name: snapshot.val()});
        }
        if (snapshot.key === 'profile_picture') {
          var url = await storage()
            .ref(`images/profile_pictures/${snapshot.val()}`)
            .getDownloadURL();
          FastImage.preload([{uri: url}]);
          this.setState({img_url: url});
        }
      });
  };
  Unsubscribe = (college) => {
    database()
      .ref(`${college}/Items`)
      .on('value', async (snapshot) => {
        var ls = [];
        snapshot.forEach(async (child) => {
          if (child.val().uid === firebase.auth().currentUser.uid) {
            var status = await database()
              .ref(`transactions/${child.key}`)
              .once('value');
            FastImage.preload([{uri: child.val().img_url}]);
            status.val()
              ? ls.push({
                  ...child.val(),
                  key: child.val().key,
                  sold: status.val(),
                  id: child.val().key,
                })
              : ls.push({
                  ...child.val(),
                  key: child.val().key,
                  sold: false,
                  id: child.val().key,
                });
          }
        });
        this.setState({itemsData: ls});
      });
  };

  getWishList = (college) => {
    database()
      .ref('wishlist')
      .on('value', (snp) => {
        var ls = [];
        snp.forEach((child) => {
          child.forEach((child1) => {
            if (child1.key === this.state.userId && child1.val().like) {
              database()
                .ref(`${college}/Items/${child.key}`)
                .once('value')
                .then((snap) => {
                  console.log('snaaappp', snap.val());
                  ls.push(snap.val());
                });
            }
          });
        });
        this.setState({wishList: ls});
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
      <SafeAreaView>
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
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 24,
                  marginLeft: 10,
                  color: COLORS.white,
                }}>
                {this.state.name}
              </Text>

              <TouchableOpacity
                styles={{
                  width: 40,
                  height: 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.context.logout();
                  }}
                  style={{
                    alignSelf: 'flex-end',
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    borderColor: COLORS.white,
                    borderWidth: 2,
                    backgroundColor: COLORS.white,
                    marginRight: 25,
                    margingTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <AntDesign name={'logout'} size={20} color={COLORS.black} />
                </TouchableOpacity>
              </TouchableOpacity>
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
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  marginTop: 10,
                  alignContent: 'flex-start',
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.collegeText}>
                  {this.Capitalize(this.state.userData.college)}
                </Text>
                <AirbnbRating
                  starContainerStyle={{
                    padding: 0,
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
                    // alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={styles.transactionButtons}
                    onPress={() => {
                      this.props.navigation.navigate('Buying');
                    }}>
                    <Text style={{fontWeight: '500'}}>Buying</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.transactionButtons}
                    onPress={() => {
                      this.props.navigation.navigate('Selling');
                    }}>
                    <Text style={{fontWeight: '500'}}>Selling</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      // ...styles.transactionButtons,
                      marginLeft: 40,
                      width: 30,
                      height: 30,
                      backgroundColor: COLORS.white,
                      borderWidth: 2,
                      borderColor: COLORS.white,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                    onPress={() => {
                      this.props.navigation.navigate('EditProfile', {
                        data: {
                          ...this.state.userData,
                          name: this.state.name,
                          url: this.state.img_url,
                        },
                      });
                    }}>
                    <MaterialCommunityIcons
                      name={'circle-edit-outline'}
                      size={20}
                    />
                    {/* <Text style={{fontWeight: '500'}}>Selling</Text> */}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          {/* <View
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
            }}></View> */}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            style={{
              ...styles.stateContainer,
              backgroundColor: this.state.showListing
                ? COLORS.blue
                : COLORS.white,
            }}
            onPress={() =>
              this.setState({showWishList: false, showListing: true})
            }>
            <Text
              style={{
                ...styles.stateText,
                color: this.state.showListing ? COLORS.white : COLORS.black,
              }}>
              Listing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.stateContainer,
              backgroundColor: this.state.showWishList
                ? COLORS.blue
                : COLORS.white,
            }}
            onPress={() =>
              this.setState({showListing: false, showWishList: true})
            }>
            <Text
              style={{
                ...styles.stateText,
                color: this.state.showWishList ? COLORS.white : COLORS.black,
              }}>
              WishList
            </Text>
          </TouchableOpacity>
        </View>

        {this.state.itemsData.length !== 0 &&
          this.state.showListing &&
          !this.state.showWishList && (
            <FlatList
              keyExtractor={(item, index) => item.id}
              data={this.state.itemsData}
              renderItem={({item}) => Listing(item)}
            />
          )}
        {this.state.itemsData.length === 0 &&
          this.state.showListing &&
          !this.state.showWishList &&
          noItems()}

        {this.state.wishList.length === 0 &&
          !this.state.showListing &&
          this.state.showWishList &&
          noWishList()}

        {this.state.wishList.length !== 0 &&
          !this.state.showListing &&
          this.state.showWishList && (
            <FlatGrid
              style={{
                height: 500,
                marginTop: 10,
              }}
              itemDimension={Dimensions.get('screen').width / 2.5}
              data={this.state.wishList}
              renderItem={({item}) => ItemCell(item)}
            />
          )}
        <View styles={{height: 100}}></View>
      </SafeAreaView>
    );
  }
}

function noWishList() {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('screen').width,
        height: 400,
      }}>
      <FontAwesome5
        name={'hand-holding-heart'}
        size={200}
        color={COLORS.blue}
      />
      <Text style={{fontSize: 24, paddingTop: 20}}>No Items Saved</Text>
    </View>
  );
}

function noItems() {
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
        You Have Not Listed Items Yet
      </Text>
    </View>
  );
}

function Listing(data) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: WIDTH - 20,
        paddingHorizontal: 10,
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
          <Text>{data.name}</Text>
          <Text>Posted Today</Text>
        </View>
      </View>
      {!data.sold && (
        <TouchableOpacity
          style={{
            borderRadius: 25,
            backgroundColor: COLORS.blue,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
            height: 40,
            width: 50,
          }}>
          <Text style={{color: COLORS.white}}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
function ItemCell(data) {
  console.log(data.img_url, data);
  return (
    <TouchableOpacity style={{height: WIDTH / 2.2}}>
      <FastImage
        source={{uri: data.img_url, priority: FastImage.priority.high}}
        style={{
          height: WIDTH / 2.2,
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
