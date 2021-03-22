import React from 'react';
import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';

export default function BuyPending() {
  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity>
          <Text>I Have Paid</Text>
        </TouchableOpacity>
        <Text>Seller has confirmed payment</Text>
      </View>
    </SafeAreaView>
  );
}
