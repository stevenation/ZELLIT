import React from 'react';
import {SafeAreaView} from 'react-native';
import {Text} from 'react-native-elements';
import {Button} from 'react-native-elements';

export default function BuyTransactionScreen() {
  return (
    <SafeAreaView>
      <Text>Once you have made payment</Text>
      <Text>Confirm Below</Text>
      <Button
        title={'Confirm Payment'}
        titleStyle={{fontWeight: '500'}}
        buttonStyle={{borderRadius: 50}}
        style={{width: 200, alignSelf: 'center'}}
      />
    </SafeAreaView>
  );
}
