import database from '@react-native-firebase/database';
import React, {Component} from 'react';
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
    };
  }

  UNSAFE_componentWillMount() {
    // database().ref(`transactions/${}`)
    console.log(this.props.route.params.data);
    database().ref();
  }
  AllowConfirm() {
    return (
      <Button
        title={'Confirm Payment'}
        titleStyle={styles.confirm.TitleStyle}
        buttonStyle={styles.confirm.buttonStyle}
        style={styles.confirm.style}
      />
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
        {this.state.showConfirm && this.AllowConfirm()}
      </SafeAreaView>
    );
  }
}
