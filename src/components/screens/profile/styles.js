import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export const styles = StyleSheet.create({
  cell: {
    alignSelf: 'center',
    // borderRadius: 10,
    shadowOpacity: 0.3,
    shadowColor: COLORS.black,
    // shadowRadius: 10,
    backgroundColor: COLORS.white,
    width: Dimensions.get('screen').width,
    height: 80,
    paddingHorizontal: 5,
    // marginVertical: 1,
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
  confirmTitleStyle: {fontWeight: '500'},
  confirmStyle: {maxWidth: 200, minWidth: 100, alignSelf: 'center'},
  confirmButtonStyle: {borderRadius: 50},
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  imageRectangular: {
    borderRadius: 60,
    height: 120,
    width: 120,
    backgroundColor: '#ddd',
    margin: 10,
  },
  collegeText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 14,
  },
  transactionButtons: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    margin: 5,
    borderRadius: 15,
    borderColor: COLORS.white,
    backgroundColor: COLORS.white,
  },
  conditionItem: {
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: 90,
    width: 90,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  selectedConditionItem: {
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: COLORS.blue,
    height: 90,
    width: 90,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  conditionTitle: {
    fontSize: 16,
    paddingVertical: 5,
  },
  conditionDescription: {
    fontSize: 12,
    fontWeight: '200',
  },
  inputContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    margin: 10,
    width: 150,
  },
  imageBorder: {
    height: 65,
    width: 65,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.gray,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    margin: 5,
  },
});
