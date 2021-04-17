import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, Modal, Dimensions} from 'react-native';
import {Shadow} from 'react-native-neomorph-shadows';
import {styles} from './styles';
import {COLORS} from '../../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';

export default function ItemCell({itemData, navigation}) {
  const userId = firebase.auth().currentUser.uid;
  const [like, setLike] = useState(null);
  const [likeColor, setLikeColor] = useState(COLORS.gray);
  const [wishListModal, setWishListModal] = useState(false);
  const WIDTH = Dimensions.get('screen').width;

  const updateWishList = (state) => {
    if (state) {
      database().ref(`wishlist/${itemData.key}/${userId}`).set({like: true});
    } else {
      database().ref(`wishlist/${itemData.key}/${userId}`).set({like: false});
    }
  };

  useEffect(() => {
    const unsubscribe = () =>
      database()
        .ref(`wishlist/${itemData.key}/${userId}`)
        .on('value', (snp) => {
          if (snp.val() !== null) {
            setLike(snp.val().like);
            snp.val().like
              ? setLikeColor(COLORS.orange)
              : setLikeColor(COLORS.gray);
          } else {
            setLikeColor(COLORS.gray);
          }
        });

    unsubscribe();

    return () => database().ref(`wishlist/${itemData.key}/${userId}`).off();
  }, [itemData.key, like, userId]);

  return (
    <View style={styles.cellContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={wishListModal}
        onRequestClose={() => {}}>
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
      <Shadow style={styles.cell}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Listing Details', {itemData: itemData})
          }>
          <FastImage
            style={styles.cellImage}
            source={{
              uri: itemData.img_url,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.itemName}>{itemData['name']}</Text>
            <Text style={styles.itemPrice}>{'$' + `${itemData['price']}`}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              updateWishList(!like);
              setWishListModal(true);
              setTimeout(() => setWishListModal(false), 2000);
            }}>
            <MaterialCommunityIcons
              name={'heart'}
              size={30}
              color={likeColor}
            />
          </TouchableOpacity>
        </View>
      </Shadow>
    </View>
  );
}
