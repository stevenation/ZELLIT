import React from "react";
import {StyleSheet} from "react-native";
import {COLORS} from "../../../constants";
import {colors} from "react-native-elements";


export const styles = StyleSheet.create({

    cellContainer:{
        padding:10
    },
    section:{
        flexDirection:'row',
        justifyContent:"space-between",
        padding: 10
    },
    sectionTitle:{
        fontWeight:'700',
        fontSize: 18
    },
    collegeName:{
        alignSelf: 'center',
        fontWeight:'700',
        fontSize:20
    },
    categoryItem:{
        width: 60,
        paddingHorizontal: 5,
       alignItems: 'center',
        paddingVertical:5
    },
    catBackground:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.blue,
        width:35,
        height:35,
        borderRadius: 17.5
    },
    infoContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
        paddingHorizontal:5
    },
    cell: {
        alignSelf: 'center',
        borderRadius: 25,
        shadowOpacity: 0.3,
        shadowColor: 'black',
        shadowRadius: 25,
        backgroundColor: COLORS.white,
        width: 180,
        height: 200,
    },
    cellImage: {
        width:180,
        height: 150,
    },
    itemName:{
        fontWeight:'500'
    },
    itemPrice:{
        fontWeight: "600",
        color: COLORS.orange
    },
    seeAll:{
        color: COLORS.blue,
        fontWeight:'500'
    },
    itemNameIS:{
        fontWeight:'700',
        fontSize:24
    },
    postDate:{
        fontSize:16,
        color:COLORS.gray
    },
    price:{
        fontWeight:'700',
        fontSize:20,
        paddingVertical:2
    },
    category:{
        fontWeight:'500',
        fontSize:16,
        paddingRight:10,
        paddingVertical: 10
    },
    buyButton:{
        borderRadius:20,
    },
    profileImage:{
        width:100,
        height:100,
        borderRadius:50,
        borderWidth:2,
        borderColor: COLORS.orange
    },
    userName:{
        fontSize:18,
        fontWeight:'500'
    }
})
