import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
  },
  logo: {
    alignSelf: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').height / 5,
    marginVertical: 50,
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
    marginVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignSelf: 'center',
    padding: 20,
  },
  passwordIcon: {
    color: COLORS.blue,
    right: 5,
  },
  buttons: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    shadowOpacity: 0.3,
    shadowColor: 'black',
    shadowRadius: 25,
    backgroundColor: COLORS.blue,
    width: 120,
    height: 40,
  },
});
