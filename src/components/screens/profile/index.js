import React, {Component, useContext, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../../../navigation/AuthProvider';
import {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class Profile extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.uid,
      name: '',
    };
  }

  UNSAFE_componentWillMount() {
    database()
      .ref(`Users/${this.state.userId}`)
      .once('value', (snapshot) => {
        this.setState({name: snapshot.val().name});
      });
  }

  render() {
    return (
      <SafeAreaView>
        <Text style={{fontSize: 30}}>Profile</Text>
        <Text style={{fontWeight: '700', fontSize: 30}}>{this.state.name}</Text>
        <TouchableOpacity
          onPress={() => {
            this.context.logout();
          }}>
          <Text>Log Out</Text>

          <View style={{height: 50}}></View>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Buying');
            }}>
            <Text>Buying</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Selling');
            }}>
            <Text>Selling</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
