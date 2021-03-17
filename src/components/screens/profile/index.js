import React, {useContext, useState} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {AuthContext} from "../../../navigation/AuthProvider";
import {firebase} from "@react-native-firebase/auth";
import database from "@react-native-firebase/database"

export default function Profile() {
    const {logout} = useContext(AuthContext)
    const userId = firebase.auth().currentUser.uid
    const [name, setName] = useState('')
    database().ref(`Users/${userId}`)
        .once("value", (snapshot)=>{
            setName(snapshot.val().name)
        })


    return (
        <SafeAreaView>
            <Text style={{fontSize:30}}>Profile</Text>
            <Text style={{fontWeight:"700", fontSize: 30}}>{name}</Text>
            <TouchableOpacity onPress={() => {
                logout()
            }}>
                <Text>Log Out</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}
