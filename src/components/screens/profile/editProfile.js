import React, {Component, useRef} from 'react';
import {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import {COLORS} from '../../../constants';
import {Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCropPicker from 'react-native-image-crop-picker';

const WIDTH = Dimensions.get('screen').width;

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.uid,
      userData: this.props.route.params.data,
      url: this.props.route.params.data.url,
      itemsData: [],
      rating_count: 0,
      nameModalVisible: false,
      modalVisible: false,
      name: this.props.route.params.data.name,
      profile_picture_name: this.profilePictureName(
        this.props.route.params.data.email,
      ),
    };
  }
  UNSAFE_componentWillMount() {
    console.log(this.props.route.params.data);
  }
  onOpen() {
    this.setState({modalVisible: true});
  }
  componentWillUnmount() {
    this.setState({modalVisible: false});
  }

  renderContent = () => [
    <View>
      <Text>Hello There</Text>
    </View>,
  ];
  updateName() {
    database()
      .ref(`Users/${this.state.userId}`)
      .update({name: this.state.name});
  }
  deteleImage() {
    console.log('delete image: ', this.state.userData.profile_picture);
    storage()
      .ref(`images/profile_pictures/${this.state.userData.profile_picture}`)
      .delete()
      .then(() =>
        console.log(
          `image: ${this.state.userData.profile_picture} successfully deleted`,
        ),
      )
      .catch((error) => console.log(error));
  }

  defaultProfilePicture() {
    database()
      .ref(`Users/${this.state.userId}`)
      .update({profile_picture: 'default.png'});
  }

  profilePictureName(str) {
    return str.replace('@', '_').replace('.', '_') + '_profile_picture.jpg';
  }

  async uploadPhoto(path) {
    storage()
      .ref(`images/profile_pictures/${this.state.profile_picture_name}`)
      .putFile(path)
      .then(() => console.log('images successfully updated'))
      .catch((e) => console.log(e));

    var url = await storage()
      .ref(`images/profile_pictures/${this.state.profile_picture_name}`)
      .getDownloadURL();

    database().ref(`Users/${this.state.userId}`).update({url: url});
    FastImage.preload([{uri: url}]);
  }
  openCamera() {
    return ImageCropPicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then((image) => {
        database()
          .ref(`Users/${this.state.userId}`)
          .update({profile_picture: 'default.png'});
        if (this.state.userData.profile_picture !== 'default.png') {
          this.deteleImage();
        }

        console.log(image.path);
        this.uploadPhoto(image.path);
        database()
          .ref(`Users/${this.state.userId}`)
          .update({profile_picture: this.state.profile_picture_name});
        this.setState({modalVisible: !this.state.modalVisible});
      })
      .catch((e) => console.log(e));
  }

  choosePhoto() {
    return ImageCropPicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        database().ref(`Users/${this.state.userId}`).update({
          profile_picture: this.state.profile_picture_name,
        });
        if (this.state.userData.profile_picture !== 'default.png') {
          this.deteleImage();
          database()
            .ref(`Users/${this.state.userId}`)
            .update({profile_picture: 'default.png'});
        }
        console.log(image.path);
        this.setState({url: image.path});
        this.uploadPhoto(image.path);
        database()
          .ref(`Users/${this.state.userId}`)
          .update({profile_picture: this.state.profile_picture_name});
        this.setState({modalVisible: !this.state.modalVisible});
      })

      .catch((error) => console.log(error));
  }
  changeNameModal() {
    return (
      <Modal
        // style={{backgroundColor: '#ddd', width: WIDTH}}
        animationType="slide"
        transparent={false}
        visible={this.state.nameModalVisible}>
        <View
          style={{
            flex: 0.94,
            width: WIDTH,
            alignSelf: 'center',
            paddingLeft: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              left: 0,
              paddingVertical: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({nameModalVisible: !this.state.nameModalVisible})
              }>
              <Ionicons
                name={'ios-chevron-back'}
                size={30}
                color={COLORS.blue}
              />
            </TouchableOpacity>

            <Text
              style={{
                alignSelf: 'center',
                fontSize: 18,
                fontWeight: '500',
                marginRight: 10,
              }}>
              Name
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.updateName();
                this.setState({nameModalVisible: !this.state.nameModalVisible});
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 16,
                  fontWeight: '500',
                  marginRight: 10,
                  color: COLORS.blue,
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: '#ddd',
              height: 60,
              justifyContent: 'center',
            }}>
            <Text
              style={{fontSize: 12, color: COLORS.gray, alignSelf: 'center'}}>
              Choose a name that will help users indentify you.
            </Text>
          </View>
          <View style={{padding: 10}}>
            <Text>Name</Text>
            <TextInput
              onChangeText={(text) => this.setState({name: text})}
              placeholder={this.state.userData.name}
              style={{height: 40, borderBottomWidth: 1}}
            />
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <SafeAreaView>
        <View style={{paddingLeft: 5}}>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => {
              this.onOpen();
            }}>
            <FastImage
              style={{width: 100, height: 100, borderRadius: 50}}
              resizeMode={FastImage.resizeMode.cover}
              source={{uri: this.state.url, cache: FastImage.cacheControl.web}}
            />
            <Text style={{alignSelf: 'center', color: COLORS.orange}}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({nameModalVisible: !this.state.nameModalVisible})
            }
            style={styles.dataContainer}>
            <Text style={{fontWeight: '500'}}>Name</Text>

            <View style={styles.editText}>
              <Text style={{color: COLORS.gray}}>{this.state.name}</Text>
              <Ionicons
                name={'ios-chevron-forward'}
                size={20}
                color={COLORS.gray}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dataContainer}>
            <Text style={{fontWeight: '500'}}>Email</Text>
            <TouchableOpacity style={styles.editText}>
              <Text style={{color: COLORS.gray}}>
                {this.state.userData.email}
              </Text>
              {/* <Ionicons
              name={'ios-chevron-forward'}
              size={20}
              color={COLORS.gray}
            /> */}
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dataContainer}>
            <Text style={{fontWeight: '500'}}>Password</Text>

            <TouchableOpacity style={styles.editText}>
              <Ionicons
                name={'ios-chevron-forward'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dataContainer}>
            <Text style={{fontWeight: '500'}}>Disable Account</Text>

            <TouchableOpacity style={styles.editText}>
              <Ionicons
                name={'ios-chevron-forward'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dataContainer}>
            <Text style={{fontWeight: '500'}}>Delete Account</Text>

            <TouchableOpacity style={styles.editText}>
              <Ionicons
                name={'ios-chevron-forward'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {this.state.nameModalVisible && this.changeNameModal()}
          <Modal
            style={{justifyContent: 'flex-end', margin: 2}}
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              // this.closeButtonFunction()
            }}>
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => {
                  this.deteleImage();
                  this.defaultProfilePicture();
                  this.setState({modalVisible: !this.state.modalVisible});
                }}
                style={{
                  ...styles.rowItem,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}>
                <Text style={{...styles.rowText, color: COLORS.orange}}>
                  Delete Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.openCamera()}
                style={styles.rowItem}>
                <Text style={styles.rowText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.choosePhoto();
                  // this.setState({modalVisible: !this.state.modalVisible});
                }}
                style={{
                  ...styles.rowItem,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <Text style={styles.rowText}>Choose Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  this.setState({modalVisible: !this.state.modalVisible});
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    margin: 10,
    width: WIDTH - 40,
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 30,
  },

  cancelButton: {
    backgroundColor: COLORS.blue,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    width: WIDTH - 40,
    borderRadius: 10,
    marginTop: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  rowItem: {
    backgroundColor: '#ddd',
    width: WIDTH - 40,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 18,
  },
  profileContainer: {
    width: 100,
    height: 120,
    alignSelf: 'center',
  },
  editText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    alignSelf: 'flex-end',
    height: 40,
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
});
