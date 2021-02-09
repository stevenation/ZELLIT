import React, {useEffect, useState} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {Shadow} from "react-native-neomorph-shadows";
import {styles} from "./styles";
import {Image} from "react-native-elements";
import {COLORS} from "../../../constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function ItemCell() {
    const [like, setLike] = useState(false)
    const [likeColor, setLikeColor] = useState(COLORS.gray)

    useEffect(()=>{
        like === true? setLikeColor(COLORS.orange): setLikeColor(COLORS.gray)

        },[like]

    )
    return (
        <View style={styles.cellContainer}>
            <Shadow style={styles.cell}>
                <TouchableOpacity>
                    <Image borderTopLeftRadius={25} borderTopRightRadius={25} style={styles.cellImage} source={require("../../../../src/components/screens/feed/a.png")}/>

                </TouchableOpacity>
                <View style={styles.infoContainer}>
                    <View>
                        <Text style={styles.itemName}>Samsung S20</Text>
                        <Text style={styles.itemPrice}>$950.00</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{
                        setLike(!like)
                    }}>
                        <MaterialCommunityIcons name={'heart'} size={30}  color={likeColor}/>
                    </TouchableOpacity>

                </View>
            </Shadow>
        </View>
    )
}

