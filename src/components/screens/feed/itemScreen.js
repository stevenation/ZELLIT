import React, {useEffect, useState} from 'react'
import {Dimensions, Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native'
import {COLORS} from "../../../constants";
import AntDesign from 'react-native-vector-icons/AntDesign'
import {styles} from "./styles";
import {Button} from "react-native-elements";
import {SwiperFlatList} from 'react-native-swiper-flatlist'
import database from "@react-native-firebase/database";
import storage from '@react-native-firebase/storage';


const images = ['1', '2']
export default function ItemScreen(item) {
    const [like, setLike] = useState(false)
    const [loading, setLoading] = useState(true)
    const [likeColor, setLikeColor] = useState(COLORS.gray)
    const [sellerInfo, setSellerInfo] = useState('')
    const [profilePictureUrl, setProfilePictureUrl] = useState('')
    const itemData = item.route.params.itemData

    useEffect(() => {

        like === true ? setLikeColor(COLORS.orange) : setLikeColor(COLORS.gray)

        database()
            .ref(`Users/${itemData.uid}`)
            .on('value', snapshot => {
                setSellerInfo(snapshot.val())
                storage()
                    .ref(`/images/${snapshot.val().profile_picture}`)
                    .getDownloadURL()
                    .then((url) => {
                        setProfilePictureUrl(url)
                    }, (error) => {
                        console.log(error);
                    })
            })


    }, [like, profilePictureUrl])

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={() => item.navigation.navigate("Feed")}>
                <AntDesign name={'left'} size={25} style={{color: COLORS.blue}}/>
            </TouchableOpacity>
            <SwiperFlatList
                style={{paddingVertical: 10}}
                index={0}
                paginationStyle={{height: 380}}
                showPagination
                data={['1']}
                renderItem={({item}) => (
                    <Image style={{height: 400, width: Dimensions.get('screen').width}}
                           source={{uri: itemData.img_url ? itemData.img_url : null}}/>
                )
                }
            />
            <View style={{flexDirection: "row", justifyContent: 'space-between', padding: 10}}>
                <View>
                    <Text style={styles.itemNameIS}>{itemData.name}</Text>

                </View>
                <View>
                    <Text style={styles.postDate}>Posted Yesterday</Text>
                </View>
            </View>

            <View style={{flexDirection: "row", justifyContent: "space-between"}}>

                <View style={{flexDirection: 'row', alignContent: "center", padding: 10}}>
                    <Image style={styles.profileImage}
                           source={{uri: profilePictureUrl ? profilePictureUrl : null}}/>
                    <View style={{justifyContent: 'center', paddingHorizontal: 10}}>
                        <Text style={styles.userName}>{sellerInfo.name}</Text>
                        <View style={{flexDirection: "row", paddingVertical: 2}}>
                            <AntDesign name={'star'} color={COLORS.orange}/>
                            <AntDesign name={'star'} color={COLORS.orange}/>
                            <AntDesign name={'star'} color={COLORS.orange}/>
                            <AntDesign name={'star'} color={COLORS.orange}/>
                            <AntDesign name={'star'} color={COLORS.black}/>
                            <Text> 4/5</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{paddingRight: 5}}>
                                <Button title={'Buy'} containerStyle={styles.buyButton}/>

                            </View>
                            <View style={{paddingHorizontal: 5}}>
                                <Button title={'Chat'} containerStyle={styles.buyButton}/>
                            </View>

                        </View>


                    </View>


                </View>
                <View style={{alignContent: 'center', padding: 20, alignItems: "flex-end"}}>
                    <Text style={styles.price}>{itemData.price}</Text>
                    <Text style={{fontSize: 18}}>{itemData.payment_method}</Text>
                    <TouchableOpacity onPress={() => {
                        setLike(!like)
                    }}>
                        <AntDesign name={'heart'} size={30} color={likeColor} style={{paddingVertical: 5}}/>
                    </TouchableOpacity>


                </View>
            </View>

            <View style={{paddingHorizontal: 10}}>

                <View style={{flexDirection: 'row', alignItems: "center"}}>
                    <Text style={styles.category}>Condition</Text>
                    <Text>{itemData.condition}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: "center"}}>
                    <Text style={styles.category}>Brand</Text>
                    <Text>{itemData.brand}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: "center"}}>
                    <Text style={styles.category}>Category</Text>
                    <Text>{itemData.category}</Text>
                </View>
                <Text style={styles.category}>Description</Text>
                <Text>{itemData.description}</Text>

            </View>

        </SafeAreaView>
    )
}
