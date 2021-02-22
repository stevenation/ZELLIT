import React from 'react'
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from 'react-native'
import {categories} from './index'
import {styles} from "./styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {COLORS} from "../../../constants";
import AntDesign from "react-native-vector-icons/AntDesign";
import {FlatGrid} from "react-native-super-grid";
// import images from "../../../../../src/constants/images";
import ItemCell from "./itemCell";

export default function CategoryScreen(itemsData) {
    const data = itemsData.route.params.itemsData
    const catName = itemsData.route.params.name

    var itemData = []
    data.forEach((item) => {
        console.log(item.category)
        if (catName === "School" && ['Stationery', 'Textbooks'].includes(item.category)) {
            itemData.push(item)
        } else if (catName==="Electronics" && item.category === catName) {
            itemData.push(item)
        }else if (catName==="Transport" &&  item.category===catName){
            itemData.push(item)
        }else if (catName==="Women" &&  item.category===catName){
            itemData.push(item)
        }else if (catName==="Men" &&  item.category===catName){
            itemData.push(item)
        }else if (catName==="Other" &&  item.category===catName){
            itemData.push(item)
        }

    })

    console.log("data: ", itemData)
    return (
        <SafeAreaView>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>

                <View>
                    <TouchableOpacity onPress={() => itemsData.navigation.navigate("Feed")}>
                        <AntDesign name={'left'} size={25} style={{color: COLORS.blue}}/>
                    </TouchableOpacity>
                </View>
                <View style={{paddingRight: 10}}>
                    <Text style={{...styles.collegeName}}>{catName}</Text>
                </View>
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

            <FlatGrid
                itemDimension={125}
                data={itemData}
                renderItem={({item}) => (
                    <ItemCell itemData={item} navigation={itemsData}/>
                )}/>


        </SafeAreaView>
    )
}
