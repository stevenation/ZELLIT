import {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {Component, useState} from 'react';
import {Dimensions} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
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
  _isMounted = false;

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

  noItems(text) {
    return (
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          width: Dimensions.get('screen').width,
          height: 400,
          paddingTop: 5,
        }}>
        {this.state.pending ? (
          <Fontisto
            name={'shopify'}
            size={190}
            color={COLORS.blue}
            style={{padding: 10}}
          />
        ) : (
          <Fontisto
            name={'money-symbol'}
            size={200}
            color={COLORS.blue}
            style={{padding: 10}}
          />
        )}

        <Text style={{fontSize: 24, paddingTop: 20}}>{text}</Text>
      </View>
    );
  }

  loadData() {
    database()
      .ref('transactions')
      .on('value', (snapshot) => {
        var x = [];
        var y = [];
        snapshot.forEach((child) => {
          if (child.val().sellerId === this.state.id) {
            if (child.val().complete) {
              x.push({...child.val(), transID: child.key});
            } else {
              y.push({...child.val(), transID: child.key});
            }
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
    this.loadData();
  }
  componentWillUnmount() {
    database().ref('transactions').off('value', this.loadData);
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
        {!this.state.pendingData.length &&
          this.state.pending &&
          this.noItems('No items pending')}
        {!this.state.completeData.length &&
          this.state.sold &&
          this.noItems('No items sold')}
        {this.state.pending && this.Show(this.state.pendingData)}
        {this.state.sold && this.Show(this.state.completeData)}
      </SafeAreaView>
    );
  }
}
