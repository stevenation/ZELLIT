import React from 'react'
import {FlatList, SafeAreaView} from 'react-native'
import ChatCell from "./chatCell";
import database from "@react-native-firebase/database"
import {firebase} from "@react-native-firebase/auth";
import {COLORS} from "../../../constants";
import * as FileSystem from "expo-file-system";
import storage from "@react-native-firebase/storage"

const r = {
    "dNJmTaWKkrhmHiKxlTVGChT1UPp1_joYpScOIycN7cUSLoWYVzQZguv82": {
        "id": "vjvdjskdvjksd",
        "lastMessage": "Hey is this available?",
        "lastSent": 1615777893999,
        "users": [Object]
    },
    "xUv7B6inpka6gDoYBWD84JDCq7q1_joYpScOIycN7cUSLoWYVzQZguv82": {
        "id": "hjkasdhjkds",
        "lastMessage": "Lies",
        "lastSent": 1615780243553,
        "users": [Object]
    }
}


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
    }]


export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            userId: firebase.auth().currentUser.uid
        }
    }

    UNSAFE_componentWillMount() {
        this.unsubscribe()
        this.cacheProfilePictures()

    }
    componentDidMount() {
        this.unsubscribe()

    }

    async cacheProfilePictures() {
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
            .then(result => {
                result.items.forEach(async ref => {
                    const image = await FileSystem.getInfoAsync(`${path}${ref.name}`)
                    if (!image.exists) {

                        ref
                            .getDownloadURL()
                            .then(async (uri) => {
                                try {
                                    await FileSystem.downloadAsync(uri, `${path}${ref.name}`)
                                } catch (error) {
                                    console.log(error)
                                }

                            })
                    }
                })
            })
    }

    async unsubscribe() {
        await database()
            .ref("chats")
            .on("value", async (snapshot) => {
                var b = []
                // if (typeof (snapshot.val()) !== 'undefined') {
                // if (snapshot.val() !== "")
                snapshot.forEach(async (child) => {
                    // console.log("chiiiiiiid",
                    //
                    // child.val())
                    const chat = {...child.val(), id: child.key}
                    await b.push(chat)
                    if (child.val().users.user1 === this.state.userId ||
                        child.val().users.user2 === this.state.userId) {
                        this.setState({chats: b})
                    }
                })


            })
    }


    render() {
        return (
            <SafeAreaView style={{backgroundColor: COLORS.white}}>
                <FlatList data={this.state.chats} renderItem={({item}) => (
                    <ChatCell user={item} height={103} navigation={this.props.navigation}/>
                )}/>
            </SafeAreaView>
        )
    }
}
