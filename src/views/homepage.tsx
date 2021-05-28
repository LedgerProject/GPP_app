// React import
import React, { useEffect } from 'react';
import { ImageStyle, View, ImageBackground, ScrollView } from 'react-native';

// Language import
import I18n from './../i18n/i18n';

// UIKitten import
import { TopNavigation, TopNavigationAction, Icon, StyleService, useStyleSheet, Layout } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuGridList } from '../components/menu-grid-list.component';
import { MenuIcon, CustomDocWalletIcon, CustomAroundMeIcon, CustomAbuseAlarmIcon, CustomNewsStoriesIcon } from '../components/icons';
import { ThemedIcon } from '../components/themed-icon.component';

interface PropsObject {
  [key: string]: any;
}

export const HomepageScreen = (props): React.ReactElement => {
  const [data, setData] = React.useState([]);
  const styles = useStyleSheet(themedStyles);

  // Homepage button press event
  const onItemPress = (index: number, var_name: string = null, var_value: boolean = null): void => {
      const vars: PropsObject = {};
      if (var_name) {
        vars[var_name] = var_value;
        props.navigation && props.navigation.navigate(data[index].route, {
          screen: 'ContentsList',
          params: vars,
        });
      } else {
        props.navigation && props.navigation.navigate(data[index].route);
      }
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
        var_name: null,
        var_value: null,
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
        var_name: null,
        var_value: null,
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
        var_name: 'abuseAlarm',
        var_value: true,
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
        var_name: 'abuseAlarm',
        var_value: false,
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
        <Layout
        style={styles.container}>
            <MenuGridList
              style={styles.buttonsContainer}
              data={data}
              onItemPress={onItemPress}
              footerComponent={Footer}
            />
        </Layout>
    </SafeAreaLayout>
  );
};

export const Footer = () => {
  const styles = useStyleSheet(themedStyles);

  return (
    <View style={styles.logoContainer}>
    <ImageBackground
      style={styles.imageLogo}
      source={require('../assets/images/logo-white.png')}>
    </ImageBackground>
    </View>
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
    // backgroundColor: 'background-basic-color-4',
  },
});
