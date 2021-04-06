import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Shadow} from 'react-native-neomorph-shadows';
import {styles} from './styles';
import {Image} from 'react-native-elements';
import {COLORS} from '../../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';

export default function ItemCell({itemData, navigation}) {
  const userId = firebase.auth().currentUser.uid;
  const [like, setLike] = useState(null);
  const [likeColor, setLikeColor] = useState(COLORS.gray);

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
          console.log(typeof snp);
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
