import database from '@react-native-firebase/database';
import React, {Component} from 'react';
import {Modal, TouchableHighlight} from 'react-native';
import {View} from 'react-native';
import {SafeAreaView, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {COLORS} from '../../../constants';
import {styles} from '../profile/styles';

export default class BuyTransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.route.params.data,
      showModal: false,
      paid: props.route.params.data.paid,
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
    console.log('paid:', this.state.data.paid);
    return (
      <>
        <Text>
          Once Payment Has Been Made to {this.state.data.buyerName}. Confrim It
          Below
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
  ShowPaid() {
    console.log('paid:', this.state.data.paid);
    return (
      <Button
        title={'Paid'}
        titleStyle={styles.confirmTitleStyle}
        buttonStyle={{
          ...styles.confirmButtonStyle,
          backgroundColor: COLORS.green,
        }}
        style={styles.confirmStyle}
      />
    );
  }
  UpdateTransaction() {
    database()
      .ref(`transactions/${this.state.data.transID}`)
      .update({paid: true});
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
        {!this.state.data.paid && this.ShowButton()}
        {this.state.data.paid && this.ShowPaid()}
        {this.ShowModal()}
      </SafeAreaView>
    );
  }
}
