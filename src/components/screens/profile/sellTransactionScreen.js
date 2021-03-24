import database from '@react-native-firebase/database';
import React, {Component} from 'react';
import {Image, Modal, TouchableHighlight} from 'react-native';
import {View} from 'react-native';
import {SafeAreaView, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {COLORS} from '../../../constants';
import {styles} from '../profile/styles';
import * as FileSystem from 'expo-file-system';
import {Dimensions} from 'react-native';
import {firebase} from '@react-native-firebase/auth';

export default class SellTransactionScreen extends Component {
  _isMounted = true;

  constructor(props) {
    super(props);
    this.state = {
      data: props.route.params.data,
      showModal: false,
      id: props.route.params.data.transID,
      sellerInfo: null,
    };
  }
  UNSAFE_componentWillMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.GetBuyerInfo();
    }
  }

  UNSAFE_componentWillUpdate() {
    database()
      .ref(`transactions/${this.state.data.transID}`)
      .on('child_changed', (snapshot) => {
        console.log('snapShot', snapshot.val());
        if (snapshot) {
          this._isMounted = true;
          if (this._isMounted) {
            this.setState({data: {...this.state.data, complete: true}});
          }
        }
      });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  ConfirmPayment() {
    database().ref(`transactions/${this.state.id}`).update({
      complete: true,
    });
  }
  ShowButton() {
    return (
      <>
        <Text>Buyer Has Paid. Confirm Payment Below</Text>
        <Button
          onPress={() => {
            this.setState({showModal: true});
          }}
          title={'Confirm Payment'}
          titleStyle={styles.confirmTitleStyle}
          buttonStyle={styles.confirmButtonStyle}
          style={styles.confirmStyle}
        />
      </>
    );
  }
  ShowModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showModal}
        onRequestClose={() => {
          console.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Click Ok to Confirm Buyer Payment or Cancel to close
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  this.ConfirmPayment();
                  this.setState({showModal: false});
                }}>
                <Text style={styles.textStyle}>OK</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  this.setState({showModal: false});
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  ShowComplete() {
    return <View style={styles.complete}>Complete</View>;
  }
  GetBuyerInfo() {
    database()
      .ref(`Users/${this.state.data.buyerId}`)
      .once('value')
      .then((snapshot) => {
        this.setState({buyerInfo: snapshot.val()});
      });
  }
  render() {
    return (
      <SafeAreaView>
        <Image
          style={{width: Dimensions.get('screen').width, height: 100}}
          source={{
            uri: `${FileSystem.cacheDirectory}items/${this.state.data.transID}`,
          }}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: Dimensions.get('screen').width,
            backgroundColor: this.state.data.complete
              ? COLORS.green
              : COLORS.blue,
          }}>
          <Text style={{fontWeight: '700', fontSize: 20, color: COLORS.white}}>
            {this.state.data.paid && !this.state.data.complete
              ? 'Confirm Payment'
              : this.state.data.paid && this.state.data.complete
              ? 'Sold'
              : this.state.data.paid
              ? 'Paid'
              : 'Waiting For Payment'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <View>
            <Text
              style={{fontSize: 18, fontWeight: '700', paddingVertical: 10}}>
              {this.state.data.buyerName}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                color: COLORS.lightGray,
                paddingBottom: 10,
              }}>
              {this.state.data.itemName}
            </Text>
          </View>
          <Button
            title={'Chat'}
            style={{width: 80}}
            onPress={async () => {
              const key1 = firebase.auth().currentUser.uid;
              const key2 = this.state.buyerInfo.uid;
              // console.log(sellerInfo);
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
              this.props.navigation.navigate('Chat', {
                screen: 'ConversationScreen',
                params: {
                  user: {
                    ...this.state.buyerInfo,
                    id: id,
                    users: {
                      user1: key1,
                      user2: this.state.buyerInfo.uid,
                    },
                  },
                  height: 103,
                },
              });
            }}
          />
        </View>
        {this.state.data.paid && !this.state.data.complete && this.ShowButton()}
        {this.ShowModal()}
      </SafeAreaView>
    );
  }
}
