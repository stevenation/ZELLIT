import React, {useCallback, useEffect, useState} from 'react';
import {LogBox, TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';
import {Bubble, GiftedChat, InputToolbar, Time} from 'react-native-gifted-chat';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../../constants';

export default function ConversationScreen(props, {navigation}) {

  LogBox.ignoreAllLogs();
  const users = props.route.params.user;
  const userId = firebase.auth().currentUser.uid;
  const _id = userId;
  const dbRef = database().ref(`chatMessages/${users.id}`);
  const [user, setUser] = useState({_id});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = dbRef
      .orderByChild('createdAt')
      .on('child_added', (snapshot) => {
        if (typeof snapshot !== 'undefined') {
          if (snapshot.exists() && snapshot.val() !== '') {
            if (
              !snapshot.val().received &&
              snapshot.val().user._id !== userId
            ) {
              updateReceived(snapshot.key);
              setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, {
                  ...snapshot.val(),
                  received: true,
                }),
              );
            } else {
              setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, snapshot.val()),
              ); /**/
            }
          }
        }
      });

    return () => dbRef.off('value', unsubscribe);
  }, []);

  async function handleSend(message) {
    const writes = message.map((m) => {
      const time = database.ServerValue.TIMESTAMP;
      database()
        .ref(`chatMessages/${users.id}/${new Date().getTime()}`)
        .set({...m, createdAt: time, received: false, sent: true});
      database().ref(`chats/${users.id}`).set({
        lastMessage: message[0].text,
        lastSent: time,
        users: users.users,
      });
    });
    await Promise.all(writes);
  }

  function openCamera() {
    ImageCropPicker.openCamera({
      width: 300,
      height: 300,
    })
      .then(async (image) => {
        const date = new Date()
          .toString()
          .replace('-', '')
          .replace('(', '')
          .replace(')', '')
          .split(/:| /);

        var imgName = userId;
        date.forEach((i) => {
          imgName += i;
        });
        console.log(image);
        let uri = image.path;
        let path = `images/chats/${imgName}`;
        await storage()
          .ref(path)
          .putFile(uri)
          .then(async (snapshot) => {
            storage()
              .ref(path)
              .getDownloadURL()
              .then(async (uri) => {
                const msg = [
                  {
                    _id: userId + imgName,
                    createdAt: new Date().getTime(),
                    image: uri,
                    user: {
                      _id: userId,
                    },
                  },
                ];
                handleSend(msg);
              });
          });
      })
      .catch((e) => console.log(e));
  }

  function customInputToolbar(props) {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: COLORS.white,
          borderTopColor: '#E8E8E8',
          borderRadius: 2,
          borderTopWidth: 1,
          // padding: 8
        }}
      />
    );
  }

  function customTime(props) {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: COLORS.black,
          },
        }}
      />
    );
  }

  function customBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: COLORS.lightGreen,
            borderRadius: 30,
            padding: 5,
          },
          right: {
            borderRadius: 30,
            padding: 5,
          },
        }}
      />
    );
  }

  function updateReceived(key) {
    if (key) {
      database()
        .ref(`chatMessages/${users.id}`)
        .child(key)
        .update({received: true});
    }
  }

  return (
    <GiftedChat
      messages={messages}
      user={user}
      renderTime={(props) => customTime(props)}
      renderAvatar={null}
      renderBubble={(props) => customBubble(props)}
      showAvatarForEveryMessage={false}
      onSend={(messages) => handleSend(messages)}
      renderInputToolbar={(props) => customInputToolbar(props)}
      renderActions={() => (
        <TouchableOpacity
          onPress={() => {
            openCamera();
          }}>
          <AntDesign
            name={'pluscircleo'}
            size={30}
            color={COLORS.blue}
            style={{
              bottom: 5,
              left: 5,
              right: 10,
              color: COLORS.blue,
              position: 'relative',
            }}
          />
        </TouchableOpacity>
      )}
    />
  );
}
