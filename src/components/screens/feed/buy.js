import React from "react";
import {Image, SafeAreaView, Text, View} from 'react-native';
import {Button, Input} from "react-native-elements";
import database from "@react-native-firebase/database";
import {firebase} from "@react-native-firebase/auth";

export default function Buy(item) {
    const itemData = item.route.params.itemsData
    const key1 = firebase.auth().currentUser.uid
    const key2 = itemData.sellerUid
    const users = {user1: key1, user2: key2}

    async function buyItem() {
        const handleSend = (uid1, uid2) => {
            const date = new Date()
            var key = uid1 + "_" + uid2
            const text = "Hey is this available?"
            time = database.ServerValue.TIMESTAMP

            database()
                .ref(`chatMessages/${key}/${date.getTime()}`)
                .set({
                    _id: uid1 + uid2 + date.getTime(),
                    createdAt: time,
                    image: itemData.img_url,
                    text: text,
                    user: {
                        _id: uid1
                    }
                })
            database().ref(`chats/${key}`)
                .set({
                    lastMessage: text,
                    lastSent: time,
                    users: users,
                })
        }
        if (database()
            .ref(`chatMessages/${key1 + "_" + key2}`) === null) {
            if (database()
                .ref(`chatMessages/${key2 + "_" + key1}`) == null) {
                handleSend(key1, key2)
            } else {
                handleSend(key2, key1)
            }
        } else {
            handleSend(key1, key2)
        }
    }

    return (
        <SafeAreaView>
            <View style={{flexDirection: "row", justifyContent: "space-evenly", padding: 10}}>
                <Image style={{height: 100, width: 100}}
                       source={{uri: itemData.path ? itemData.path : null}}/>
                <View>
                    <Text style={{fontWeight: "700", fontSize: 20}}>{itemData.sellerName}</Text>
                    <Text>{itemData.name}</Text>

                </View>

            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between", padding: 5}}>
                <Text style={{fontWeight: "700", fontSize: 20}}>You Pay</Text>
                <Text style={{fontWeight: "700", fontSize: 20}}>${itemData.price}</Text>
            </View>

            <Input containerStyle={{height: 100}} multiline={true} placeholder={"write a message to the seller"}/>

            <Button onPress={() => {
                console.log(item.route.params.sellerInfo.uid, firebase.auth().currentUser.uid)
                if (item.route.params.sellerInfo.uid!==firebase.auth().currentUser.uid){
                buyItem()
                item.navigation.navigate("Chat", {
                    screen: "conversationScreen",
                    params: {user: item.route.params.sellerInfo, height: item.route.params.height}
                })}else {
                    alert("Cannot buy your own item")
                }
            }} title={"Confirm Buy"} style={{width: 150, alignSelf: "center"}}/>
        </SafeAreaView>
    );
}
