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

export default class BuyTransactionScreen extends Component {
  constructor(props) {
    console.log('buyeeeeee', props.route.params.data);
    super(props);
    this.state = {
      data: props.route.params.data,
      showModal: false,
      id: props.route.params.data.transID,
    };
  }

  UNSAFE_componentWillUpdate() {
    database()
      .ref(`transactions/${this.state.data.transID}`)
      .on('child_changed', (snapshot) => {
        console.log('keyyyy', snapshot.key);
        if (snapshot.val()) {
          this.setState({data: {...snapshot.val(), transID: snapshot.key}});
        }
      });
  }

  ShowButton() {
    console.log('paid:', this.state.data.paid);
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
              Click ok to Confirm or Cancel to Go Back
            </Text>

            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  this.UpdateTransaction();
                  this.setState({showModal: false});
                  this.setState({paid: true});
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
        <Text style={{fontSize: 18, fontWeight: '700', paddingVertical: 10}}>
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

        {!this.state.data.paid && this.ShowButton()}
        {/* {this.state.data.paid && this.ShowPaid()} */}
        {this.ShowModal()}
      </SafeAreaView>
    );
  }
}
