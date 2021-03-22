import React from 'react';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
var loading = false;

export async function getUserData(userId, setUserData, setItemsData) {
  console.log(userId);
  await database()
    .ref(`Users/${userId}`)
    .on('value', async (snapshot) => {
      setUserData(snapshot.val());
      await database()
        .ref(`${snapshot.val()['college']}/Items`)
        .on('value', (snp) => {
          var lst = [];
          snp.forEach((child) => {
            var item = child.val();
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
              payment_method: item.payment_method,
            });
          });
          // console.log(lst)
          setItemsData(lst);
        });
    });
}

export async function addItem(item, userData) {
  const date = new Date();
  const timeStr = date.toTimeString();
  const dateStr = date.toDateString();
  await database()
    .ref(`${userData['college']}/Items/${userData['uid']}${dateStr}${timeStr}`)
    .set(item);
}

async function getDownloadURL(path) {
  await storage().ref(path).getDownloadURL();
}

export async function uploadImage(upLoadUri, setItems) {
  const date = new Date()
    .toString()
    .replace('-', '')
    .replace('(', '')
    .replace(')', '')
    .split(/:| /);

  var imgName = USER_ID;
  date.forEach((i) => {
    imgName += i;
  });

  await storage()
    .ref('images/items/' + imgName)
    .putFile(upLoadUri)
    .then(async (snapshot) => {
      await storage()
        .ref(snapshot.metadata.fullPath)
        .getDownloadURL()
        .then((uri) => {
          setItems((prevState) => ({
            ...prevState,
            img_url: uri,
          }));
        });
      console.log(`${imgName} has been successfully uploaded.`);
    })
    .catch((error) => {
      console.log('uploading image error => ', error);
    });
}

//
async function getUserID() {
  let id = await firebase.auth().currentUser.uid;
  return id;
}

export const USER_ID = firebase.auth().currentUser.uid;
