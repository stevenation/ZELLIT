import React from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from '../../../constants';
import {styles} from './styles';
import Feather from 'react-native-vector-icons/Feather';

export default function TransactionCell(data, {navigation}) {
  const item = data.data;
  return (
    <TouchableOpacity
      onPress={() => {
        if (item.state === 'buy') {
          data.navigation.navigate('BuyTransactionScreen', {data: item});
        } else if (item.state === 'sell') {
          data.navigation.navigate('SellTransactionScreen', {data: item});
        }
      }}
      style={{paddingVertical: 5}}>
      <View style={styles.cell}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={styles.sellerName}>
              {item.state === 'sell' ? item.buyerName : item.sellerName}
            </Text>
            <Text style={styles.itemName}>{item.itemName}</Text>
            <View style={{flexDirection: 'row'}}>
              <Feather name={'calendar'} size={20} color={COLORS.gray} />
              <Text style={styles.date}>2/12/2021</Text>
            </View>
          </View>
          <View style={styles.progessContainer}>
            <Text>Progress</Text>
            <View style={{...styles.progress, backgroundColor: COLORS.green}}>
              <Text style={styles.progressText}>
                {item.complete ? 'Complete' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
