import React from 'react';
import TabNavigator from '../../../navigation/TabNavigator';
import {createStackNavigator} from '@react-navigation/stack';
import ItemScreen from '../feed/itemScreen';
import CategoryScreen from '../feed/categoryScreen';
import addConfirm from '../add/addConfirm';
import SeeAll from '../feed/seeAll';
import Buy from '../feed/buy';
import ShowProfile from '../feed/showProfile';

const Stack = createStackNavigator();

export default function HomeScreen() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Feed'} component={TabNavigator} />
      <Stack.Screen
        name={'Listing Details'}
        options={{headerShown: true}}
        component={ItemScreen}
      />
      <Stack.Screen name={'categoryScreen'} component={CategoryScreen} />
      <Stack.Screen name={'AddConfirm'} component={addConfirm} />
      <Stack.Screen name={'SeeAll'} component={SeeAll} />
      <Stack.Screen
        name={'Buy'}
        options={{headerShown: true, headerBackTitle: ' '}}
        component={Buy}
      />
      <Stack.Screen
        options={{headerShown: true, headerBackTitle: ' '}}
        name={'ShowProfile'}
        component={ShowProfile}
      />
    </Stack.Navigator>
  );
}
