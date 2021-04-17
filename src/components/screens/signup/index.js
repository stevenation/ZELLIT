import React, {useContext, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Input, Text} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../../navigation/AuthProvider';
import {COLORS} from '../../../constants';
import {Shadow} from 'react-native-neomorph-shadows';
import {styles} from './styles';
import {universities} from './uniData';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('uk');
  const [name, setName] = useState('');
  const {register} = useContext(AuthContext);
  const [passColor, setPassColor] = useState(COLORS.blue);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '800',
            padding: 10,
            color: COLORS.black,
          }}>
          Let's Get Started!
        </Text>
        <Text style={{color: COLORS.black, padding: 10}}>
          Create an account
        </Text>

        <View style={styles.inputContainer}>
          <Input
            placeholder={'Full Name'}
            inputStyle={{color: COLORS.black, fontSize: 14}}
            placeholderTextColor="rgba(0,0,0,0.7)"
            autoCorrect={false}
            onChangeText={(userName) => setName(userName)}
            autoCapitalize={'words'}
            autoCompleteType={'name'}
            leftIcon={
              <Ionicons
                name={'person'}
                size={25}
                style={{right: 5, color: COLORS.blue}}
              />
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            placeholder={'email@address.com'}
            inputStyle={{color: COLORS.black, fontSize: 14}}
            placeholderTextColor="rgba(0,0,0,0.7)"
            autoCorrect={false}
            onChangeText={(userEmail) => setEmail(userEmail)}
            autoCapitalize={'none'}
            autoCompleteType={'email'}
            keyboardType={'email-address'}
            leftIcon={
              <Ionicons
                name={'md-mail'}
                size={25}
                style={{right: 5, color: COLORS.blue}}
              />
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder={'Password'}
            inputStyle={{color: COLORS.black, fontSize: 14}}
            onChangeText={(userPassword) => setPassword(userPassword)}
            placeholderTextColor={'rgba(0,0,0,0.7)'}
            secureTextEntry={true}
            leftIcon={
              <Ionicons
                name={'lock-closed'}
                size={25}
                style={{right: 5, color: passColor}}
              />
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder={'Confirm Password'}
            inputStyle={{color: COLORS.black, fontSize: 14}}
            onChangeText={(userPassword1) => {
              password !== '' && password === userPassword1
                ? setPassColor('green')
                : setPassColor('rgba(255,255,255,0.7)');
            }}
            placeholderTextColor={'rgba(0,0,0,0.7)'}
            secureTextEntry={true}
            leftIcon={
              <Ionicons
                name={'lock-closed'}
                size={25}
                style={{right: 5, color: passColor}}
              />
            }
          />
        </View>

        <DropDownPicker
          items={universities}
          defaultValue={''}
          searchable={true}
          placeholder={'Institution'}
          labelStyle={{color: COLORS.black}}
          containerStyle={styles.inputContainer}
          style={{backgroundColor: 'rgba(255,255,255,0.2)', color: 'blue'}}
          itemStyle={{
            justifyContent: 'flex-start',
          }}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          onChangeItem={(item) => setCollege(item)}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              register(name, email, password, college['value']);
            }}>
            <Shadow style={styles.buttons}>
              <Text style={styles.buttonText}>SIGNUP</Text>
            </Shadow>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
  },
  inputContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: 10,
    margin: 10,
    width: 300,
  },
  inputBox: {
    width: 300,
    left: 2,
    height: 30,
    color: 'white',
    marginVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  button: {
    alignSelf: 'center',
    width: 150,
    borderRadius: 25,
    height: 100,
    marginVertical: 10,
    paddingVertical: 20,
  },
});
