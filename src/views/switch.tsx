// React import
import React, { useEffect} from 'react';

// React Native import
import { View, ImageBackground } from 'react-native';

// UIKitten import
import { StyleService, useStyleSheet } from '@ui-kitten/components';

// Redux import
import { useSelector } from 'react-redux';
import { selectIntro } from '../redux/introSlice';

export default ({ navigation }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const intro = useSelector(selectIntro);

  // Use effect
  useEffect(() => {
    getIntroStatus();
  }, []);

  async function getIntroStatus() {
    if (intro === '1') {
     navigation && navigation.navigate('SignIn');
    } else {
     navigation && navigation.navigate('Intro');
    }
  }

  return (
    <View style={styles.safeArea}>
      <ImageBackground
        style={styles.image}
        source={require('../assets/images/splash-image.png')}
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
    backgroundColor: '#FFF',
  },
  image: {
    height: 160,
    flex: 1,
    width: '100%',
  },
});
