import React from 'react'
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {firebase} from "@react-native-firebase/auth";
import {styles} from "./../add/styles";
import ImageCropPicker from "react-native-image-crop-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {COLORS} from "../../../constants";
import {Button, Input} from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {Switch} from "react-native-gesture-handler";
import storage from "@react-native-firebase/storage";
import database from "@react-native-firebase/database";

export default class CacheImage extends React.Component {
    // style={item.id === selectedId ? styles.selectedConditionItem : styles.conditionItem}
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            userId: firebase.auth().currentUser.uid,
            userData: [],
            img: [],
            USER_ID: firebase.auth().currentUser.uid,
            selectedId: null,
            thirdPartyEnabled: false,
            inPersonEnabled: false,
            itemsData: {
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
            },

            upLoadUri: "",
            upload: false,
            categories: [
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

            ],

            conditions: [
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

        }


    }

    async UNSAFE_componentWillMount() {

        this.setState((prevState => (
            {
                itemsData: {
                    ...prevState.itemsData,
                    uid: this.state.userId
                }
            }
        )))
        await database().ref(`Users/${this.state.USER_ID}`)
            .on('value', async snapshot => {
                await this.setState({userData: snapshot.val()})
            })

    }

    async addItem() {
        // console.log("item: ",item)
        const date = new Date()
        await database().ref(`${this.state.userData['college']}/Items/${this.state.userData['uid']}${date.toString()}`)
            .set(this.state.itemsData)
    }

    async uploadImages(upLoadUri) {
        const date = new Date()
            .toString()
            .replace("-", "")
            .replace("(", "")
            .replace(")", "")
            .split(/:| /)

        var imgName = this.state.USER_ID
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
                        this.setState((prevState => (
                            {
                                itemsData: {
                                    ...prevState.itemsData,
                                    img_url: uri
                                }
                            }
                        )))

                    })
            })
    }

    renderImage() {
        if (this.state.upLoadUri !== "") {
            return (this.state.upLoadUri === "" ? null :
                    <Image
                        source={{uri: this.state.upLoadUri}}
                        resizeMode={"stretch"}
                        style={{width: 65, height: 65, margin: 5}}/>
            )
        }
    }

    render() {
        return (
            <SafeAreaView>
                <Text style={{fontSize: 24, alignSelf: "center", fontWeight: "600"}}>Add Item</Text>
                <View style={{borderBottomWidth: 2, padding: 5}}></View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}>

                    <ScrollView>
                        <View style={{flexDirection: "row"}}>
                            <View>
                                {this.renderImage()}
                            </View>
                            <TouchableOpacity style={styles.imageBorder} onPress={() => {
                                ImageCropPicker.openCamera({
                                    width: 300,
                                    height: 300,
                                    cropping: true
                                }).then(image => {
                                    let uri = image.path
                                    console.log(uri)
                                    this.setState({
                                        img:
                                            {
                                                id: "1",
                                                uri: uri
                                            }
                                    })
                                    // this.state.img.push({id: "1", uri: uri})
                                    this.setState({upLoadUri: uri})
                                }).catch(e =>
                                    console.log(e))

                            }}>

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
                                await this.setState((prevState => (
                                    {
                                        itemsData: {
                                            ...prevState.itemsData,
                                            name: title
                                        }
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
                                await this.setState((prevState => (
                                    {
                                        itemsData: {
                                            ...prevState.itemsData,
                                            description: desr
                                        }
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
                                await this.setState((prevState => (
                                    {
                                        itemsData: {
                                            ...prevState.itemsData,
                                            brand: brand
                                        }
                                    }
                                )))
                            }}
                            autoCapitalize={"words"}
                            autoCompleteType={'name'}

                        />
                        <Text style={styles.title}>Category</Text>

                        <DropDownPicker
                            items={this.state.categories}
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
                                await this.setState((prevState => (
                                    {
                                        itemsData: {
                                            ...prevState.itemsData,
                                            category: itm.label
                                        }
                                    }
                                )))
                            }
                            }
                        />
                        <Text style={styles.title}>Condition</Text>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            data={this.state.conditions}
                            extraData={this.state.selectedId}
                            renderItem={({item}) => (
                                <TouchableOpacity onPress={async () => {
                                    const id = this.state.selectedId
                                    id === item.id ? this.setState({selectedId: null}) :
                                        this.setState({selectedId: item.id})
                                    await this.setState((prevState => (
                                        {
                                            itemsData: {
                                                ...prevState.itemsData,
                                                condition: item.title
                                            }
                                        }
                                    )))


                                }}
                                                  style={item.id === this.state.selectedId ? styles.selectedConditionItem : styles.conditionItem}
                                >
                                    <Text style={styles.conditionTitle}>{item.title}</Text>
                                    <Text numberOfLines={3}
                                          style={styles.conditionDescription}>{item.description}</Text>
                                </TouchableOpacity>
                            )}/>

                        <Text style={styles.title}>Payment Options</Text>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <FontAwesome style={{paddingHorizontal: 5, color: COLORS.blue}} name={"money"}
                                             size={30}/>
                                <Text>In-Person</Text>
                            </View>

                            <View style={{alignItems: "center", paddingHorizontal: 10}}>
                                <Switch style={{alignSelf: "flex-end"}}
                                        onValueChange={async (value) => {
                                            await this.setState({inPersonEnabled: value})
                                            await this.setState((prevState => (
                                                {
                                                    itemsData: {
                                                        ...prevState.itemsData,
                                                        payment_method1: value
                                                    }
                                                }
                                            )))

                                        }}
                                        value={this.state.inPersonEnabled}/>
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
                                <MaterialIcons style={{paddingHorizontal: 5, color: COLORS.blue}} name={"payments"}
                                               size={30}/>
                                <Text>Third-Party App</Text>
                            </View>

                            <View style={{alignItems: "center", paddingHorizontal: 10}}>
                                <Switch style={{alignSelf: "flex-end"}}
                                        onValueChange={async (value) => {
                                            await this.setState({thirdPartyEnabled: value})
                                            await this.setState((prevState => (
                                                {
                                                    itemsData: {
                                                        ...prevState.itemsData,
                                                        payment_method2: value
                                                    }
                                                }
                                            )))

                                        }}
                                        value={this.state.thirdPartyEnabled}/>
                            </View>

                        </View>
                        <Text style={styles.title}>Price</Text>
                        <Input
                            placeholder={'0'}
                            inputStyle={{color: COLORS.black, fontSize: 30}}
                            placeholderTextColor="rgba(0,0,0,0.7)"
                            autoCorrect={false}
                            onChangeText={async (price) => {
                                await this.setState((prevState => (
                                    {
                                        itemsData: {
                                            ...prevState.itemsData,
                                            price: price
                                        }
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
                                this.setState({upload: true})

                                if (this.state.itemsData.name !== "" || this.state.itemsData.condition !== "" || this.state.itemsData.category !== "") {
                                    await this.uploadImages(this.state.upLoadUri)
                                    console.log(this.state.upLoadUri)
                                    await this.addItem()
                                    console.log("item added")
                                    this.props.navigation.navigate("AddConfirm")
                                } else {
                                    alert("Fill all the required fields")
                                }
                            }}/>
                        <View style={{height: 50}}></View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

        )
    }


}
