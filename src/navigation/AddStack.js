import React from 'react'
import {createStackNavigator} from "@react-navigation/stack";
import AddConfirm from "../components/screens/add/addConfirm";
import Add from "../components/screens/add";

const Stack = createStackNavigator()


export function AddScreen() {
    return (
        <Stack.Navigator initialRouteName={'Add'} screenOptions={{headerShown: false}}>
            <Stack.Screen name={'Add'} component={Add}/>
            <Stack.Screen name={'AddConfirm'} component={AddConfirm}/>
        </Stack.Navigator>
    )
}

export default function AddStack() {
    return (
        <AddScreen/>
    )
}
