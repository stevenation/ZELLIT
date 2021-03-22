import {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {Component} from 'react';
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

export default class Buying extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      bought: false,
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
          if (child.val().buyerId === this.state.id) {
            console.log(child.val().complete);
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
        {this.state.pending && this.Show(this.state.pendingData)}
        {this.state.bought && this.Show(this.state.completeData)}
      </SafeAreaView>
    );
  }
}
