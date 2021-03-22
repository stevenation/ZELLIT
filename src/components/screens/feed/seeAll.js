import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../../constants';
import ItemCell from './itemCell';
import {FlatGrid} from 'react-native-super-grid';
import {styles} from './styles';

export default function SeeAll(itemsData) {
  const name = itemsData.route.params.name;
  const data = itemsData.route.params.itemsData;

  var itemData = [];

  data.forEach((item) => {
    if (name === 'Stationery' && item.category === name) {
      itemData.push(item);
    } else if (name === 'Electronics' && item.category === name) {
      itemData.push(item);
    } else if (name === 'Textbooks' && item.category === name) {
      itemData.push(item);
    }
  });
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 5,
        }}>
        <View>
          <TouchableOpacity
            onPress={() => itemsData.navigation.navigate('Feed')}>
            <AntDesign name={'left'} size={25} style={{color: COLORS.blue}} />
          </TouchableOpacity>
        </View>
        <View style={{paddingRight: 10}}>
          <Text style={{...styles.collegeName}}>{name}</Text>
        </View>
      </View>
      <FlatGrid
        itemDimension={125}
        data={itemData}
        renderItem={({item}) => (
          <ItemCell itemData={item} navigation={itemsData.navigation} />
        )}
      />
    </SafeAreaView>
  );
}
