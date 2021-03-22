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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './styles';
import {COLORS} from '../../../constants';
import ItemCell from './itemCell';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';
import * as FileSystem from 'expo-file-system';
import shortHash from 'shorthash2';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

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
      refresh: false,
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
      .on('value', function (snapshot) {
        if (!snapshot.val()) {
          return;
        }
        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(function () {
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });
  }
  //     useEffect(() => {
  //     return () => checkUserStatus()
  // }, [])

  capitalize(str) {
    return str.replace(/\w\S*/g, (w) =>
      w.replace(/^\w/, (c) => c.toUpperCase()),
    );
  }

  onRefresh = () => {
    this.setState({refresh: true});
    this.fetchData();
    wait(2000).then(() => this.setState({refresh: false}));
  };

  async fetchData() {
    var userId = firebase.auth().currentUser.uid;
    const folder_info = await FileSystem.getInfoAsync(
      `${FileSystem.cacheDirectory}items`,
    );
    if (!folder_info.exists) {
      try {
        FileSystem.makeDirectoryAsync(`${FileSystem.cacheDirectory}items`);
      } catch (error) {
        console.log(error);
      }
    }
    userId == null
      ? console.log('userID is empty')
      : database()
          .ref(`Users/${userId}`)
          .on('value', async (snapshot) => {
            this.setState({userData: snapshot.val()});
            this.setState({title: this.capitalize(snapshot.val()['college'])});
            await database()
              .ref(`${snapshot.val()['college']}/Items`)
              .on('value', (snp) => {
                var lst = [];

                snp.forEach(async (child) => {
                  const item = child.val();
                  const path = `${FileSystem.cacheDirectory}items/${child.key}`;
                  const image = await FileSystem.getInfoAsync(path);
                  var uri;
                  if (image.exists) {
                    uri = image.uri;
                  } else {
                    console.log('downloading');
                    try {
                      const newImage = await FileSystem.downloadAsync(
                        item.img_url,
                        path,
                      );
                      uri = newImage.uri;
                    } catch (error) {
                      console.log(error);
                    }
                  }
                  await lst.push({
                    key: child.key,
                    path: uri,
                    name: item.name,
                    price: item.price,
                    uid: item.uid,
                    condition: item.condition,
                    brand: item.brand,
                    description: item.description,
                    img_url: item.img_url,
                    category: item.category,
                    payment_method: item.payment_method,
                  });
                  this.setState({itemsData: lst});
                });
              });
          });
  }

  UNSAFE_componentWillMount() {
    this.fetchData();
    this.checkUserStatus();
  }

  render() {
    return (
      <View>
        <StatusBar barStyle={'dark-content'} />
        <SafeAreaView>
          <View style={{paddingVertical: 5}}>
            <Text style={styles.collegeName}>{this.state.title}</Text>
          </View>

          {/*<View>*/}
          {/*    <SearchBar*/}
          {/*        searchIcon={{size: 24}}*/}
          {/*        containerStyle={{backgroundColor: COLORS.white, borderTopWidth: 0}}*/}
          {/*        round={true}*/}
          {/*        lightTheme={true}*/}
          {/*        placeholder={"search item"}*/}
          {/*    />*/}
          {/*</View>*/}

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

          <ScrollView
            style={{maxHeight: 700}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refresh}
                onRefresh={this.onRefresh}
              />
            }>
            {/*<View>*/}
            {/*    <View style={styles.section}>*/}
            {/*        <Text style={styles.sectionTitle}>Recent</Text>*/}
            {/*    </View>*/}
            {/*    <FlatList initialNumToRender={4} horizontal={true} data={this.state.itemsData} renderItem={({item}) => {*/}
            {/*        return (*/}
            {/*            <ItemCell itemData={item} navigation={this.props.navigation}/>*/}
            {/*        )*/}
            {/*    }}/>*/}
            {/*</View>*/}
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
                initialNumToRender={4}
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
