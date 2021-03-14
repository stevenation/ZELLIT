import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, SafeAreaView} from 'react-native'
import ChatCell from "./chatCell";
import database from "@react-native-firebase/database"
import {useHeaderHeight} from "@react-navigation/stack";
import {firebase} from "@react-native-firebase/auth";
import * as FileSystem from "expo-file-system";
import storage from "@react-native-firebase/storage";
import {COLORS} from "../../../constants";


const usersChats = [
    {
        id: "1",
        uid: "joYpScOIycN7cUSLoWYVzQZguv82",
        name: "Sophie Lez",
        lastTalked: "Yesterday",
        latestMessage: "I dont know",
        unread: 1
    },
    {
        id: "2",
        name: "Test Test",
        lastTalked: "12:09",
        latestMessage: "Are you coming?, We are leaving in 20 minutes",
        unread: 0
    },
    {
        id: "3",
        name: "Test Test",
        lastTalked: "12:09",
        latestMessage: "Are you coming maybe?",
        unread: 5
    },
    {
        id: "4",
        name: "Test Test",
        lastTalked: "12:09",
        latestMessage: "Are you coming?",
        unread: 0
    },
    {
        id: "5",
        name: "Sophie Lez",
        lastTalked: "Yesterday",
        latestMessage: "I dont know",
        unread: 1
    },
    {
        id: "6",
        name: "Test Test",
        lastTalked: "12:09",
        latestMessage: "Are you coming?",
        unread: 0
    },
    {
        id: "7",
        name: "Test Test",
        lastTalked: "12:09",
        latestMessage: "Are you coming?",
        unread: 0
    },
    {
        id: "8",
        name: "Test Test",
        lastTalked: "12:09",
        latestMessage: "Are you coming ",
        unread: 0
    },

]
export default function Chat({navigation}) {
    const height = useHeaderHeight()+13
    const [chats, setChats] = useState([])
    const userId = firebase.auth().currentUser.uid
    console.log(navigation)

    useEffect(() => {
    const unsubscribe = database()
        .ref(`chats`)
        .on( "value", snapshot => {
            try{
            snapshot.forEach((child) => {
                    // appendChats({...child.val(), id: child.key})
                setChats(prevState => [{...child.val(), id: child.key}])
            })}catch (e){
                console.log(e)
            }
        })
        return () =>  unsubscribe()
    }, [])

    async function cacheProfilePictures(){
        const folder_info = await FileSystem.getInfoAsync(`${FileSystem.cacheDirectory}profileprictures`)
        if (!folder_info.exists) {
            try {
                await FileSystem.makeDirectoryAsync(`${FileSystem.cacheDirectory}profilepictures`)
            } catch (error) {
                console.log(error)
            }
        }
        const path = `${FileSystem.cacheDirectory}profilepictures/`
        storage().ref('images/profile_pictures')
            .list()
            .then(result=>{
                result.items.forEach(async ref=>{
                    const image = await FileSystem.getInfoAsync(`${path}${ref.name}`)
                    if (!image.exists) {

                        ref
                            .getDownloadURL()
                            .then(async (uri)=>{
                                try {
                                    console.log("downloading")
                                    await FileSystem.downloadAsync(uri, `${path}${ref.name}`)
                                } catch (error) {
                                    console.log(error)
                                }

                            })
                    }
                })
            })
    }
    cacheProfilePictures()


    const appendChats = (
        (chats) => {
            setChats((previousChats) => [...previousChats,chats])
        }

    )

    return (
        <SafeAreaView style={{backgroundColor:COLORS.white}}>
            <FlatList data={chats} renderItem={({item}) => (
                <ChatCell user={item} height={height} navigation={navigation}/>
            )}/>
        </SafeAreaView>
    )

}
