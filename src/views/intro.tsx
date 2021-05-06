// React import
import React from 'react';
import { View, ImageBackground } from 'react-native';

// UIKitten import
import { StyleService, Text, useStyleSheet } from '@ui-kitten/components';

// Redux import
import { useDispatch } from 'react-redux';
import { manageIntro } from '../redux/introSlice';

// Other imports
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: 'one',
    title: '',
    text: 'TAKE PHOTOS OF YOUR DOCUMENTS AND UPLOAD THEM SAFELY ON YOUR DOC-WALLET',
    image: require('../assets/images/slide-01.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'two',
    title: '',
    text: 'GENERATE A TOKEN AND COMMUNICATE IT TO AN OPERATOR TO LET HIM SEE YOUR DOCUMENTS',
    image: require('../assets/images/slide-02.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'three',
    title: '',
    text: 'IF YOU LOSE OR BREAK YOUR SMARTPHONE YOU DON\'T LOSE YOUR DATA.\n\nYOU CAN ALWAYS ACCESS YOUR RESERVED AREA FROM OUR WEBSITE',
    image: require('../assets/images/slide-03.png'),
    backgroundColor: '#22bcb5',
  },
  {
    key: 'four',
    title: '',
    text: 'VIEW FRIENDLY ORGANIZATIONS CLOSE YOUR POSITION (ONLY WITH GPS ON)',
    image: require('../assets/images/slide-04.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'five',
    title: '',
    text: 'SEARCH FOR ORGANIZATIONS AND SERVICES ACCORDING TO YOUR NEEDS',
    image: require('../assets/images/slide-05.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'six',
    title: '',
    text: 'GET INFORMATIONS ABOUT LEGAL FRAMEWORK OF THE COUNTRY WHERE YOU LIVE OR THAT YOU ARE CROSSING',
    image: require('../assets/images/slide-06.png'),
    backgroundColor: '#22bcb5',
  },
];

export default ({ navigation }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const dispatch = useDispatch();

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <View style={[styles.slideView, styles.slideImage]}>
          <ImageBackground source={item.image} style={styles.image}></ImageBackground>
        </View>
        <View style={styles.slideView}>
          <Text
            category='h6'
            style={styles.text}>
              {item.text}
          </Text>
        </View>
      </View>
    );
  };

  // On pressing done button last slide button
  const onDone = () => {
    dispatch(manageIntro('1'));
    navigation && navigation.navigate('SignIn');
  };

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      bottomButton/>
  );
};

const themedStyles = StyleService.create({
  slide: {
    flex: 2,
    alignContent: 'center',
    alignItems: 'center',
  },
  slideView: {
    flex: 1,
    flexDirection: 'row',
    textAlign: 'center',
    alignContent: 'center',
  },
  slideImage: {
    paddingTop: 30,
  },
  title: {
    marginTop: 40,
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    alignContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  text: {
    padding: 20,
    paddingTop: 40,
    textAlign: 'center',
  },
});
