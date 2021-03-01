import React, {useContext} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {AuthContext} from "../../../navigation/AuthProvider";

export default function Profile() {
    const {logout} = useContext(AuthContext)

    return (
        <SafeAreaView>
            <Text style={{fontSize:30}}>Profile</Text>
            <TouchableOpacity onPress={() => {
                logout()
            }}>
                <Text>Log Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
