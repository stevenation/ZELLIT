import React from 'react'
import {FlatList, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from 'react-native'
import {SearchBar} from "react-native-elements";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {styles} from "./styles";
import {COLORS} from "../../../constants";
import ItemCell from "./itemCell";
// import images from "../../../../../src/constants/images";

// const img = require('../../../../src/components/screens/feed/1.png')
const categories = [
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

export default function Feed() {

    return (
        <View>
            <StatusBar barStyle={"dark-content"}/>
            <SafeAreaView>
                <Text style={styles.collegeName}>Wartburg College</Text>
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
                        <TouchableOpacity style={styles.categoryItem}>
                            <View style={styles.catBackground}>
                                <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.white}/>
                            </View>
                            <Text numberOfLines={1}>{item.name}</Text>
                        </TouchableOpacity>
                    )}/>

                <ScrollView>
                    <View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Electronics</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>See all</Text>
                            </TouchableOpacity>

                        </View>

                        <FlatList horizontal={true} data={categories} renderItem={({item}) => (
                            <ItemCell/>
                        )}/>

                    </View>
                    <View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Stationary</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList horizontal={true} data={categories} renderItem={({item}) => (
                            <ItemCell/>
                        )}/>
                    </View>

                    <View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Textbooks</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList horizontal={true} data={categories} renderItem={({item}) => (
                            <ItemCell/>
                        )}/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}
