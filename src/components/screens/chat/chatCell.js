import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';
import * as FileSystem from 'expo-file-system';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../../constants';

export default function ChatCell({user, height, navigation}) {
  var user1;
  const [userName, setUserName] = useState('');
  const [imageProfile, setImageProfile] = useState('default');
  const userId = firebase.auth().currentUser.uid;
  const path = `${FileSystem.cacheDirectory}profilepictures/`;
  const lastSent = new Date(user.lastSent * 1000)
    .toLocaleTimeString()
    .slice(0, 5);
  if (user !== []) {
    user.users.user1 === userId
      ? (user1 = user.users.user2)
      : (user1 = user.users.user1);
  } else {
    console.log('emptyyyyyyy');
  }
  useEffect(() => {
    async function getUserName() {
      await database()
        .ref(`Users/${user1}`)
        .once('value')
        .then((snapshot) => {
          setUserName(snapshot.val().name);
          if (typeof snapshot.val().profile_picture !== 'undefined') {
            setImageProfile(snapshot.val().profile_picture);
          }
        });
    }

    getUserName();
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
          {/*<Image source={{uri:`${path}${imageProfile}`}} style={styles.profilePicture}/>*/}
        </View>
      );
    } else {
      return (
        <View style={styles.profileContainer}>
          <Image
            source={{uri: `${path}${imageProfile}`}}
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
              profile: imageProfile,
              path: `${path}${imageProfile}`,
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
