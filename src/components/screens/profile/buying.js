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

const buyingD = [
  {
    id: '1',
    itemName: 'Piano',
    sellerName: 'Jon Doe',
    progress: 'Not Paid',
    state: 'buy',
  },
  {
    id: '2',
    itemName: 'Key Board',
    sellerName: 'Johnny',
    progress: 'Complete',
    state: 'buy',
  },
  {
    id: '3',
    itemName: 'Piano',
    sellerName: 'Jon Doe',
    progress: 'Not Paid',
    state: 'buy',
  },
  {id: '4', itemName: 'Piano', sellerName: 'Dan Loe', progress: 'Not Paid'},
  {id: '5', itemName: 'Piano', sellerName: 'Zeph Sam', progress: 'Not Paid'},
  {id: '6', itemName: 'Piano', sellerName: 'Jon Doe', progress: 'Not Paid'},
  {id: '7', itemName: 'Piano', sellerName: 'Jon Doe', progress: 'Not Paid'},
  {id: '8', itemName: 'Piano', sellerName: 'Jon Doe', progress: 'Not Paid'},
];
const sellingD = [
  {
    id: '1',
    itemName: 'Piano hjvh',
    sellerName: 'Jon jh Doe',
    progress: 'Not Paid',
  },
  {
    id: '2',
    itemName: 'Key Board hjh',
    sellerName: 'Jon hhj Doe',
    progress: 'Complete',
  },
  {
    id: '7',
    itemName: 'Piano hkk',
    sellerName: 'Jon hkh Doe',
    progress: 'Not Paid',
  },
  {
    id: '8',
    itemName: 'Piano jhjh',
    sellerName: 'Jon jhjjj Doe',
    progress: 'Not Paid',
  },
];

export default class Buying extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      bought: false,
      data: [],
      id: firebase.auth().currentUser.uid,
    };
  }

  loadData() {
    database()
      .ref('transactions')
      .on('value', (snapshot) => {
        var b = [];
        snapshot.forEach((child) => {
          if (child.val().buyerId === this.state.id) {
            b.push(child.val());
            this.setState({data: b});
          }
        });
      });
  }

  Show(data) {
    return (
      <FlatList
        data={data}
        renderItem={({item}) => (
          <TransactionCell
            data={{...item, state: 'buy'}}
            navigation={this.props.navigation}
          />
        )}
      />
    );
  }

  UNSAFE_componentWillMount() {
    this.loadData();
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
              this.setState({bought: false});
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
              backgroundColor: this.state.bought ? COLORS.blue : COLORS.white,
            }}
            onPress={() => {
              this.setState({pending: false});
              this.setState({bought: true});
            }}>
            <Text
              style={{
                ...styles.stateText,
                color: this.state.bought ? COLORS.white : COLORS.black,
              }}>
              Bought
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.pending && this.Show(this.state.data)}
        {this.state.bought && this.Show(this.state.data)}
      </SafeAreaView>
    );
  }
}
