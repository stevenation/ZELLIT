import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import {COLORS} from '../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {styles} from './styles';
import {AirbnbRating, Button} from 'react-native-elements';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useHeaderHeight} from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import {showDate} from '../profile';
const WIDTH = Dimensions.get('screen').width;

export default function ItemScreen(item) {
  const itemData = item.route.params.itemData;
  const userId = firebase.auth().currentUser.uid;
  const height = useHeaderHeight() + 13;
  const [like, setLike] = useState(null);
  const [userName, setUserName] = useState('');
  const [likeColor, setLikeColor] = useState(COLORS.gray);
  const [sellerInfo, setSellerInfo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [wishListModal, setWishListModal] = useState(false);
  const categories = [
    'fraud',
    'illegal_items',
    'spam',
    'harassment',
    'nudity',
    'hate_speech',
  ];

  useLayoutEffect(() => {
    item.navigation.setOptions({
      headerBackTitle: ' ',
      headerRight: () => (
        <TouchableOpacity
          style={{paddingHorizontal: 5}}
          onPress={() => {
            setModalVisible(true);
          }}>
          <MaterialCommunityIcons name={'dots-horizontal'} size={30} />
        </TouchableOpacity>
      ),
    });
  });

  function getBuyerName() {
    database()
      .ref(`Users/${firebase.auth().currentUser.uid}`)
      .once('value')
      .then((snapshot) => {
        setUserName(snapshot.val().name);
      });
  }

  function reportItem(cat) {
    const date = new Date();

    database().ref(`ReportedItems/${cat}/${itemData.key}`).set(date.toString());
  }

  const updateWishList = (state) => {
    if (state) {
      database().ref(`wishlist/${itemData.key}/${userId}`).set({like: true});
    } else {
      database().ref(`wishlist/${itemData.key}/${userId}`).set({like: false});
    }
  };

  useEffect(() => {
    getBuyerName();
    console.log(itemData.key);

    const getWishListUpdate = () =>
      database()
        .ref(`wishlist/${itemData.key}/${userId}`)
        .on('value', (snp) => {
          if (snp.val()) {
            setLike(snp.val().like);
            snp.val().like
              ? setLikeColor(COLORS.orange)
              : setLikeColor(COLORS.gray);
          } else {
            setLike(false);
            setLikeColor(COLORS.gray);
          }
        });

    const unsubscribe = () =>
      database()
        .ref(`Users/${itemData.uid}`)
        .on('value', (snapshot) => {
          if (snapshot) {
            setSellerInfo(snapshot.val());
          }
        });
    getWishListUpdate();

    unsubscribe();
    return () => {
      database().ref(`wishlist/${itemData.key}/${userId}`).off();
      database().ref(`/Users/${itemData.uid}`).off();
    };
  }, [itemData.key, itemData.uid, like, userId]);

  return (
    <SafeAreaView>
      <View>
        <View>
          <Modal
            // style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
            animationType="slide"
            transparent={true}
            visible={wishListModal}
            onRequestClose={() => {
              // this.closeButtonFunction()
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',

                height: 100,
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
                {like && (
                  <Text style={{color: COLORS.white, fontWeight: '500'}}>
                    Item Saved To WishList
                  </Text>
                )}
                {!like && (
                  <Text style={{color: COLORS.white, fontWeight: '500'}}>
                    Item Removed From Wishlist
                  </Text>
                )}
              </View>
            </View>
          </Modal>
        </View>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              console.alert('Modal has been closed.');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // marginTop: 22,
              }}>
              <View
                style={{
                  margin: 20,
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 35,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setCatModalVisible(true);
                  }}>
                  <Text style={styles.modalText}>Report</Text>
                </TouchableOpacity>

                <TouchableHighlight
                  style={{...styles.openButton, backgroundColor: '#2196F3'}}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={catModalVisible}
            onRequestClose={() => {
              console.alert('Modal has been closed.');
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  onPress={() => {
                    reportItem(categories[0]);
                    setCatModalVisible(false);
                    setConfirmModalVisible(true);
                  }}>
                  <Text style={styles.modalText}>Fraud</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    reportItem(categories[1]);
                    setCatModalVisible(false);
                    setConfirmModalVisible(true);
                  }}>
                  <Text style={styles.modalText}>Illegal Items</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    reportItem(categories[2]);
                    setCatModalVisible(false);
                    setConfirmModalVisible(true);
                  }}>
                  <Text style={styles.modalText}>Spam</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    reportItem(categories[3]);
                    setCatModalVisible(false);
                    setConfirmModalVisible(true);
                  }}>
                  <Text style={styles.modalText}>Harassment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    reportItem(categories[4]);
                    setCatModalVisible(false);
                    setConfirmModalVisible(true);
                  }}>
                  <Text style={styles.modalText}>
                    Nudity or Sexual Activity
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    reportItem(categories[5]);
                    setCatModalVisible(false);
                    setConfirmModalVisible(true);
                  }}>
                  <Text style={styles.modalText}>Hate Speech</Text>
                </TouchableOpacity>

                <TouchableHighlight
                  style={{...styles.openButton, backgroundColor: '#2196F3'}}
                  onPress={() => {
                    setCatModalVisible(!catModalVisible);
                  }}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={confirmModalVisible}
            onRequestClose={() => {
              console.alert('Modal has been closed.');
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Item Reported</Text>
                <TouchableHighlight
                  style={{...styles.openButton, backgroundColor: '#2196F3'}}
                  onPress={() => {
                    setConfirmModalVisible(!confirmModalVisible);
                  }}>
                  <Text style={styles.textStyle}>OK</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <ScrollView>
        <SwiperFlatList
          style={{paddingVertical: 10}}
          index={0}
          paginationStyle={{height: 380}}
          showPagination
          data={['1']}
          renderItem={({item}) => (
            <FastImage
              style={{height: 400, width: Dimensions.get('screen').width}}
              source={{
                uri: itemData.img_url,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.stretch}
            />
          )}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          <View>
            <Text style={styles.itemNameIS}>{itemData.name}</Text>
          </View>
          <View>
            <Text style={styles.postDate}>
              Posted {showDate(itemData.timestamp)}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{flexDirection: 'row', alignContent: 'center', padding: 10}}>
            <FastImage
              style={styles.profileImage}
              source={{
                uri: itemData.profile_picture_url,
                priority: FastImage.priority.high,
              }}
            />
            <View style={{justifyContent: 'center', paddingHorizontal: 10}}>
              <TouchableOpacity
                onPress={() => {
                  item.navigation.navigate('ShowProfile', {
                    userData: {...sellerInfo, itemData},
                  });
                }}>
                <Text style={styles.userName}>{sellerInfo.name}</Text>
              </TouchableOpacity>

              {/* <View style={{flexDirection: 'row', paddingVertical: 2}}>
                <AntDesign name={'star'} color={COLORS.orange} />
                <AntDesign name={'star'} color={COLORS.orange} />
                <AntDesign name={'star'} color={COLORS.orange} />
                <AntDesign name={'star'} color={COLORS.orange} />
                <AntDesign name={'star'} color={COLORS.black} />
                <Text> 4/5</Text>
              </View> */}

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
                  sellerInfo.rating_total / sellerInfo.rating_count
                }
                isDisabled={true}
                size={15}
              />

              <View style={{flexDirection: 'row'}}>
                <View style={{paddingRight: 5}}>
                  <Button
                    onPress={() => {
                      item.navigation.navigate('Buy', {
                        itemsData: {
                          ...itemData,
                          sellerName: sellerInfo.name,
                          sellerUid: sellerInfo.uid,
                          buyerName: userName,
                        },
                        height: height,
                        sellerInfo: sellerInfo,
                      });
                    }}
                    title={'Buy'}
                    containerStyle={styles.buyButton}
                  />
                </View>
                <View style={{paddingHorizontal: 5}}>
                  <Button
                    onPress={async () => {
                      const key1 = firebase.auth().currentUser.uid;
                      const key2 = sellerInfo.uid;
                      // console.log(sellerInfo);
                      var id;

                      const key1_key2 = await database()
                        .ref(`chatMessages/${key1}_${key2}`)
                        .once('value')
                        .then((res) => res.exists());

                      const key2_key1 = await database()
                        .ref(`chatMessages/${key2}_${key1}`)
                        .once('value')
                        .then((res) => res.exists());

                      if (key1_key2) {
                        id = key1 + '_' + key2;
                      } else if (key2_key1) {
                        id = key2 + '_' + key1;
                      } else {
                        id = key1 + '_' + key2;
                      }

                      item.navigation.navigate('Chat', {
                        screen: 'ConversationScreen',
                        params: {
                          user: {
                            ...sellerInfo,
                            id: id,
                            img_url: itemData.profile_picture_url,
                            users: {user1: key1, user2: sellerInfo.uid},
                          },
                          height: height,
                        },
                      });
                    }}
                    title={'Chat'}
                    containerStyle={styles.buyButton}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              alignContent: 'center',
              padding: 20,
              alignItems: 'flex-end',
            }}>
            <Text style={styles.price}>{'$' + `${itemData.price}`}</Text>
            <Text style={{fontSize: 18}}>{itemData.payment_method}</Text>
            <TouchableOpacity
              onPress={() => {
                updateWishList(!like);
                setWishListModal(true);
                setTimeout(() => setWishListModal(false), 2000);
              }}>
              <AntDesign
                name={'heart'}
                size={30}
                color={likeColor}
                style={{paddingVertical: 5}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{paddingHorizontal: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.category}>Condition</Text>
            <Text>{itemData.condition}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.category}>Brand</Text>
            <Text>{itemData.brand}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.category}>Category</Text>
            <Text>{itemData.category}</Text>
          </View>
          <Text style={styles.category}>Description</Text>
          <Text>{itemData.description}</Text>
        </View>
        <View style={{height: 50}} />
      </ScrollView>
      <Modal
        style={{justifyContent: 'flex-end', margin: 0}}
        animationType="slide"
        transparent={true}
        visible={false}
        onRequestClose={() => {
          console.alert('Modal has been closed.');
        }}>
        <View
          style={{
            flex: 0.5,
            alignItems: 'flex-end',
            justifyContent: 'center',
            borderRadius: 34,
            margin: 10,

            width: 100,
            alignSelf: 'center',
            backgroundColor: COLORS.white,
            marginBottom: 30,
          }}>
          {like && <Text>Item Saved WishList</Text>}
          {!like && <Text>Item Has Been Removed From the Wishlist</Text>}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles1 = StyleSheet.create({
  container: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    margin: 10,
    width: WIDTH - 40,
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 30,
  },

  cancelButton: {
    backgroundColor: COLORS.blue,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    width: WIDTH - 40,
    borderRadius: 10,
    marginTop: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  rowItem: {
    backgroundColor: '#ddd',
    width: WIDTH - 40,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 18,
  },
  profileContainer: {
    width: 100,
    height: 120,
    alignSelf: 'center',
  },
  editText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    alignSelf: 'flex-end',
    height: 40,
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
});
