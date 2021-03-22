import {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {Component, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from '../../../constants';
import {styles} from '../profile/styles';
import TransactionCell from './transactionCell';

export default class Selling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      sold: false,
      pendingData: [],
      completeData: [],
      id: firebase.auth().currentUser.uid,
    };
  }

  loadData() {
    database()
      .ref('transactions')
      .on('value', (snapshot) => {
        var x = [];
        var y = [];
        snapshot.forEach((child) => {
          console.log(child.val().sellerId, this.state.id);
          if (child.val().sellerId === this.state.id) {
            console.log(child.val().sellerId, this.state.id);
            if (child.val().complete) {
              x.push({...child.val(), transID: child.key});
            } else {
              y.push({...child.val(), transID: child.key});
            }
            console.log('xxwresse', x);
            this.setState({completeData: x});
            this.setState({pendingData: y});
          }
        });
      });
  }
  Show(data) {
    console.log(data);
    return (
      <FlatList
        data={data}
        renderItem={({item}) => (
          <TransactionCell
            data={{...item, state: 'sell'}}
            navigation={this.props.navigation}
          />
        )}
      />
    );
  }

  UNSAFE_componentWillMount() {
    console.log(new Date().getTime());
    this.loadData();
    console.log('pending: ', this.state.pendingData);
  }
  render() {
    return (
      <SafeAreaView>
        <View style={styles.buyingStatesContainer}>
          <TouchableOpacity
            style={{
              ...styles.stateContainer,
              backgroundColor: this.state.pending ? COLORS.blue : COLORS.white,
            }}
            onPress={() => {
              this.setState({sold: false});
              this.setState({pending: true});
            }}>
            <Text
              style={{
                ...styles.stateText,
                color: this.state.pending ? COLORS.white : COLORS.black,
              }}>
              Pending
            </Text>
          </TouchableOpacity>
          <View style={{borderRightWidth: 1, height: 40, width: 1}}></View>
          <TouchableOpacity
            style={{
              ...styles.stateContainer,
              backgroundColor: this.state.sold ? COLORS.blue : COLORS.white,
            }}
            onPress={() => {
              this.setState({pending: false});
              this.setState({sold: true});
            }}>
            <Text
              style={{
                ...styles.stateText,
                color: this.state.sold ? COLORS.white : COLORS.black,
              }}>
              Sold
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.pending && this.Show(this.state.pendingData)}
        {this.state.sold && this.Show(this.state.completeData)}
      </SafeAreaView>
    );
  }
}
