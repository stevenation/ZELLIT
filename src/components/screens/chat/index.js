import React from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import ChatCell from './chatCell';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';
import {COLORS} from '../../../constants';
import * as FileSystem from 'expo-file-system';
import storage from '@react-native-firebase/storage';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      userId: firebase.auth().currentUser.uid,
    };
  }

  UNSAFE_componentWillMount() {
    this.unsubscribe();
    this.cacheProfilePictures();
  }
  componentDidMount() {
    this.unsubscribe();
  }

  async cacheProfilePictures() {
    const folder_info = await FileSystem.getInfoAsync(
      `${FileSystem.cacheDirectory}profileprictures`,
    );
    if (!folder_info.exists) {
      try {
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.cacheDirectory}profilepictures`,
        );
      } catch (error) {
        console.log(error);
      }
    }

    const path = `${FileSystem.cacheDirectory}profilepictures/`;
    storage()
      .ref('images/profile_pictures')
      .list()
      .then((result) => {
        result.items.forEach(async (ref) => {
          const image = await FileSystem.getInfoAsync(`${path}${ref.name}`);
          if (!image.exists) {
            ref.getDownloadURL().then(async (uri) => {
              try {
                await FileSystem.downloadAsync(uri, `${path}${ref.name}`);
              } catch (error) {
                console.log(error);
              }
            });
          }
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
          b.push(chat);
          if (
            child.val().users.user1 === this.state.userId ||
            child.val().users.user2 === this.state.userId
          ) {
            this.setState({chats: b});
          }
        });
      });
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor: COLORS.white}}>
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
      </SafeAreaView>
    );
  }
}
