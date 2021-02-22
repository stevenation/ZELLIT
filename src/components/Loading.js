import React from 'react'
import {StyleSheet, View, ActivityIndicator} from 'react-native'

export default function Loading() {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator
                size={'large'}
                color={'#664ee0'}/>
        </View>
    )
}

styles = StyleSheet.create({
    loadingContainer:{
        flex:1,
        alignItems: 'center',
        justifyContent:'center'
    }
})