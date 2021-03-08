import React from 'react'
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign";
import {COLORS} from "../../../constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export default function AddConfirm({navigation}) {
    return (
        <SafeAreaView>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate("Add")}>
                    <AntDesign name={'left'} size={25} style={{color: COLORS.blue}}/>
                </TouchableOpacity>
            </View>

            <MaterialCommunityIcons name={"check-box-multiple-outline"}
                                    size={200}
                                    style={{color: COLORS.blue, alignSelf: "center"}}/>

            <Text style={{alignSelf: "center", fontWeight: "700", fontSize: 34}}>Item Successfully Added</Text>
        </SafeAreaView>
    )
}

