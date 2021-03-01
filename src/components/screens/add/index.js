import React, {useEffect, useState} from 'react'
import {FlatList, Image, KeyboardAvoidingView, SafeAreaView, Text, View} from 'react-native'
import {ScrollView, Switch, TouchableOpacity} from "react-native-gesture-handler";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {COLORS} from "../../../constants";
import {Button, Input} from "react-native-elements";
import {styles} from "./styles";
import DropDownPicker from "react-native-dropdown-picker";
import ImageCropPicker from "react-native-image-crop-picker"
import {getUserData, uploadImage} from "../../../database";
import {firebase} from "@react-native-firebase/auth";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function Add() {
    const [userData, setUserData] = useState('')
    const [itemsData, setItemsData] = useState('')
    const [uploadUri, setUploadUri] = useState("")
    const [imageUri, setImageUri] = useState("")
    const [selectedId, setSelectedId] = useState(null)
    const [enabled, setEnabled] = useState(false)
    const [inPersonEnabled, setInPersonEnabled] = useState(false)
    const [thirdPartyEnabled, setThirdPartyEnabled] = useState(false)
    const [items, setItems] = useState({
        name: "",
        price: "",
        brand: "",
        description: "",
        condition: "",
        category: "",
        payment_method1: "",
        payment_method2: "",
        img_url: "",
        uid: ""
    })
    //./test_test1_com_profile_picture.jpg
    const img = []

    const categories = [
        {
            label: "School",
            value: "school"
        },
        {
            label: "Electronics",
            value: "electronics"
        },
        {
            label: "Women",
            value: "women"
        },
        {
            label: "Men",
            value: "men"
        },
        {
            label: "Transportation",
            value: "transportation"
        },
        {
            label: "Other",
            value: "other"
        }

    ]

    const conditions = [
        {
            id: "1",
            title: "New",
            description: "With tags, unopened"
        },
        {
            id: "2",
            title: "Like New",
            description: "New without tags, unused"
        },
        {
            id: "3",
            title: "Good",
            description: "Used, minor flaws"
        },
        {
            id: "4",
            title: "Fair",
            description: "Gently used"
        },
        {
            id: "5",
            title: "Poor",
            description: "Major flaws"
        },
    ]


    const options = {
        title: 'Select Avatar',
        maxWidth: 200,
        maxHeight: 200,
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    function renderImage() {
        if (uploadUri !== "") {
            return (uploadUri === "" ? null :
                    <Image
                        source={{uri: uploadUri}}
                        resizeMode={"stretch"}
                        style={{width: 65, height: 65, margin: 5}}/>
            )
        }
    }

    function handleSelection(id) {

        if (id === selectedId) {
            console.log("selec", selectedId)
            setSelectedId(null)
            console.log("id,seld:", id, selectedId)
        } else {
            setSelectedId(id)
            console.log("sleected", selectedId)
        }
    }


    useEffect(() => {
        const USER_ID = firebase.auth().currentUser.uid
        getUserData(USER_ID, setUserData, setItemsData)
        // setImageUri(imageUri)
        // setUploadUri(uploadUri)
        // setItems(items)
        setUserData(userData)
        setItemsData(itemsData)
        // setSelectedId(selectedId)
        // handleSelection(selectedId)

    }, []);




    return (
        <SafeAreaView>
            <Text style={{fontSize: 24, alignSelf: "center", fontWeight: "600"}}>Add Item</Text>
            <View style={{borderBottomWidth: 2, padding: 5}}></View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}>

                <ScrollView>
                    {/*<View style={{height:Dimensions.get("screen").height-170}}>*/}
                    <View style={{flexDirection: "row"}}>
                        <View>
                            {renderImage()}
                        </View>
                        <TouchableOpacity style={styles.imageBorder} onPress={() => {
                            ImageCropPicker.openCamera({
                                width: 300,
                                height: 300,
                                cropping: true
                            }).then(image => {
                                let uri = image.path
                                console.log(image)
                                img.push({id: "1", uri: uri})
                                setUploadUri(uri)
                            }).catch(e =>
                                console.log(e))

                        }}>
                            <View>
                                {/*imageUri===""? null : <Image source={imageUri}  style={{width: 40, height:50}}/>*/}
                            </View>

                            <MaterialIcons name={"add-photo-alternate"} size={30} color={COLORS.gray}/>

                        </TouchableOpacity>
                    </View>

                    <View style={{borderBottomWidth: 1}}></View>

                    <Text style={styles.title}>Title</Text>
                    <Input
                        placeholder={'Create Title'}
                        inputStyle={{color: COLORS.black, fontSize: 14}}
                        placeholderTextColor="rgba(0,0,0,0.7)"
                        autoCorrect={false}
                        onChangeText={(title) => {
                            setItems((prevState => (
                                {
                                    ...prevState,
                                    name: title
                                }
                            )))
                        }}
                        autoCapitalize={"words"}
                        autoCompleteType={'name'}
                        // leftIcon={
                        //     // <Ionicons
                        //     //     name={'person'}
                        //     //     size={25}
                        //     //     style={{right: 5, color: COLORS.blue}}
                        //     // />
                        // }
                    />
                    <Text style={styles.title}>Description</Text>
                    <Input
                        placeholder={'Describe your item'}
                        inputStyle={{color: COLORS.black, fontSize: 14}}
                        placeholderTextColor="rgba(0,0,0,0.7)"
                        autoCorrect={false}
                        multiline={true}
                        style={{height: 100}}
                        onChangeText={(desr) => {
                            setItems((prevState => (
                                {
                                    ...prevState,
                                    description: desr
                                }
                            )))
                        }}
                        autoCapitalize={"words"}
                        autoCompleteType={'name'}

                    />
                    <Text style={styles.title}>Brand</Text>
                    <Input
                        placeholder={'item brand'}
                        inputStyle={{color: COLORS.black, fontSize: 14}}
                        placeholderTextColor="rgba(0,0,0,0.7)"
                        autoCorrect={false}
                        onChangeText={(brand) => {
                            setItems((prevState => (
                                {
                                    ...prevState,
                                    brand: brand
                                }
                            )))
                        }}
                        autoCapitalize={"words"}
                        autoCompleteType={'name'}

                    />
                    <Text style={styles.title}>Category</Text>

                    <DropDownPicker
                        items={categories}
                        defaultValue={'other'}
                        searchable={true}
                        placeholder={'Category'}
                        labelStyle={{color: COLORS.black}}
                        containerStyle={styles.inputContainer}
                        style={{backgroundColor: 'rgba(255,255,255,0.2)'}}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                        onChangeItem={(itm) => {
                            setItems((prevState => (
                                {
                                    ...prevState,
                                    category: itm.label
                                }
                            )))
                        }
                        }
                    />
                    <Text style={styles.title}>Condition</Text>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={conditions}
                        // extraData={selectedId}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => {

                                const id = selectedId
                                console.log("item id: ", item.id, id)

                                id === item.id ? setSelectedId(null) : setSelectedId(item.id)
                                // console.log("changed: ", item.id, selectedId, id)

                                setItems((prevState => (

                                    {
                                        ...prevState,
                                        condition: item.title
                                    }
                                )))
                                console.log("item id2: ", item.id, selectedId)


                                // console.log("letsee",item.id, id, items.condition)
                            }} style={item.id === selectedId ? styles.selectedConditionItem : styles.conditionItem}>
                                <Text style={styles.conditionTitle}>{item.title}</Text>
                                <Text numberOfLines={3} style={styles.conditionDescription}>{item.description}</Text>
                            </TouchableOpacity>
                        )}/>

                    <Text style={styles.title}>Payment Options</Text>
                    <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <FontAwesome style={{paddingHorizontal: 5}} name={"money"} size={30}/>
                            <Text>In-Person</Text>
                        </View>

                        <View style={{alignItems: "center", paddingHorizontal: 10}}>
                            <Switch style={{alignSelf: "flex-end"}}
                                    onValueChange={(value) => {
                                        setInPersonEnabled(value)

                                        value === true ?
                                            setItems((prevState => (
                                                {
                                                    ...prevState,
                                                    payment_method1: true
                                                }
                                            ))) : false
                                    }}
                                    value={inPersonEnabled}/>
                        </View>


                    </View>
                    <View style={{borderBottomWidth: 2, padding: 5}}></View>

                    <View style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <MaterialIcons style={{paddingHorizontal: 5}} name={"payments"} size={30}/>
                            <Text>Third-Party App</Text>
                        </View>

                        <View style={{alignItems: "center", paddingHorizontal: 10}}>
                            <Switch style={{alignSelf: "flex-end"}}
                                    onValueChange={(value) => {
                                        setThirdPartyEnabled(value)
                                        setItems((prevState => (
                                            {
                                                ...prevState,
                                                payment_method2: value
                                            }
                                        )))

                                    }}
                                    value={thirdPartyEnabled}/>
                        </View>

                    </View>


                    <Text style={styles.title}>Price</Text>

                    <Input
                        placeholder={'0'}
                        inputStyle={{color: COLORS.black, fontSize: 30}}
                        placeholderTextColor="rgba(0,0,0,0.7)"
                        autoCorrect={false}
                        onChangeText={(price) => {
                            setItems((prevState => (
                                {
                                    ...prevState,
                                    price: price
                                }
                            )))
                        }}
                        keyboardType={"numeric"}
                        leftIcon={
                            <FontAwesome
                                name={'dollar'}
                                size={30}
                                style={{right: 5, color: COLORS.blue}}
                            />
                        }
                    />

                    <Button
                        title={"ADD"}
                        titleStyle={{fontWeight: "600"}}
                        style={{width: 100, height: 80, alignSelf: "center", borderRadius: 40}}
                        onPress={() => {
                        uploadImage(uploadUri, setImageUri)
                        setItems((prevState => (
                            {
                                ...prevState,
                                img_url: imageUri
                            }
                        )))
                            console.log("imageUri", imageUri)
                            console.log(items)
                        addItem(items, userData)
                    }}/>
                    {/*</View>*/}
                    <View style={{height: 50}}></View>
                </ScrollView>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
