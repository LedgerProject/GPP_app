import React, { useEffect} from 'react';
import { View, ImageBackground } from 'react-native';
import { Button, Input, Layout, StyleService, Text, useStyleSheet, Modal } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { EyeIcon, EyeOffIcon, EmailIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default ({ navigation }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  useEffect(() => {
    async function getIntroStatus() {
      const intro = await AsyncStorage.getItem('intro');
       if (intro === '1') {
        navigation && navigation.navigate('SignIn');
       } else {
        navigation && navigation.navigate('Intro');
       }
    }
    getIntroStatus();
  }, []);

  return (
    <View style={styles.safeArea}>
  <ImageBackground
    style={styles.image}
    source={require('../assets/images/image-splash.png')}
  />
    </View>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  image: {
    height: 160,
    flex: 1,
    width: '100%',
  },
});
