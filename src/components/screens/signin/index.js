import React, {useContext, useState} from 'react';
import {AuthContext} from "../../../navigation/AuthProvider";
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
    Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Input} from 'react-native-elements';
import {styles} from './styles';
import {COLORS} from '../../../constants';
import {Shadow} from 'react-native-neomorph-shadows';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useContext(AuthContext)
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <SafeAreaView>
        <View style={styles.logoContainer}>
          {/*<MaterialCommunityIcons*/}
          {/*  name={'music-note-whole-dotted'}*/}
          {/*  size={170}*/}
          {/*  style={{color: COLORS.blue}}*/}
          {/*/>*/}
          <Image style={styles.logo} source={require("./logo.png")} />
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
