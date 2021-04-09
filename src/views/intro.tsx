import React, { useEffect} from 'react';
import { View, ImageBackground } from 'react-native';
import { Button, Input, Layout, StyleService, Text, useStyleSheet, Modal } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { EyeIcon, EyeOffIcon, EmailIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';
// REDUX
import { useSelector, useDispatch } from 'react-redux';
import {
  manageIntro,
  selectIntro,
} from '../app/introSlice';

const slides = [
  {
    key: 'one',
    title: '',
    text: 'TAKE PHOTOS OF YOUR DOCUMENTS AND UPLOAD THEM TO BLOCKCHAIN ​​AND IPFS',
    image: require('../assets/images/img_01.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'two',
    title: '',
    text: 'GENERATE A TOKEN AND COMMUNICATE IT TO AN OPERATOR TO LET HIM SEE YOUR DOCUMENTS',
    image: require('../assets/images/img_02.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'three',
    title: '',
    text: 'IF YOU LOSE YOUR SMARTPHONE OR IT GETS CONFISCATED YOU DO NOT LOSE DATA',
    image: require('../assets/images/img_03.png'),
    backgroundColor: '#22bcb5',
  },
  {
    key: 'four',
    title: '',
    text: 'VIEW SUPPORT STRUCTURES CLOSER THAN YOUR POSITION',
    image: require('../assets/images/img_04.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'five',
    title: '',
    text: 'LOOK FOR SUPPORT STRUCTURES ACCORDING TO YOUR NEEDS',
    image: require('../assets/images/img_05.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'six',
    title: '',
    text: 'KNOW THE STATUS OF A NATION OF YOUR TRIP',
    image: require('../assets/images/img_06.png'),
    backgroundColor: '#22bcb5',
  },
];

export default ({ navigation }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const dispatch = useDispatch();

  const renderItem = ({ item }) => {
  return (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      {/*<View style={styles.slideView}>
        <Text style={styles.title}>{item.title}</Text>
      </View>*/}
      <View style={[styles.slideView, styles.slideImage]}>
        <ImageBackground source={item.image} style={styles.image}></ImageBackground>
      </View>
      <View style={styles.slideView}><Text category='h6' style={styles.text}>{item.text}</Text></View>
    </View>
  );
  };
  const onDone = () => {
    dispatch(manageIntro('1'));
    // AsyncStorage.setItem('intro', '1');
    navigation && navigation.navigate('SignIn');
  };

  return (
    <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone} bottomButton/>
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
    // alignItems: 'center',
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
