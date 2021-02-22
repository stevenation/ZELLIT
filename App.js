import React from 'react'
import {SafeAreaView, Text} from 'react-native'
import SignIn from "./src/components/screens/signin";
import SignUp from "./src/components/screens/signup";
import Feed from "./src/components/screens/feed";
import ItemScreen from "./src/components/screens/feed/itemScreen";
import Providers from "./src/navigation";

export default function App() {
    return (
        <Providers/>
    )
}
