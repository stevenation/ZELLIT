import React from 'react';
import {Image, SafeAreaView, Text, View} from 'react-native';
import {Button, Input} from 'react-native-elements';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';

export default function Buy(item) {
  const itemData = item.route.params.itemsData;
  console.log(itemData);
  const key1 = firebase.auth().currentUser.uid;
  const key2 = itemData.sellerUid;
  const users = {user1: key1, user2: key2};

  async function confirmBuy() {
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

    const handleSend = async (uid1, uid2) => {
      const date = new Date();
      const text = 'Hey is this available?';
      const time = database.ServerValue.TIMESTAMP;

      database().ref(`transactions/${itemData.key}`).set({
        id: itemData.key,
        sellerId: itemData.uid,
        buyerId: firebase.auth().currentUser.uid,
        sellerName: itemData.sellerName,
        progress: 'Not Paid',
        itemName: itemData.name,
        buyerName: itemData.buyerName,
      });

      database()
        .ref(`chatMessages/${id}/${date.getTime()}`)
        .set({
          _id: uid1 + uid2 + date.getTime(),
          createdAt: time,
          image: itemData.img_url,
          text: text,
          user: {
            _id: uid1,
          },
        });
      database().ref(`chats/${id}`).set({
        lastMessage: text,
        lastSent: time,
        users: users,
      });
    };
    console.log('key12', key1_key2);
    console.log('key21', key2_key1);
    if (key1_key2) {
      console.log(key1_key2);
      handleSend(key1, key2);
    } else if (key2_key1) {
      handleSend(key2, key1);
    } else {
      handleSend(key2, key1);
    }
  }

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          padding: 10,
        }}>
        <Image
          style={{height: 100, width: 100}}
          source={{uri: itemData.path ? itemData.path : null}}
        />
        <View>
          <Text style={{fontWeight: '700', fontSize: 20}}>
            {itemData.sellerName}
          </Text>
          <Text>{itemData.name}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 5,
        }}>
        <Text style={{fontWeight: '700', fontSize: 20}}>You Pay</Text>
        <Text style={{fontWeight: '700', fontSize: 20}}>${itemData.price}</Text>
      </View>

      <Input
        containerStyle={{height: 100}}
        multiline={true}
        placeholder={'write a message to the seller'}
      />

      <Button
        onPress={() => {
          console.log(
            item.route.params.sellerInfo.uid,
            firebase.auth().currentUser.uid,
          );
          if (
            item.route.params.sellerInfo.uid !== firebase.auth().currentUser.uid
          ) {
            confirmBuy();
            item.navigation.navigate('Chat', {
              screen: 'conversationScreen',
              params: {
                user: item.route.params.sellerInfo,
                height: item.route.params.height,
              },
            });
          } else {
            alert('Cannot buy your own item');
          }
        }}
        title={'Confirm Buy'}
        style={{width: 150, alignSelf: 'center'}}
      />
    </SafeAreaView>
  );
}
