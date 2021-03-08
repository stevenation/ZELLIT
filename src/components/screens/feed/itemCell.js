import React, {useEffect, useState} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {Shadow} from "react-native-neomorph-shadows";
import {styles} from "./styles";
import {Image} from "react-native-elements";
import {COLORS} from "../../../constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import storage from '@react-native-firebase/storage';

export default function ItemCell({itemData, navigation}) {
    // console.log("item dfgsasjash\n\n\n\n\n\n\n\n\n\n\n")
    // console.log(itemData)
    // const itemsData = {"brand": undefined,
    //     "category": "Stationery",
    //     "condition": "New",
    //     "description": "Never used",
    //     "img_url": "https://firebasestorage.googleapis.com/v0/b/flash-chat-ios-13-7845d.appspot.com/o/images%2Fitems%2F5.png?alt=media&token=a47ce64e-c9a4-45da-85a5-6f57bffd5add",
    //     "key": "xUv7B6inpka6gDoYBWD84JDCq7q116:15:16 GMT-0600 (CST)",
    //     "name": "Pencils",
    //     "path": "file:///Users/stevenation/Library/Developer/CoreSimulator/Devices/3CFFF06A-1E2B-450F-9ED7-11672409D7DE/data/Containers/Data/Application/6898B5E4-CE6B-4C22-8F84-008430140643/Library/Caches/items/item8",
    //     "payment_method": "Cash",
    //     "price": "5",
    //     "uid": "LDlUcsGpkrhy9GJpByXOBzvpKNb2"}

    const [like, setLike] = useState(false)
    const [likeColor, setLikeColor] = useState(COLORS.gray)

    useEffect(() => {
            like ? setLikeColor(COLORS.orange) : setLikeColor(COLORS.gray)
        }, []
    )
    return (
        <View style={styles.cellContainer}>
            <Shadow style={styles.cell}>
                <TouchableOpacity onPress={() => navigation.navigate('ItemScreen', {itemData: itemData})}>
                    <Image
                        borderTopLeftRadius={25}
                        borderTopRightRadius={25}
                        resizeMode={"stretch"}
                        style={styles.cellImage}
                        source={{uri: itemData.path ? itemData.path : null}}/>
                </TouchableOpacity>
                <View style={styles.infoContainer}>
                    <View>
                        <Text style={styles.itemName}>{itemData['name']}</Text>
                        <Text style={styles.itemPrice}>{"$"+`${itemData['price']}`}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setLike(!like)
                    }}>
                        <MaterialCommunityIcons name={'heart'} size={30} color={likeColor}/>
                    </TouchableOpacity>
                </View>
            </Shadow>
        </View>
    )
}

