import React from 'react'
import database from "@react-native-firebase/database";
import {firebase} from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage"

export function getUserData(userId, setUserData, setItemsData) {
    database().ref(`Users/${userId}`)
        .on('value', snapshot => {
            setUserData(snapshot.val())
            console.log("setUserDATA", snapshot.val().college)
            database().ref(`${snapshot.val()['college']}/Items`)
                .on('value', snp => {
                    var lst = []
                    snp.forEach((child => {
                        var item = child.val()
                        lst.push({
                            key: child.key,
                            name: item.name,
                            price: item.price,
                            uid: item.uid,
                            condition: item.condition,
                            brand: item.brand,
                            description: item.description,
                            img_url: item.img_url,
                            category: item.category,
                            payment_method: item.payment_method
                        })
                    }))
                    // console.log(lst)
                    setItemsData(lst)
                })
        })
}


export function addItem(item, userData) {
    console.log(item)
    const date = new Date()
    const timeStr = date.toTimeString()
    const dateStr = date.toDateString()
    database().ref(`${userData['college']}/Items/${userData['uid']}${dateStr}${timeStr}`)
        .set(item)
}

function getDownloadURL(path) {
    storage()
        .ref(path)
        .getDownloadURL()
}

export function uploadImage(upLoadUri, setImageUri) {
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

    storage()
        .ref("images/items/" + imgName)
        .putFile(upLoadUri)
        .then(async (snapshot) => {
            await storage()
                .ref(snapshot.metadata.fullPath)
                .getDownloadURL()
                .then((uri) => {
                    console.log("uri:", uri)
                    setImageUri(uri)
                })

            console.log(`${imgName} has been successfully uploaded.`)
        })
        .catch((error) => {
            console.log('uploading image error => ', error)
        })
}

//
export const USER_ID = firebase.auth().currentUser.uid
console.log("userid:", USER_ID)


