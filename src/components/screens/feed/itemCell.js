import React, {useEffect, useState} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {Shadow} from "react-native-neomorph-shadows";
import {styles} from "./styles";
import {Image} from "react-native-elements";
import {COLORS} from "../../../constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import storage from '@react-native-firebase/storage';


export default function ItemCell({itemData, navigation}) {
    const [like, setLike] = useState(false)
    const [likeColor, setLikeColor] = useState(COLORS.gray)
    const [imgUrl, setImageUrl] = useState('')


    useEffect(() => {
            like === true ? setLikeColor(COLORS.orange) : setLikeColor(COLORS.gray)
            storage()
                .ref('/images/items/5.png')
                .getDownloadURL()
                .then(function (url) {
                    setImageUrl(url)
                    console.log(imgUrl)
                }, function (error) {
                    console.log(error);
                })

        }, [like]
    )
    return (
        <View style={styles.cellContainer}>
            <Shadow style={styles.cell}>
                <TouchableOpacity onPress={() => navigation.navigate('ItemScreen', {itemData: itemData, url: imgUrl})}>
                    <Image resizeMode={"center"}
                           borderTopLeftRadius={25}
                           borderTopRightRadius={25}
                           style={styles.cellImage}
                           source={{uri: itemData.img_url ? itemData.img_url : null}}/>


                </TouchableOpacity>
                <View style={styles.infoContainer}>
                    <View>
                        <Text style={styles.itemName}>{itemData['name']}</Text>
                        <Text style={styles.itemPrice}>{itemData['price']}</Text>
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

