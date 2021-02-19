import React, { useEffect} from 'react';
import { View, Image } from 'react-native';
import { Button, Input, Layout, StyleService, Text, useStyleSheet, Modal } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { EyeIcon, EyeOffIcon, EmailIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: 'one',
    title: 'Title 1',
    text: 'Description 1',
    image: require('../assets/images/icon-articles.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'two',
    title: 'Title 2',
    text: 'Description 2',
    image: require('../assets/images/icon-articles.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'three',
    title: 'Title 3',
    text: 'Description 3',
    image: require('../assets/images/icon-articles.png'),
    backgroundColor: '#22bcb5',
  },
];

export default ({ navigation }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  const renderItem = ({ item }) => {
  return (
    <View style={styles.slide}>
      <View style={styles.slideView}><Text style={styles.title}>{item.title}</Text></View>
      <View style={styles.slideView}><Image style={styles.image} source={item.image} /></View>
      <View style={styles.slideView}><Text style={styles.text}>{item.text}</Text></View>
    </View>
  );
  };
  const onDone = () => {
    AsyncStorage.setItem('intro', '1');
    navigation && navigation.navigate('SignIn');
  };

  return (
    <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone} bottomButton/>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',

  },
  slide: {
    flex: 1,
    textAlign: 'center',
  },
  slideView: {
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 40,
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    alignContent: 'center',
    alignItems: 'center',
  },
  text: {

  },
});
