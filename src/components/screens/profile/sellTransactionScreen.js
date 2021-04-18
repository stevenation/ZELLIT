import database from '@react-native-firebase/database';
import React, {Component} from 'react';
import {Image, Modal, TouchableHighlight} from 'react-native';
import {View} from 'react-native';
import {SafeAreaView, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {COLORS} from '../../../constants';
import {styles} from '../profile/styles';
import {Dimensions} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import {Rating} from 'react-native-ratings';

export default class SellTransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.route.params.data,
      showModal: false,
      id: props.route.params.data.transID,
      sellerInfo: null,
      showRating: false,
      rating: 0,
      paid: false,
      complete: false,
      rated: false,
    };
  }
  UNSAFE_componentWillMount() {
    this.GetBuyerInfo();
    database()
      .ref(`transactions/${this.state.data.transID}`)
      .on('value', (snapshot) => {
        var data = snapshot.val();
        this.setState({
          paid: data.paid,
          complete: data.complete,
          rated: data.rated,
        });
      });

    this.Unsubscribe();
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
        if (snapshot.key === 's_rated') {
          this.setState({rated: snapshot.val()});
        }
      });
  }

  UNSAFE_componentWillUpdate() {
    this.Unsubscribe();
    database()
      .ref(`/Users/${this.state.data.buyerId}`)
      .once('value', (snapshot) => {
        this.setState({sellerInfo: snapshot.val()});
      });
  }
  componentWillUnmount() {
    this.state.showRating = false;
    database()
      .ref(`transactions/${this.state.data.transID}`)
      .off('value', this.Unsubscribe);
  }

  status = () => {
    if (this.state.paid && this.state.complete) {
      return 'Sold';
    } else if (this.state.paid && !this.state.complete) {
      return 'Confirm Payment';
    } else if (!this.state.paid && !this.state.complete) {
      console.log(!this.state.paid, !this.state.complete);
      return 'Waiting for payment';
    }
  };
  ConfirmPayment() {
    var s_trades = this.state.sellerInfo.trades + 1;
    console.log('strades', s_trades, this.state.sellerInfo);
    database()
      .ref(`Users/${this.state.data.sellerId}`)
      .once('value')
      .then((snp) => {
        var trades = snp.val().trades + 1;
        console.log('buyer trades', trades, this.state.data.sellerId);
        database().ref(`Users/${this.state.data.sellerId}`).update({
          trades: trades,
        });
      });
    // console.log('trades', data);

    database().ref(`transactions/${this.state.data.transID}`).update({
      complete: true,
      s_rated: true,
    });
    database().ref(`/Users/${this.state.data.buyerId}`).update({
      trades: s_trades,
    });
    if (this.state.paid && !this.state.rated) {
      this.setState({showRating: true});
    }
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
  ratingCompleted(rating) {
    this.setState({rating: rating});
  }
  updateRating() {
    let total = this.state.sellerInfo.rating_total + this.state.rating;
    let count = this.state.sellerInfo.rating_count + 1;
    database().ref(`/Users/${this.state.data.buyerId}`).update({
      rating_total: total,
      rating_count: count,
    });
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
              Rate your transaction with the buyer
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
            uri: this.state.data.img_url,
          }}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: Dimensions.get('screen').width,
            backgroundColor: this.state.complete ? COLORS.green : COLORS.blue,
          }}>
          <Text style={{fontWeight: '700', fontSize: 20, color: COLORS.white}}>
            {this.status()}
            {/* {
              // console.log(this.state.data.paid, !this.state.data.complete)
              this.state.paid && !this.state.complete
                ? 'Confirm Payment'
                : this.state.paid && this.state.complete
                ? 'Sold'
                : 'Waiting For Payment'
            } */}
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

        {this.state.paid && !this.state.complete && this.ShowButton()}
        {this.ShowModal()}

        {this.showRating()}
      </SafeAreaView>
    );
  }
}
