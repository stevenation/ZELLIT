import database from '@react-native-firebase/database';
import React, {Component} from 'react';
import {Modal, TouchableHighlight} from 'react-native';
import {View} from 'react-native';
import {SafeAreaView, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {styles} from '../profile/styles';

export default class SellTransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirm: false,
      data: props.route.params.data,
      showModal: false,
    };
  }

  UNSAFE_componentWillUpdate() {
    database()
      .ref(`transactions/${this.state.data.transID}`)
      .on('child_changed', (snapshot) => {
        this.setState({data: {...snapshot.val(), transID: snapshot.key}});
      });
  }
  ConfirmPayment() {
    database().ref(`transactions/${this.state.data.transID}`);
  }
  ShowButton() {
    return (
      <Button
        onPress={() => {
          this.setState({showModal: true});
        }}
        title={'Confirm Payment'}
        titleStyle={styles.confirmTitleStyle}
        buttonStyle={styles.confirmButtonStyle}
        style={styles.confirmStyle}
      />
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
            <Text style={styles.modalText}>Item Reported</Text>
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={() => {
                this.setState({showModal: false});
              }}>
              <Text style={styles.textStyle}>OK</Text>
            </TouchableHighlight>
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
        <Text>
          Waiting for {this.state.data.buyerName} to confirm payment.And once
          payment has been received Confirm It Below
        </Text>
        {this.state.showConfirm && this.ShowButton()}
        {this.ShowModal()}
      </SafeAreaView>
    );
  }
}
