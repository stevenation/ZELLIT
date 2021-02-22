import React, {useContext, useEffect, useState} from 'react'
import Loading from "../components/Loading";
import {AuthContext} from "./AuthProvider";
import auth from '@react-native-firebase/auth'
import HomeStack from "./HomeStack";
import AuthStack from "./AuthStack";
import {NavigationContainer,DefaultTheme} from "@react-navigation/native";

export default function Routes() {
    const {user, setUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [initializing, setInitializing] = useState(true)

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false)
        setLoading(false)
    }

    useEffect(() => {
        return auth().onAuthStateChanged(onAuthStateChanged)
    }, [])
    if (loading) {
        return <Loading/>
    }
    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
        }
    }
    return (
        <NavigationContainer theme={DefaultTheme}>
            {user ? <HomeStack/> : <AuthStack/>}
        </NavigationContainer>
    )
}
