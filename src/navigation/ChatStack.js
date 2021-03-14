import React, {useEffect, useState} from 'react'
import {createStackNavigator} from "@react-navigation/stack";
import ConversationScreen from "../components/screens/chat/conversationScreen";
import Chat from "../components/screens/chat";
import {Image, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {COLORS} from "../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import database from "@react-native-firebase/database"

const Stack = createStackNavigator()


export function ChatScreen() {
    const [state,setState]= useState()
    const [date,setDate]= useState()

    function showProfile(profile, path) {
        if (profile === "default") {
            return (
                <View style={{width: 50, height: 45}}>
                    <Ionicons name={"person-circle-sharp"} size={45} color={COLORS.lightGray}/>
                </View>
            )
        } else {
            return (
                <View style={{width: 50, height: 45}}>
                    <Image
                        source={{uri: path}}
                        style={
                            {
                                width: 45,
                                height: 45,
                                borderRadius: 25,
                                paddingHorizontal: 5
                            }}/>
                </View>
            )
        }
    }
    // useEffect(()=>{

        function onlineStatus(userId) {
            database()
                .ref(`status/${userId}`)
                .on('value', snapshot => {
                    if (snapshot.val().state === "online"){
                        setState("online")
                    }else{
                        setState(snapshot.val().state)
                        const lastChanged = new Date(snapshot.val().last_changed).toTimeString().slice(0,5)
                        setDate(lastChanged)
                    }
                })
        }
    // })

    function setStatus(name, userId) {
        onlineStatus(userId)
        if (state === "online") {
            return (
                <View style={{alignItems: "center"}}>
                    <Text
                        style={{fontWeight: "600", fontSize: 20}}>{name}</Text>
                    <Text>Online</Text>
                </View>
            )
        } else {
            return (
                <View style={{alignItems: "center"}}>
                    <Text
                        style={{fontWeight: "600", fontSize: 20}}>{name}</Text>
                    <Text>last seen {date}</Text>
                </View>
            )
        }
    }

    return (
        <Stack.Navigator initialRouteName={'Chats'}>
            <Stack.Screen name={'Chats'} component={Chat}
                          options={{
                              headerTitleStyle: {
                                  fontWeight: "700",
                                  fontSize: 30
                              },
                              cardStyle: {backgroundColor: COLORS.white},
                          }}/>
            <Stack.Screen name={'ConversationScreen'}
                          component={ConversationScreen}
                          options={({navigation, route}) => {
                              console.log(route.params.user, route.params.height )
                              return ({
                                  headerTitle: () => setStatus(route.params.user.name, route.params.user.uid),
                                  headerRight: () => showProfile(route.params.user.profile, route.params.user.path),
                                  headerStyle: {
                                      height:
                                      route.params.height
                                  },
                                  headerLeft: () => (
                                      <View>
                                          <TouchableOpacity onPress={() => navigation.goBack()}>
                                              <AntDesign name={'left'} size={25} style={{color: COLORS.blue}}/>
                                          </TouchableOpacity>
                                      </View>
                                  )
                              })
                          }}/>
        </Stack.Navigator>
    )
}
export default function ChatStack() {
    return (
        <ChatScreen/>
    )
}

// {

// }
