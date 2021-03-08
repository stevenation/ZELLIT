import React, {useEffect, useState} from 'react'
import {FlatList, Image, KeyboardAvoidingView, SafeAreaView, Text, View} from 'react-native'
import {ScrollView, Switch, TouchableOpacity} from "react-native-gesture-handler";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {COLORS} from "../../../constants";
import {Button, Input} from "react-native-elements";
import {styles} from "./styles";
import DropDownPicker from "react-native-dropdown-picker";
import ImageCropPicker from "react-native-image-crop-picker"
import {addItem, getUserData, uploadImage, USER_ID} from "../../../database";
import {firebase} from "@react-native-firebase/auth";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import storage from "@react-native-firebase/storage";


export default function Add({navigation}) {
    const USER_ID = firebase.auth().currentUser.uid
this.state = []
    const [userData, setUserData] = useState('')
    const [add, setAdd] = useState(false)
    const [upload, setUpload] = useState(false)
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


    useEffect(() => {
        getUserData(USER_ID, setUserData, setItemsData)
        setUserData(userData)
        setItemsData(itemsData)
        setItems((prevState => (
            {
                ...prevState,
                uid: USER_ID
            }
        )))
    }, []);

    useEffect(() => {

        async function uploadImages(upLoadUri) {
            const date = new Date()
                .toString()
                .replace("-", "")
                .replace("(", "")
                .replace(")", "")
                .split(/:| /)

            var imgName = USER_ID
            date.forEach((i => {
                imgName += i
            }))

            await storage()
                .ref("images/items/" + imgName)
                .putFile(upLoadUri)
                .then(async (snapshot) => {
                    await storage()
                        .ref("images/items/" + imgName)
                        .getDownloadURL()
                        .then((uri) => {
                            setItems((prevState => (
                                {
                                    ...prevState,
                                    img_url: uri
                                }
                            )))

                        })
                })
        }

        if (upload) {

            if (items.name !== "" || items.condition !== "" || items.category !== "") {
                console.log("uploading image to storage")
                uploadImages(uploadUri)
                setUpload(false)
                setAdd(true)
            }
        }
    }, [upload, items])

    useEffect(() => {
        // console.log("items changed", items)
        if (add && !upload &&items.img_url!=="") {
            // console.log("Add changed", add)
            // console.log("items changed: ", items)
            addItem(items, userData)
            setAdd(false)
            navigation.navigate("AddConfirm")
        }

    }, [items])

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
                                // console.log(image)
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
                        onChangeText={async (title) => {
                            await setItems((prevState => (
                                {
                                    ...prevState,
                                    name: title
                                }
                            )))
                        }}
                        autoCapitalize={"words"}
                        autoCompleteType={'name'}
                    />
                    <Text style={styles.title}>Description</Text>
                    <Input
                        placeholder={'Describe your item'}
                        inputStyle={{color: COLORS.black, fontSize: 14}}
                        placeholderTextColor="rgba(0,0,0,0.7)"
                        autoCorrect={false}
                        multiline={true}
                        style={{height: 100}}
                        onChangeText={async (desr) => {
                            await setItems((prevState => (
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
                        onChangeText={async (brand) => {
                            await setItems((prevState => (
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
                        onChangeItem={async (itm) => {
                            await setItems((prevState => (
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
                            <TouchableOpacity onPress={async () => {

                                const id = selectedId
                                console.log("item id: ", item.id, id)

                                id === item.id ? setSelectedId(null) : setSelectedId(item.id)
                                // console.log("changed: ", item.id, selectedId, id)

                                await setItems((prevState => (

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
                            <FontAwesome style={{paddingHorizontal: 5, color: COLORS.blue}} name={"money"} size={30}/>
                            <Text>In-Person</Text>
                        </View>

                        <View style={{alignItems: "center", paddingHorizontal: 10}}>
                            <Switch style={{alignSelf: "flex-end"}}
                                    onValueChange={async (value) => {
                                        await setInPersonEnabled(value)

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
                            <MaterialIcons style={{paddingHorizontal: 5, color: COLORS.blue}} name={"payments"} size={30}/>
                            <Text>Third-Party App</Text>
                        </View>

                        <View style={{alignItems: "center", paddingHorizontal: 10}}>
                            <Switch style={{alignSelf: "flex-end"}}
                                    onValueChange={async (value) => {
                                        await setThirdPartyEnabled(value)
                                        await setItems((prevState => (
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
                        onPress={async () => {
                            console.log(add)
                            setUpload(true)
                            // setItems(items)
                        }}/>
                    <View style={{height: 50}}></View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
