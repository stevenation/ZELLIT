import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native'
import {COLORS} from "../../../constants";
import AntDesign from 'react-native-vector-icons/AntDesign'
import {styles} from "./styles";
import {Button} from "react-native-elements";
import {SwiperFlatList} from 'react-native-swiper-flatlist'
import database from "@react-native-firebase/database";
import storage from '@react-native-firebase/storage';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {useHeaderHeight} from "@react-navigation/stack";

export default function ItemScreen(item) {
    const height = useHeaderHeight() + 13
    const [like, setLike] = useState(false)
    const [likeColor, setLikeColor] = useState(COLORS.gray)
    const [sellerInfo, setSellerInfo] = useState('')
    const [profilePictureUrl, setProfilePictureUrl] = useState('')
    const itemData = item.route.params.itemData
    const [modalVisible, setModalVisible] = useState(false)
    const [catModalVisible, setCatModalVisible] = useState(false)
    const [confirmModalVisible, setConfirmModalVisible] = useState(false)
    const categories = ["fraud", "illegal_items", "spam", "harassment", "nudity", "hate_speech"]

    useLayoutEffect(()=>{
        item.navigation.setOptions({
            headerBackTitle: " ",
            headerRight: () => (
                <TouchableOpacity
                    style={{paddingHorizontal: 5}}
                    onPress={() => {
                        setModalVisible(true)

                    }}
                >
                    <MaterialCommunityIcons name={"dots-horizontal"} size={30}/>
                </TouchableOpacity>
            )
        })
    })



    function reportItem(cat) {
        const date = new Date()

        database()
            .ref(`ReportedItems/${cat}/${itemData.key}`)
            .set(date.toString())
    }

    useEffect(() => {

        like === true ? setLikeColor(COLORS.orange) : setLikeColor(COLORS.gray)

        database()
            .ref(`Users/${itemData.uid}`)
            .on('value', (snapshot) => {
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
            <View>
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}
                    >
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 22,
                        }}>
                            <View style={{
                                margin: 20,
                                backgroundColor: 'white',
                                borderRadius: 20,
                                padding: 35,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}>
                                <TouchableOpacity onPress={() => {
                                    setModalVisible(false)
                                    setCatModalVisible(true)
                                }}>
                                    <Text style={styles.modalText}>Report</Text>
                                </TouchableOpacity>

                                <TouchableHighlight
                                    style={{...styles.openButton, backgroundColor: '#2196F3'}}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View>
                    <Modal animationType="slide"
                           transparent={true}
                           visible={catModalVisible}
                           onRequestClose={() => {
                               Alert.alert('Modal has been closed.');
                           }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TouchableOpacity onPress={() => {
                                    reportItem(categories[0])
                                    setCatModalVisible(false)
                                    setConfirmModalVisible(true)
                                }}>
                                    <Text style={styles.modalText}>Fraud</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    reportItem(categories[1])
                                    setCatModalVisible(false)
                                    setConfirmModalVisible(true)
                                }}>
                                    <Text style={styles.modalText}>Illegal Items</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    reportItem(categories[2])
                                    setCatModalVisible(false)
                                    setConfirmModalVisible(true)
                                }}>
                                    <Text style={styles.modalText}>Spam</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    reportItem(categories[3])
                                    setCatModalVisible(false)
                                    setConfirmModalVisible(true)
                                }}>
                                    <Text style={styles.modalText}>Harassment</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    reportItem(categories[4])
                                    setCatModalVisible(false)
                                    setConfirmModalVisible(true)
                                }}>
                                    <Text style={styles.modalText}>Nudity or Sexual Activity</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    reportItem(categories[5])
                                    setCatModalVisible(false)
                                    setConfirmModalVisible(true)
                                }}>
                                    <Text style={styles.modalText}>Hate Speech</Text>
                                </TouchableOpacity>

                                <TouchableHighlight
                                    style={{...styles.openButton, backgroundColor: '#2196F3'}}
                                    onPress={() => {
                                        setCatModalVisible(!catModalVisible);
                                    }}>
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={confirmModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Item Reported</Text>
                                <TouchableHighlight
                                    style={{...styles.openButton, backgroundColor: '#2196F3'}}
                                    onPress={() => {
                                        setConfirmModalVisible(!confirmModalVisible);
                                    }}>
                                    <Text style={styles.textStyle}>OK</Text>
                                </TouchableHighlight>
                            </View></View>

                    </Modal>
                </View>

            </View>
            <ScrollView>

                <SwiperFlatList
                    style={{paddingVertical: 10}}
                    index={0}
                    paginationStyle={{height: 380}}
                    showPagination
                    data={['1']}
                    renderItem={({item}) => (
                        <Image style={{height: 400, width: Dimensions.get('screen').width}}
                               resizeMode={"stretch"}
                               source={{uri: itemData.path ? itemData.path : null}}/>
                    )
                    }
                />
                <View style={{flexDirection: "row", justifyContent: 'space-between', padding: 10}}>
                    <View>
                        <Text style={styles.itemNameIS}>{itemData.name}</Text>

                    </View>
                    <View>
                        <Text style={styles.postDate}>Posted Today</Text>
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
                                    <Button onPress={() => {
                                        item.navigation.navigate("Buy", {
                                            itemsData: {
                                                ...itemData,
                                                sellerName: sellerInfo.name, sellerUid: sellerInfo.uid
                                            }, height:height, sellerInfo:sellerInfo
                                        })
                                    }}
                                            title={'Buy'} containerStyle={styles.buyButton}/>

                                </View>
                                <View style={{paddingHorizontal: 5}}>
                                    <Button onPress={() => {
                                        item.navigation.navigate("Chat", {
                                            screen: "ConversationScreen",
                                            params: {user: sellerInfo, height: height}
                                        })
                                    }
                                    } title={'Chat'} containerStyle={styles.buyButton}/>
                                </View>

                            </View>


                        </View>


                    </View>
                    <View style={{alignContent: 'center', padding: 20, alignItems: "flex-end"}}>
                        <Text style={styles.price}>{"$" + `${itemData.price}`}</Text>
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
                <View style={{height: 50}}></View>
            </ScrollView>
        </SafeAreaView>

    )
}
