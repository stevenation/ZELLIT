import database from '@react-native-firebase/database';
import React, {Component} from 'react';
import {Modal, TouchableHighlight} from 'react-native';
import {View} from 'react-native';
import {SafeAreaView, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {styles} from '../profile/styles';

export default class SellTransactionScreen extends Component {
  constructor(props) {
    console.log('sellerrrrrr', props.route.params.data);
    super(props);
    this.state = {
      data: props.route.params.data,
      showModal: false,
      transId: props.route.params.data.transID,
    };
  }

  UNSAFE_componentWillUpdate() {
    database()
      .ref(`transactions/${this.state.data.transID}`)
      .on('child_changed', (snapshot) => {
        if (snapshot.val()) {
          this.setState({data: {...snapshot.val(), transID: snapshot.key}});
        }
      });
  }
  ConfirmPayment() {
    database().ref(`transactions/${this.state.transId}`).update({
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
            <Text style={styles.modalText}>Item Reported</Text>
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
  render() {
    return (
      <SafeAreaView>
        {this.state.data.paid && !this.state.data.complete && this.ShowButton()}
        {this.ShowModal()}
      </SafeAreaView>
    );
  }
}
