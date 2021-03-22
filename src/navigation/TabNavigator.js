import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Feed from '../components/screens/feed';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../constants';
import AddStack from './AddStack';
import ChatStack from './ChatStack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/core';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        tabStyle: {
          backgroundColor: COLORS.white,
        },

        inactiveTintColor: COLORS.black,
        activeTintColor: COLORS.blue, //rgb(33,137,221)
      }}>
      <Tab.Screen
        name={'Feed'}
        component={Feed}
        options={{
          tabBarIcon: ({color}) => (
            <Entypo name={'home'} size={25} color={color} />
            // tabBarBadge: 3
          ),
          // tabBarBadge: 3
        }}
      />
      <Tab.Screen
        name={'Add'}
        component={AddStack}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name={'plus'} size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={'Chat'}
        component={ChatStack}
        options={({route}) => ({
          tabBarVisible: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            if (routeName === 'ConversationScreen') {
              return false;
            }
            return true;
          })(route),
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name={'message-minus-outline'}
              size={25}
              color={color}
            />
          ),
        })}
      />
      <Tab.Screen
        name={'Profile'}
        component={ProfileStack}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name={'person-outline'} size={25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
// component={()=><View><Text>Profile</Text></View>}
