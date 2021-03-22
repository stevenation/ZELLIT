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
import { firebase } from '@react-native-firebase/auth';

export default class BuyTransactionScreen extends Component {
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
    this.GetSellerInfo();
  }

  UNSAFE_componentWillUpdate() {
    database()
      .ref(`transactions/${this.state.data.transID}`)
      .on('child_changed', (snapshot) => {
        if (snapshot.val()) {
          this.setState({data: {...this.state.data, paid: true}});
        }
      });
  }

  ShowButton() {
    return (
      <>
        <Text style={{paddingBottom: 10}}>
          Once You Have Paid Confirm The Payment Below
        </Text>
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
  // ShowPaid() {
  //   console.log('paid:', this.state.data.paid);
  //   this.state.data.paid && !this.state.data.complete ?
  //   return (
  //     <Button
  //       title={'Paid'}
  //       titleStyle={styles.confirmTitleStyle}
  //       buttonStyle={{
  //         ...styles.confirmButtonStyle,
  //         backgroundColor: COLORS.green,
  //       }}
  //       style={styles.confirmStyle}
  //     />
  //   );
  // }
  UpdateTransaction() {
    database().ref(`transactions/${this.state.id}`).update({paid: true});
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
              Click ok to Confirm or Cancel to close
            </Text>

            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  this.UpdateTransaction();
                  this.setState({showModal: false});
                  this.setState({data: {...this.state.data, paid: true}});
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
  GetSellerInfo() {
    database()
      .ref(`Users/${this.state.data.sellerId}`)
      .once('value')
      .then((snapshot) => {
        this.setState({sellerInfo: snapshot.val()});
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
              ? 'Waiting For Seller Confirmation'
              : this.state.data.paid && this.state.data.complete
              ? 'Bought'
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
              {this.state.data.sellerName}
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
              const key2 = this.state.sellerInfo.uid;
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
                    ...this.state.sellerInfo,
                    id: id,
                    users: {
                      user1: key1,
                      user2: this.state.sellerInfo.uid,
                    },
                  },
                  height: 103,
                },
              });
            }}
          />
        </View>

        {!this.state.data.paid && this.ShowButton()}
        {/* {this.state.data.paid && this.ShowPaid()} */}
        {this.ShowModal()}
      </SafeAreaView>
    );
  }
}
