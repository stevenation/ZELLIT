import React from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {LogBox} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './styles';
import {COLORS} from '../../../constants';
import ItemCell from './itemCell';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image';

// LogBox.ignoreAllLogs();
// const wait = (timeout) => {
//   return new Promise((resolve) => setTimeout(resolve, timeout));
// };

export const categories = [
  {
    id: '1',
    name: 'School',
    icon: 'school',
  },
  {
    id: '2',
    name: 'Home',
    icon: 'sofa',
  },
  {
    id: '3',
    name: 'Electronics',
    icon: 'laptop',
  },
  {
    id: '4',
    name: 'Women',
    icon: 'human-female',
  },
  {
    id: '5',
    name: 'Men',
    icon: 'human-male',
  },
  {
    id: '6',
    name: 'Transportation',
    icon: 'bicycle',
  },
  {
    id: '7',
    name: 'other',
    icon: 'infinity',
  },
];
export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.uid,
      userData: [],
      itemsData: [],
      title: '',
    };
  }
  checkUserStatus() {
    var userStatusDatabaseRef = database().ref('/status/' + this.state.userId);
    var isOfflineForDatabase = {
      state: 'offline',
      last_changed: database.ServerValue.TIMESTAMP,
    };
    var isOnlineForDatabase = {
      state: 'online',
      last_changed: database.ServerValue.TIMESTAMP,
    };
    database()
      .ref('.info/connected')
      .on('value', (snapshot) => {
        if (!snapshot.val()) {
          return;
        }
        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });
  }

  capitalize(str) {
    return str.replace(/\w\S*/g, (w) =>
      w.replace(/^\w/, (c) => c.toUpperCase()),
    );
  }

  async fetchData() {
    var userId = firebase.auth().currentUser.uid;
    userId == null
      ? console.log('userID is empty')
      : database()
          .ref(`Users/${userId}`)
          .once('value')
          .then(async (snapshot) => {
            console.log(snapshot.val());
            this.setState({userData: snapshot.val()});
            this.setState({title: this.capitalize(snapshot.val()['college'])});
            console.log('hello');
            await database()
              .ref(`${snapshot.val().college}/Items`)
              .orderByValue()
              .once('value')
              .then((snp) => {
                snp.forEach(async (child) => {
                  if (child.val().uid !== userId) {
                    if (child.val().img_url) {
                      FastImage.preload([{uri: child.val().img_url}]);
                    }
                    database()
                      .ref(`Users/${child.val().uid}`)
                      .once('value')
                      .then((snap) => {
                        storage()
                          .ref(
                            `/images/profile_pictures/${
                              snap.val().profile_picture
                            }`,
                          )
                          .getDownloadURL()
                          .then(
                            (url) => {
                              FastImage.preload([{uri: url}]);
                              var lst = this.state.itemsData;
                              lst.push({
                                ...child.val(),
                                key: child.key,
                                profile_picture_url: url,
                              });
                              this.setState({itemsData: lst});
                            },
                            (error) => {
                              console.log(error);
                            },
                          );
                      });
                  }
                });
              });
          });
  }

  UNSAFE_componentWillMount() {
    setTimeout(() => {
      this.fetchData();
      this.checkUserStatus();
      console.log('done mounting');
    }, 1);
  }

  componentWillUnmount() {
    database().ref(`Users/${this.state.userId}`).off('value', this.fetchData);
  }
  render() {
    return (
      <View>
        <StatusBar barStyle={'dark-content'} />
        <SafeAreaView>
          <View style={{paddingVertical: 5}}>
            <Text style={styles.collegeName}>{this.state.title}</Text>
          </View>
          <FlatList
            horizontal={true}
            data={categories}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('categoryScreen', {
                    itemsData: this.state.itemsData,
                    name: item.name,
                  })
                }
                style={styles.categoryItem}>
                <View style={styles.catBackground}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={COLORS.white}
                  />
                </View>
                <Text numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <ScrollView style={{maxHeight: 700}}>
            <View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Electronics</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('SeeAll', {
                      itemsData: this.state.itemsData,
                      name: 'Electronics',
                    });
                  }}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal={true}
                data={this.state.itemsData}
                renderItem={({item}) => {
                  if (item.category === 'Electronics') {
                    return (
                      <ItemCell
                        itemData={item}
                        navigation={this.props.navigation}
                      />
                    );
                  }
                }}
              />
            </View>
            <View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stationery</Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('SeeAll', {
                      itemsData: this.state.itemsData,
                      name: 'Stationery',
                    })
                  }>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal={true}
                data={this.state.itemsData}
                renderItem={({item}) => {
                  if (item.category === 'Stationery') {
                    return (
                      <ItemCell
                        itemData={item}
                        navigation={this.props.navigation}
                      />
                    );
                  }
                }}
              />
            </View>

            <View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Textbooks</Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('SeeAll', {
                      itemsData: this.state.itemsData,
                      name: 'Textbooks',
                    })
                  }>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal={true}
                data={this.state.itemsData}
                renderItem={({item}) => {
                  if (item.category === 'Textbooks') {
                    return (
                      <ItemCell
                        itemData={item}
                        navigation={this.props.navigation}
                      />
                    );
                  }
                }}
              />
            </View>
            <View style={{height: 50}}></View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
