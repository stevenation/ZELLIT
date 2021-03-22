import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export const styles = StyleSheet.create({
  cell: {
    alignSelf: 'center',
    borderRadius: 10,
    shadowOpacity: 0.3,
    shadowColor: COLORS.black,
    shadowRadius: 10,
    backgroundColor: COLORS.white,
    width: Dimensions.get('screen').width,
    height: 100,
    paddingHorizontal: 5,
  },
  sellerName: {
    fontWeight: '700',
    fontSize: 20,
    paddingVertical: 2,
  },
  itemName: {
    fontSize: 18,
    paddingVertical: 2,
    color: COLORS.gray,
  },
  progessContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    height: 50,
    maxWidth: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.white,
    paddingHorizontal: 5,
  },
  date: {
    paddingHorizontal: 5,
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.gray,
  },
  buyingStatesContainer: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  stateContainer: {
    width: Dimensions.get('screen').width / 2 - 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  stateText: {
    fontWeight: '500',
    fontSize: 16,
  },
  confirm: {
    TitleStyle: {fontWeight: '500'},
    style: {width: 200, alignSelf: 'center'},
    buttonStyle: {borderRadius: 50},
  },
});
