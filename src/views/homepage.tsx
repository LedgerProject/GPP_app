// React import
import React, { useEffect } from 'react';
import { ImageStyle, View, ImageBackground, ScrollView } from 'react-native';

// Language import
import I18n from './../i18n/i18n';

// UIKitten import
import { TopNavigation, TopNavigationAction, Icon, StyleService, useStyleSheet, Layout } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuGridList } from '../components/menu-grid-list.component';
import { MenuIcon } from '../components/icons';
import { ThemedIcon } from '../components/themed-icon.component';

// DocWallet icon
export const CustomDocWalletIcon = (props) => (
  <Icon {...props} name='custom-doc-wallet' pack='assets' />
);

// AroundMe icon
export const CustomAroundMeIcon = (props) => (
  <Icon {...props} name='custom-around-me' pack='assets' />
);

// AbuseAlarm icon
export const CustomAbuseAlarmIcon = (props) => (
  <Icon {...props} name='custom-abuse-alarm' pack='assets' />
);

// News&Stories icon
export const CustomNewsStoriesIcon = (props) => (
  <Icon {...props} name='custom-news-stories' pack='assets' />
);

export const HomepageScreen = (props): React.ReactElement => {
  const [data, setData] = React.useState([]);
  const styles = useStyleSheet(themedStyles);

  // Homepage button press event
  const onItemPress = (index: number): void => {
    props.navigation.navigate(data[index].route);
  };

  // Navbar menu render
  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
      style={styles.topBarIcon}
    />
  );

  // Use effect
  useEffect(() => {
    setButtons();
  }, []);

  // Set the buttons array
  async function setButtons() {
    const buttonsArray = [];

    // DocWallet button
    buttonsArray.push(
      {
        title: I18n.t('DocWallet'),
        route: 'DocWallet',
        icon: (style: ImageStyle) => {
          return React.createElement(
            ThemedIcon,
            { ...style, light: CustomDocWalletIcon, dark: CustomDocWalletIcon },
          );
        },
      },
    );

    // AroundMe button
    buttonsArray.push(
      {
        title: I18n.t('AroundMe'),
        route: 'AroundMe',
        icon: (style: ImageStyle) => {
          return React.createElement(
            ThemedIcon,
            { ...style, light: CustomAroundMeIcon, dark: CustomAroundMeIcon },
          );
        },
      },
    );

    // AbuseAlarm button
    buttonsArray.push(
      {
        title: I18n.t('AbuseAlarm'),
        route: 'AbuseAlarm',
        icon: (style: ImageStyle) => {
          return React.createElement(
            ThemedIcon,
            { ...style, light: CustomAbuseAlarmIcon, dark: CustomAbuseAlarmIcon },
          );
        },
      },
    );

    // News&Stories button
    buttonsArray.push(
      {
        title: I18n.t('News&Stories'),
        route: 'NewsStories',
        icon: (style: ImageStyle) => {
          return React.createElement(
            ThemedIcon,
            { ...style, light: CustomNewsStoriesIcon, dark: CustomNewsStoriesIcon },
          );
        },
      },
    );

    setData(buttonsArray);
  }

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title='Global Passport Project'
        titleStyle={styles.topBarTitle}
        leftControl={renderDrawerAction() }
        style={styles.topBar}
      />
      <ScrollView>
        <Layout
        style={styles.container}
        level='2'>
          <View>
            <MenuGridList
              style={styles.buttonsContainer}
              data={data}
              onItemPress={onItemPress}
            />
          </View>
          <View style={styles.logoContainer}>
              <ImageBackground
                style={styles.imageLogo}
                source={require('../assets/images/logo-white.png')}>
              </ImageBackground>
          </View>
        </Layout>
      </ScrollView>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'background-basic-color-4',
  },
  container: {
    flex: 1,
  },
  buttonsContainer: {
    backgroundColor: 'background-basic-color-4',
  },
  topBar: {
    backgroundColor: 'color-primary-default',
  },
  topBarTitle: {
    color: '#FFFFFF',
  },
  topBarIcon: {
    color: '#FFFFFF',
    tintColor: '#FFFFFF',
  },
  imageLogo: {
    height: 123.9,
    flex: 1,
    width: 120,
  },
  logoContainer: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 30,
    backgroundColor: 'background-basic-color-4',
  },
});
