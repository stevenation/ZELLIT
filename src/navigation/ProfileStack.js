import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '../components/screens/profile/index';
import Buying from '../components/screens/profile/buying';
import BuyPending from '../components/screens/profile/buyPending';
import BuyTransactionScreen from '../components/screens/profile/buyTransactionScreen';
import SellTransactionScreen from '../components/screens/profile/sellTransactionScreen';
import Selling from '../components/screens/profile/selling';
import CachedImageExample from '../components/screens/profile/cacheImageTest';
import {COLORS} from '../constants';
import EditProfile from '../components/screens/profile/editProfile';

const Stack = createStackNavigator();

export function ProfileScreen() {
  return (
    <Stack.Navigator
      initialRouteName={'Profile'}
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: COLORS.white},
      }}>
      <Stack.Screen
        name={'Selling'}
        component={Selling}
        options={{
          headerShown: true,
          headerBackTitle: ' ',
        }}
      />
      <Stack.Screen
        name={'Buying'}
        component={Buying}
        options={{
          headerShown: true,
          headerBackTitle: ' ',
        }}
      />
      <Stack.Screen name={'Profile'} component={Profile} />
      <Stack.Screen
        name={'BuyTransactionScreen'}
        component={BuyTransactionScreen}
        options={{
          headerShown: true,
          headerBackTitle: ' ',
          headerTitle: 'Buying',
        }}
      />
      <Stack.Screen
        name={'CachedImageExample'}
        component={CachedImageExample}
        options={{
          headerShown: true,
          headerBackTitle: ' ',
          headerTitle: 'Cache',
        }}
      />

      <Stack.Screen
        name={'SellTransactionScreen'}
        component={SellTransactionScreen}
        options={{
          headerShown: true,
          headerBackTitle: ' ',
          headerTitle: 'Selling',
        }}
      />
      <Stack.Screen
        name={'EditProfile'}
        component={EditProfile}
        options={{
          headerShown: true,
          headerBackTitle: ' ',
          headerTitle: 'Edit Profile',
        }}
      />
    </Stack.Navigator>
  );
}

export default function ProfileStack() {
  return <ProfileScreen />;
}
