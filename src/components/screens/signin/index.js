import React, {useContext, useState} from 'react';
// import {AuthContext} from "../../../navigation/AuthProvider";
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Input} from 'react-native-elements';
// import GoogleSignIn from "./googleSignIn";
import {styles} from './styles';
import {COLORS} from '../../../constants';
import {Shadow} from 'react-native-neomorph-shadows';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const {login} = useContext(AuthContext)
  // const {googleLogin} = useContext(AuthContext)
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <SafeAreaView>
        <View style={styles.logo}>
          <MaterialIcon
            name={'emoji-people'}
            size={170}
            style={{color: COLORS.blue}}
          />
          {/*<Image source={require('../../../assets/images/frozen_hills.jpg')}*/}
          {/*       style={{alignSelf: "center", height: '100%', width: '100%'}}/>*/}
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder={'email@address.com'}
            inputStyle={{fontSize: 14}}
            placeholderTextColor="rgba(0,0,0,0.7)"
            autoCorrect={false}
            onChangeText={(userEmail) => setEmail(userEmail)}
            selectionColor={'white'}
            autoCapitalize={'none'}
            autoCompleteType={'email'}
            keyboardType={'email-address'}
            leftIcon={
              <Ionicons
                name={'md-mail'}
                size={25}
                style={styles.passwordIcon}
              />
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder={'Password'}
            inputStyle={{fontSize: 14}}
            onChangeText={(userPassword) => setPassword(userPassword)}
            placeholderTextColor={'rgba(0,0,0,0.6)'}
            secureTextEntry={true}
            leftIcon={
              <Ionicons
                name={'lock-closed'}
                size={25}
                style={styles.passwordIcon}
              />
            }
          />
        </View>
        <View style={{width: 300, alignSelf: 'center', alignItems: 'flex-end'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Reset');
              console.log('password reset email sent successfully');
            }}>
            <Text style={{}}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              login(email, password);
            }}>
            <Shadow style={styles.buttons}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </Shadow>
          </TouchableOpacity>
        </View>

        <Text
          style={{alignSelf: 'center', fontWeight: 'bold', marginVertical: 30}}>
          Or Connect Using
        </Text>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Text>New User? </Text>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => navigation.navigate('SignUp')}>
              <Text
                style={{color: COLORS.blue, fontWeight: '700', fontSize: 14}}>
                {' '}
                SignUp
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
