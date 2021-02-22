import React from 'react'
import TabNavigator from "../../../navigation/TabNavigator";
import {createStackNavigator} from "@react-navigation/stack";
import ItemScreen from "../feed/itemScreen";


const Stack = createStackNavigator()

export default function HomeScreen() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={'Home'} component={TabNavigator}/>
            <Stack.Screen name={'ItemScreen'} component={ItemScreen}/>
            {/*<Stack.Screen name={'Chat'} component={Chat}/>*/}
        </Stack.Navigator>
    )
}
