import React, {useContext, useEffect, useState} from 'react'
import {FlatList, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from 'react-native'
import {SearchBar} from "react-native-elements";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {styles} from "./styles";
import {COLORS} from "../../../constants";
import ItemCell from "./itemCell";
import database from "@react-native-firebase/database";
import {firebase} from "@react-native-firebase/auth";
import {AuthContext} from "../../../navigation/AuthProvider";

export const categories = [
    {
        id: '1',
        name: "School",
        icon: "school"
    },
    {
        id: '2',
        name: "Home",
        icon: "sofa"
    },
    {
        id: '3',
        name: "Electronics",
        icon: "laptop"
    },
    {
        id: '4',
        name: "Women",
        icon: "human-female"
    },
    {
        id: '5',
        name: "Men",
        icon: "human-male"
    },
    {
        id: '6',
        name: "Transportation",
        icon: "bicycle"
    },
    {
        id: '7',
        name: "other",
        icon: "infinity"
    }
]

export default function Feed({navigation}) {
    const userId = firebase.auth().currentUser.uid
    const [userData, setUserData] = useState('')
    const [itemsData, setItemsData] = useState('')
    const date = new Date()

    function getUserData() {
        database().ref(`Users/${userId}`)
            .on('value', snapshot => {
                setUserData(snapshot.val())
                database().ref(`${snapshot.val()['college']}/Items`)
                    .on('value', snp => {
                        var lst = []
                        snp.forEach((child => {
                            var item = child.val()
                            lst.push({
                                key: child.key,
                                name: item.name,
                                price: item.price,
                                uid: item.uid,
                                condition: item.condition,
                                brand: item.brand,
                                description: item.description,
                                img_url: item.img_url,
                                category: item.category,
                                payment_method: item.payment_method
                            })
                        }))
                        setItemsData(lst)
                    })
            })
    }

    function addItem() {
        database().ref(`${userData['college']}/Items/${userData['uid']}${date.toTimeString()}`)
            .set({
                name: "Eraser",
                price: "$2",
                brand:"Staedler",
                description: "Latex Free",
                condition: "New",
                category: "Stationery",
                payment_method: "Cash App",
                img_url: "https://firebasestorage.googleapis.com/v0/b/flash-chat-ios-13-7845d.appspot.com/o/images%2Fitems%2FScreen%20Shot%202021-02-22%20at%2010.25.44%20AM.png?alt=media&token=5d12ac68-6291-4747-8b18-d5b4b7837f27",
                uid: "joYpScOIycN7cUSLoWYVzQZguv82"
            })
    }

    function capitalize(str) {
        return str.replace(/\w\S*/g, (w) =>
            (w.replace(/^\w/, (c) =>
                c.toUpperCase())))
    }

    useEffect(() => {
        getUserData()
    }, []);


    return (
        <View>
            <StatusBar barStyle={"dark-content"}/>
            <SafeAreaView>

                <Text style={styles.collegeName}>{userData.college}</Text>
                {/*<TouchableOpacity onPress={() => logout()}>*/}
                {/*    <Text>-</Text>*/}
                {/*</TouchableOpacity>*/}
                <View>
                    <SearchBar
                        searchIcon={{size: 24}}
                        containerStyle={{backgroundColor: COLORS.white, borderTopWidth: 0}}
                        round={true}
                        lightTheme={true}
                        placeholder={"search item"}
                    />
                </View>
                <FlatList
                    horizontal={true}
                    data={categories}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={()=>navigation.navigate('categoryScreen', {itemsData:itemsData, name:item.name})} style={styles.categoryItem}>
                            <View style={styles.catBackground}>
                                <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.white}/>
                            </View>
                            <Text numberOfLines={1}>{item.name}</Text>
                        </TouchableOpacity>
                    )}/>

                <ScrollView style={{maxHeight: 600}}>
                    <View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Recent</Text>
                            <TouchableOpacity onPress={()=>navigation.navigate('categoryScreen', {itemsData:itemsData})}>
                                <Text style={styles.seeAll}>See all</Text>
                            </TouchableOpacity>

                        </View>

                        <FlatList horizontal={true} data={itemsData} renderItem={({item}) => (
                            <ItemCell itemData={item} navigation={navigation}/>
                        )}/>

                    </View>
                    <View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Electronics</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>See all</Text>
                            </TouchableOpacity>

                        </View>

                        <FlatList horizontal={true} data={itemsData} renderItem={({item}) => {
                            if (item.category === "Electronics") {
                                return (<ItemCell itemData={item} navigation={navigation}/>)
                            }
                        }}/>
                    </View>
                    <View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Stationery</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList horizontal={true} data={itemsData} renderItem={({item}) => {
                            // console.log(item.category)
                            if (item.category === "Stationery") {
                                return (<ItemCell itemData={item} navigation={navigation}/>)
                            }

                        }}/>
                    </View>

                    <View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Textbooks</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList horizontal={true} data={itemsData} renderItem={({item}) => {
                            if (item.category === "Textbooks") {
                                return (<ItemCell itemData={item} navigation={navigation}/>)
                            }

                        }}/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}
