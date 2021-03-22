import React, {createContext, useState} from 'react';
import auth, {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export const AuthContext = createContext({});
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        register: async (name, email, password, college) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password);
            await auth().signInWithEmailAndPassword(email, password);
            const userId = firebase.auth().currentUser.uid;
            database()
              .ref(`Users/${userId}`)
              .set({
                name: name,
                uid: userId,
                email: email,
                college: college,
              })
              .then(() => console.log('Data updated.'));
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            console.log('emailsignout');
            await auth().signOut();
            setUser(null);
            console.log('signOut');
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
