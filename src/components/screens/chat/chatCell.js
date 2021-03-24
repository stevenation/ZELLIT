import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../../constants';
import FastImage from 'react-native-fast-image';

export default function ChatCell({user, height, navigation}) {
  var user1;
  const [userName, setUserName] = useState('');
  const [imageProfile, setImageProfile] = useState('default');
  const [imageName, setImageName] = useState('default.jpg');
  const userId = firebase.auth().currentUser.uid;
  const lastSent = new Date(user.lastSent)
    .toTimeString([], {hour: '2-digit', minute: '2-digit'})
    .slice(0, 5);
  if (user !== []) {
    user.users.user1 === userId
      ? (user1 = user.users.user2)
      : (user1 = user.users.user1);
  } else {
    console.log('emptyyyyyyy');
  }
  useEffect(() => {
    const unsubscribe = database()
      .ref(`Users/${user1}`)
      .on('value', async (snapshot) => {
        setUserName(snapshot.val().name);
        setImageName(snapshot.val().profile_picture);
        if (typeof snapshot.val().profile_picture !== 'undefined') {
          var url = await storage()
            .ref(`images/profile_pictures/${snapshot.val().profile_picture}`)
            .getDownloadURL();
          setImageProfile(url);
        }
      });
    return () => database().ref(`Users/${user1}`).off('value', unsubscribe);
  }, []);

  function showUnread() {
    if (user.unread > 0) {
      return (
        <View style={styles.unread}>
          <Text>{user.unread}</Text>
        </View>
      );
    }
  }

  function showProfile() {
    if (imageProfile === 'default') {
      return (
        <View style={styles.profileContainer}>
          <Ionicons
            name={'person-circle-sharp'}
            size={70}
            color={COLORS.lightGray}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.profileContainer}>
          <FastImage
            source={{uri: imageProfile}}
            style={styles.profilePicture}
          />
        </View>
      );
    }
  }

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ConversationScreen', {
            user: {
              ...user,
              name: userName,
              uid: user1,
              profile: imageName,
              img_url: imageProfile,
            },
            height: height,
          })
        }
        style={styles.cellContainer}>
        {showProfile()}

        <View style={{height: 85}}>
          <View style={styles.middleContainer}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.lastTalked}>{lastSent}</Text>
          </View>
          <View style={styles.lastContainer}>
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{user.lastMessage}</Text>
            </View>
            {showUnread()}
          </View>
        </View>
      </TouchableOpacity>
      <View style={{flexDirection: 'row'}}>
        <View style={{width: 85}}></View>
        <View style={styles.line}></View>
      </View>
    </SafeAreaView>
  );
}
