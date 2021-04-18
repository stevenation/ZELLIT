/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Button,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {LogBox} from 'react-native';

import {Switch} from 'react-native-gesture-handler';
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
import {Shadow} from 'react-native-neomorph-shadows';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimensions} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageModal from 'react-native-image-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FlatList} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Platform} from 'react-native';
import {Input} from 'react-native-elements';
import {Button as Button1} from 'react-native-elements';
import {Image} from 'react-native';

const WIDTH = Dimensions.get('screen').width;
LogBox.ignoreAllLogs();

export default class Profile extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.uid,
      userData: '',
      img_url: '',
      itemsData: [],
      itemData: [],
      rating_count: 0,
      rating_total: 0,
      name: '',
      wishList: [],
      showWishList: false,
      showListing: true,
      showEditModal: false,
      showUpdateConfirm: false,
      thirdPartyEnabled: false,
      inPersonEnabled: false,
      upLoadUri: '',
      categories: [
        {
          label: 'Textbooks',
          value: 'textbooks',
        },
        {
          label: 'School',
          value: 'school',
        },
        {
          label: 'Electronics',
          value: 'electronics',
        },
        {
          label: 'Women',
          value: 'women',
        },
        {
          label: 'Men',
          value: 'men',
        },
        {
          label: 'Transportation',
          value: 'transportation',
        },
        {
          label: 'Other',
          value: 'other',
        },
        {
          label: 'Stationery',
          value: 'stationery',
        },
      ],

      conditions: [
        {
          id: '1',
          title: 'New',
          description: 'With tags, unopened',
        },
        {
          id: '2',
          title: 'Like New',
          description: 'New without tags, unused',
        },
        {
          id: '3',
          title: 'Good',
          description: 'Used, minor flaws',
        },
        {
          id: '4',
          title: 'Fair',
          description: 'Gently used',
        },
        {
          id: '5',
          title: 'Poor',
          description: 'Major flaws',
        },
      ],
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
          You Have Not Listed Items Yet
        </Text>
      </View>
    );
  }

  Listing(data) {
    return (
      <Shadow style={styles.cell}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: WIDTH - 10,
            paddingHorizontal: 5,
            alignItems: 'center',
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
          {!data.sold && (
            <TouchableOpacity
              onPress={() => {
                this.setState({itemData: data});
                this.setState({thirdPartyEnabled: data.payment_method2});
                this.setState({inPersonEnabled: data.payment_method1});
                this.setState({showEditModal: true});
              }}
              style={{
                borderRadius: 25,
                backgroundColor: COLORS.blue,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                height: 40,
                width: 50,
              }}>
              <Text style={{color: COLORS.white, fontWeight: '500'}}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </Shadow>
    );
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

  updateItem = () => {
    database()
      .ref(`${this.state.userData.college}/Items/${this.state.itemData.id}`)
      .update({
        name: this.state.itemData.name,
        brand: this.state.itemData.brand,
        category: this.state.itemData.category,
        condition: this.state.itemData.condition,
        timestamp: this.state.itemData.timestamp,
        uid: this.state.itemData.uid,
        price: this.state.itemData.price,
        description: this.state.itemData.description,
        payment_method1: this.state.itemData.payment_method1,
        payment_method2: this.state.itemData.payment_method2,
        img_url: this.state.itemData.img_url,
      });
  };
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
      .orderByValue()
      .on('value', async (snapshot) => {
        var ls = [];
        snapshot.forEach(async (child) => {
          if (child.val().uid === firebase.auth().currentUser.uid) {
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
  renderImage() {
    if (this.state.upLoadUri !== '') {
      return this.state.upLoadUri === '' ? null : (
        <Image
          source={{uri: this.state.upLoadUri}}
          resizeMode={'stretch'}
          style={{width: 65, height: 65, margin: 5}}
        />
      );
    }
  }

  editItemModal() {
    console.log(String(this.state.itemData.category).toLowerCase());
    return (
      <SafeAreaView>
        <Modal
          // style={{backgroundColor: '#ddd', width: WIDTH}}
          animationType="slide"
          transparent={false}
          visible={this.state.showEditModal}>
          <View
            style={{
              flex: 1,
              width: WIDTH,
              alignSelf: 'center',
              paddingLeft: 10,
              paddingTop: 30,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                left: 0,
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    showEditModal: false,
                  })
                }>
                <Ionicons
                  name={'ios-chevron-back'}
                  size={30}
                  color={COLORS.blue}
                />
              </TouchableOpacity>

              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 18,
                  fontWeight: '500',
                  marginRight: 10,
                }}>
                Edit Item
              </Text>
              {/* <TouchableOpacity
                onPress={() => {
                  // this.updateName();
                  this.setState({
                    // nameModalVisible: !this.state.nameModalVisible,
                  });
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 16,
                    fontWeight: '500',
                    marginRight: 10,
                    color: COLORS.blue,
                  }}>
                  Done
                </Text>
              </TouchableOpacity> */}
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <ScrollView>
                <View style={{flexDirection: 'row'}}>
                  <View>{this.renderImage()}</View>
                  <TouchableOpacity
                    style={styles.imageBorder}
                    onPress={() => {
                      ImageCropPicker.openCamera({
                        width: 300,
                        height: 300,
                        cropping: true,
                      })
                        .then((image) => {
                          let uri = image.path;
                          console.log(uri);
                          this.setState({
                            img: {
                              id: '1',
                              uri: uri,
                            },
                          });
                          // this.state.img.push({id: "1", uri: uri})
                          this.setState({upLoadUri: uri});
                        })
                        .catch((e) => console.log(e));
                    }}>
                    <MaterialIcons
                      name={'add-photo-alternate'}
                      size={30}
                      color={COLORS.gray}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{borderBottomWidth: 1}}></View>

                <Text style={styles.title}>Title</Text>
                <Input
                  placeholder={this.state.itemData.name}
                  inputStyle={{color: COLORS.black, fontSize: 14}}
                  placeholderTextColor="rgba(0,0,0,0.7)"
                  autoCorrect={false}
                  onChangeText={async (title) => {
                    this.setState((prevState) => ({
                      itemData: {
                        ...prevState.itemData,
                        name: title,
                      },
                    }));
                  }}
                  autoCapitalize={'words'}
                  autoCompleteType={'name'}
                />
                <Text style={styles.title}>Description</Text>
                <Input
                  placeholder={this.state.itemData.description}
                  inputStyle={{color: COLORS.black, fontSize: 14}}
                  placeholderTextColor="rgba(0,0,0,0.7)"
                  autoCorrect={false}
                  multiline={true}
                  style={{height: 100}}
                  onChangeText={async (desr) => {
                    this.setState((prevState) => ({
                      itemData: {
                        ...prevState.itemData,
                        description: desr,
                      },
                    }));
                  }}
                  autoCapitalize={'words'}
                  autoCompleteType={'name'}
                />
                <Text style={styles.title}>Brand</Text>
                <Input
                  placeholder={this.state.itemData.brand}
                  inputStyle={{color: COLORS.black, fontSize: 14}}
                  placeholderTextColor="rgba(0,0,0,0.7)"
                  autoCorrect={false}
                  onChangeText={async (brand) => {
                    this.setState((prevState) => ({
                      itemData: {
                        ...prevState.itemData,
                        brand: brand,
                      },
                    }));
                  }}
                  autoCapitalize={'words'}
                  autoCompleteType={'name'}
                />
                <Text style={styles.title}>Category</Text>

                <DropDownPicker
                  items={this.state.categories}
                  defaultValue={String(
                    this.state.itemData.category,
                  ).toLowerCase()}
                  searchable={true}
                  placeholder={'Category'}
                  labelStyle={{color: COLORS.black}}
                  containerStyle={styles.inputContainer}
                  style={{backgroundColor: 'rgba(255,255,255,0.2)'}}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  dropDownStyle={{backgroundColor: '#fafafa'}}
                  onChangeItem={async (itm) => {
                    this.setState((prevState) => ({
                      itemData: {
                        ...prevState.itemData,
                        category: itm.label,
                      },
                    }));
                  }}
                />
                <Text style={styles.title}>Condition</Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={this.state.conditions}
                  extraData={this.state.selectedId}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={async () => {
                        const id = this.state.selectedId;
                        id === item.id
                          ? this.setState({selectedId: null})
                          : this.setState({selectedId: item.id});
                        this.setState((prevState) => ({
                          itemData: {
                            ...prevState.itemData,
                            condition: item.title,
                          },
                        }));
                      }}
                      style={
                        item.id === this.state.selectedId
                          ? styles.selectedConditionItem
                          : styles.conditionItem
                      }>
                      <Text style={styles.conditionTitle}>{item.title}</Text>
                      <Text
                        numberOfLines={3}
                        style={styles.conditionDescription}>
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                  )}
                />

                <Text style={styles.title}>Payment Options</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome
                      style={{paddingHorizontal: 5, color: COLORS.blue}}
                      name={'money'}
                      size={30}
                    />
                    <Text>In-Person</Text>
                  </View>

                  <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                    <Switch
                      style={{alignSelf: 'flex-end'}}
                      onValueChange={async (value) => {
                        this.setState({inPersonEnabled: value});
                        this.setState((prevState) => ({
                          itemData: {
                            ...prevState.itemData,
                            payment_method1: value,
                          },
                        }));
                      }}
                      value={this.state.inPersonEnabled}
                    />
                  </View>
                </View>
                <View style={{borderBottomWidth: 2, padding: 5}}></View>

                <View
                  style={{
                    paddingVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialIcons
                      style={{paddingHorizontal: 5, color: COLORS.blue}}
                      name={'payments'}
                      size={30}
                    />
                    <Text>Third-Party App</Text>
                  </View>

                  <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                    <Switch
                      style={{alignSelf: 'flex-end'}}
                      onValueChange={async (value) => {
                        this.setState({thirdPartyEnabled: value});
                        this.setState((prevState) => ({
                          itemData: {
                            ...prevState.itemData,
                            payment_method2: value,
                          },
                        }));
                      }}
                      value={this.state.thirdPartyEnabled}
                    />
                  </View>
                </View>
                <Text style={styles.title}>Price</Text>
                <Input
                  placeholder={this.state.itemData.price}
                  inputStyle={{color: COLORS.black, fontSize: 30}}
                  placeholderTextColor="rgba(0,0,0,0.7)"
                  autoCorrect={false}
                  onChangeText={async (price) => {
                    this.setState((prevState) => ({
                      itemData: {
                        ...prevState.itemData,
                        price: price,
                      },
                    }));
                  }}
                  keyboardType={'numeric'}
                  leftIcon={
                    <FontAwesome
                      name={'dollar'}
                      size={30}
                      style={{right: 5, color: COLORS.blue}}
                    />
                  }
                />

                <Button1
                  title={'Modify Item'}
                  titleStyle={{fontWeight: '600'}}
                  style={{
                    width: 150,
                    height: 40,
                    alignSelf: 'center',
                    borderRadius: 40,
                    marginBottom: 5,
                  }}
                  onPress={() => {
                    this.updateItem();
                    this.setState({showEditModal: false});
                    this.setState({showUpdateConfirm: true});
                    setTimeout(
                      () => this.setState({showUpdateConfirm: false}),
                      3000,
                    );
                  }}
                />
                <Button1
                  title={'Unlist Item'}
                  titleStyle={{fontWeight: '600', color: COLORS.white}}
                  style={{
                    width: 150,
                    height: 40,
                    alignSelf: 'center',
                    borderRadius: 40,
                  }}
                  // onPress={() => {
                  //   this.updateItem();
                  // }}
                />
                <View style={{height: 50}}></View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  render() {
    return (
      <SafeAreaView>
        <Modal
          // style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
          animationType="slide"
          transparent={true}
          visible={this.state.showUpdateConfirm}
          onRequestClose={() => {
            // this.closeButtonFunction()
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',

              height: 150,
              width: WIDTH,
            }}>
            <View
              style={{
                height: 50,
                width: WIDTH,
                backgroundColor: COLORS.blue,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: COLORS.white, fontWeight: '500'}}>
                Item Has Been Successfully Been Modified
              </Text>
            </View>
          </View>
        </Modal>
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
              renderItem={({item}) => this.Listing(item)}
            />
          )}
        {this.state.itemsData.length === 0 &&
          this.state.showListing &&
          !this.state.showWishList &&
          this.noItems()}

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
        {this.editItemModal()}
      </SafeAreaView>
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

function ItemCell(data) {
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
