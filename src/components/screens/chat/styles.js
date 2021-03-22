import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const width = Dimensions.get('screen').width;

export const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    alignSelf: 'center',
    fontSize: 30,
  },
  cellContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    backgroundColor: COLORS.white,
    height: 70,
  },
  profilePicture: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  middleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 90,
    padding: 5,
  },
  lastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 90,
    padding: 5,
  },
  profileContainer: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    width: width - 125,
  },
  unread: {
    backgroundColor: COLORS.blue,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '500',
    fontSize: 18,
  },
  message: {
    color: COLORS.gray,
  },
  lastTalked: {
    color: COLORS.gray,
  },
  line: {
    width: width - 85,
    borderWidth: 0.5,
    borderColor: COLORS.gray,
  },
});
