import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Shadow} from 'react-native-neomorph-shadows';
import {styles} from './styles';
import {Image} from 'react-native-elements';
import {COLORS} from '../../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ItemCell({itemData, navigation}) {
  const [like, setLike] = useState(false);
  const [likeColor, setLikeColor] = useState(COLORS.gray);

  useEffect(() => {
    like ? setLikeColor(COLORS.orange) : setLikeColor(COLORS.gray);
  }, []);
  return (
    <View style={styles.cellContainer}>
      <Shadow style={styles.cell}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Listing Details', {itemData: itemData})
          }>
          <Image
            borderTopLeftRadius={25}
            borderTopRightRadius={25}
            resizeMode={'stretch'}
            style={styles.cellImage}
            source={{uri: itemData.path ? itemData.path : null}}
          />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.itemName}>{itemData['name']}</Text>
            <Text style={styles.itemPrice}>{'$' + `${itemData['price']}`}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setLike(!like);
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
