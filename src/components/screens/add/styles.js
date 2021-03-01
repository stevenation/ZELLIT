import React from "react";
import {StyleSheet} from "react-native";
import {COLORS} from "../../../constants";

export const styles = StyleSheet.create({
    conditionItem: {
        paddingHorizontal: 10,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.2)',
        height: 90,
        width: 90,
        borderStyle: "dashed",
        borderWidth: 1
    },
    selectedConditionItem: {
        paddingHorizontal: 10,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: COLORS.blue,
        height: 90,
        width: 90,
        borderStyle: "dashed",
        borderWidth: 1
    },
    conditionTitle:{
        fontSize: 16,
        paddingVertical:5
    },
    conditionDescription:{
        fontSize:12,
        fontWeight: "200"
    },
    inputContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        height: 50,
        borderRadius: 10,
        margin: 10,
        width: 150,
    },
    imageBorder: {
        height: 65,
        width: 65,
        borderWidth: 1,
        borderRadius:5,
        borderColor: COLORS.gray,
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        margin:5,

    },
    title:{
        fontWeight:"600",
        fontSize:18,
        margin:5
    }

})
