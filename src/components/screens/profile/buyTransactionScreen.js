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
import FastImage from 'react-native-fast-image';
import {Rating} from 'react-native-ratings';

export default class BuyTransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.route.params.data,
      showModal: false,
      id: props.route.params.data.transID,
      sellerInfo: null,
      paid: false,
      rated: false,
      s_rated: false,
      complete: false,
      showRating: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.GetSellerInfo();
    this.Unsubscribe();

    database()
      .ref(`transactions/${this.state.data.transID}`)
      .on('value', (snp) => {
        var data = snp.val();

        if (data.paid && data.complete && !data.b_rated && data.s_rated) {
          this.setState({showRating: true});
        }
      });
  }
  updateRating() {
    let total = this.state.sellerInfo.rating_total + this.state.rating;
    let count = this.state.sellerInfo.rating_count + 1;
    database().ref(`/Users/${this.state.data.sellerId}`).update({
      rating_total: total,
      rating_count: count,
    });

    database()
      .ref(`transactions/${this.state.data.transID}`)
      .update({b_rated: true});
  }

  Unsubscribe() {
    database()
      .ref(`transactions/${this.state.data.transID}`)
      .on('child_changed', (snapshot) => {
        if (snapshot.key === 'paid') {
          this.setState({paid: snapshot.val()});
        }
        if (snapshot.key === 'complete') {
          this.setState({complete: snapshot.val()});
        }
        if (snapshot.key === 'b_rated') {
          this.setState({rated: snapshot.val()});
        }
        if (snapshot.key === 's_rated') {
          this.setState({s_rated: snapshot.val()});
        }
      });
  }

  // UNSAFE_componentWillUpdate() {
  //   // this.Unsubscribe();

  //   if (
  //     this.state.paid &&
  //     this.state.complete &&
  //     this.state.s_rated &&
  //     !this.state.rated
  //   ) {
  //     this.setState({showRating: true});
  //   }
  // }
  componentWillUnmount() {}

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
  ratingCompleted(rating) {
    this.setState({rating: rating});
  }

  showRating() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showRating}
        onRequestClose={() => {
          console.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Rate your transaction with the seller
            </Text>

            <Rating
              fractions={1}
              showRating={true}
              startingValue={this.state.rating}
              onFinishRating={(rating) => this.ratingCompleted(rating)}
            />
            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  this.updateRating();
                  this.setState({showRating: false});
                }}>
                <Text style={styles.textStyle}>OK</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  this.setState({rating: 0});
                  this.setState({showRating: false});
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    );
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
        <FastImage
          style={{width: Dimensions.get('screen').width, height: 100}}
          source={{
            uri: this.state.data.img_url,
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
        {this.ShowModal()}
        {this.showRating()}
      </SafeAreaView>
    );
  }
}
