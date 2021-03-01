import React from 'react'

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Feed from "../components/screens/feed";
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Chat from "../components/screens/chat";
import {COLORS} from "../constants";
import Profile from "../components/screens/profile";
import Add from "../components/screens/add";


const Tab = createBottomTabNavigator()


export default function TabNavigator() {
    return (
        <Tab.Navigator tabBarOptions={{
            tabStyle: {
                backgroundColor: COLORS.white
            },

            inactiveTintColor: COLORS.black,
            activeTintColor: COLORS.blue //rgb(33,137,221)
        }}>
            <Tab.Screen
                name={"Feed"}
                component={Feed}
                options={{

                    tabBarIcon: ({color}) => (

                        <Entypo
                            name={'home'}
                            size={25}
                            color={color}/>
                        // tabBarBadge: 3
                    ),
                    // tabBarBadge: 3
                }}/>
            <Tab.Screen
                name={"Add"}
                component={Add} options={{
                tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons
                        name={'plus'}
                        size={30}
                        color={color}/>
                )
            }}/>
            <Tab.Screen
                name={"Chat"}
                component={Chat}
                options={{
                    tabBarIcon: ({color}) => (
                        <MaterialCommunityIcons
                            name={'message-minus-outline'}
                            size={25}
                            color={color}/>
                    ),
                    
                    // tabBarBadge: 53
                }}/>
            <Tab.Screen
                name={"Profile"}
                component={Profile}
                options={{
                    tabBarIcon: ({color}) => (
                        <Ionicons
                            name={'person-outline'}
                            size={25}
                            color={color}/>
                    )

                }}/>
        </Tab.Navigator>
    )
}
// component={()=><View><Text>Profile</Text></View>}
