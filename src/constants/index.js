import React from 'react';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const COLORS = {
  // base colors
  primary: '#5390ff', // Blue
  secondary: '#cacfd9', // Gray

  // colors
  black: '#1E1F20',
  white: '#FFFFFF',
  lightGray: '#c9cccf',
  gray: '#868a8d',
  blue: '#2189dd',
  orange: '#ff304f',
  dark: '#2e3440',
  green: 'green',
  lightGreen: '#AEE1CD',
  lightGreen1: '#228B22',
};

const appTheme = {COLORS};

export default appTheme;
