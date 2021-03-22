import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from '../components/screens/signin';
import SignUp from '../components/screens/signup';
import {COLORS} from '../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Stack = createStackNavigator();
export default function AuthStack() {
  const headerOptions = {
    title: '',
    headerBackTitle: '',
    headerTruncatedBackTitle: '',
    headerBackImage: () => (
      <AntDesign name={'left'} style={{color: 'white'}} size={30} />
    ),
    headerStyle: {backgroundColor: COLORS.blue},
  };
  return (
    <Stack.Navigator initialRouteName={'Login'}>
      <Stack.Screen
        name={'Login'}
        component={SignIn}
        options={{header: () => null}}
      />
      <Stack.Screen
        name={'SignUp'}
        component={SignUp}
        options={headerOptions}
      />
    </Stack.Navigator>
  );
}
