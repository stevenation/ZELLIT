import React from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import ChatCell from './chatCell';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';
import {COLORS} from '../../../constants';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class Chat extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      userId: firebase.auth().currentUser.uid,
    };
  }

  UNSAFE_componentWillMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.unsubscribe();
      this.cacheProfilePictures();
    }
  }

  componentWillUnmount() {
    database().ref(`chats`).off('value', this.unsubscribe);
  }

  async cacheProfilePictures() {
    storage()
      .ref('images/profile_pictures')
      .list()
      .then((result) => {
        result.items.forEach(async (ref) => {
          ref.getDownloadURL().then(async (uri) => {
            try {
              FastImage.preload([{uri: uri}]);
            } catch (error) {
              console.log(error);
            }
          });
        });
      });
  }

  async unsubscribe() {
    await database()
      .ref('chats')
      .on('value', async (snapshot) => {
        var b = [];
        snapshot.forEach(async (child) => {
          const chat = {...child.val(), id: child.key};
          if (
            child.val().users.user1 === this.state.userId ||
            child.val().users.user2 === this.state.userId
          ) {
            b.push(chat);
            this.setState({chats: b});
          }
        });
      });
  }
  noChats() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          height: 400,
        }}>
        <AntDesign name={'wechat'} size={200} color={COLORS.blue} />
        <Text style={{fontSize: 24, paddingTop: 20}}>No Chats</Text>
      </View>
    );
  }
  Chats() {
    return (
      <FlatList
        data={this.state.chats}
        renderItem={({item}) => (
          <ChatCell
            user={item}
            height={103}
            navigation={this.props.navigation}
          />
        )}
      />
    );
  }
  render() {
    return (
      <SafeAreaView style={{backgroundColor: COLORS.white}}>
        {!this.state.chats.length ? this.noChats() : this.Chats()}
        {/* {this.Chats()} */}
      </SafeAreaView>
    );
  }
}
