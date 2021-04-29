import React, { useEffect } from 'react';
import { StyleSheet, ImageStyle, Image, View, ImageBackground, ScrollView } from 'react-native';
import { Divider, TopNavigation, TopNavigationAction, Icon, StyleService, useStyleSheet, Text, Layout } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuGridList } from '../components/menu-grid-list.component';
import { MenuIcon } from '../components/icons';
// import { data } from './homepage/data';
import I18n from './../i18n/i18n';
import { ThemedIcon } from './../components/themed-icon.component';
/*import {
  AssetDocWalletDarkIcon,
  AssetDocWalletIcon,
  AssetStructuresDarkIcon,
  AssetStructuresIcon,
  AssetSocialDarkIcon,
  AssetSocialIcon,
  AssetNewPostIcon,
  AssetNewPostDarkIcon,
} from './../components/icons';*/

// REDUX
/*
import { useSelector, useDispatch } from 'react-redux';
import {
  manageToken,
  selectToken,
} from '../app/tokenSlice';
*/

export const CustomDocWalletIcon = (props) => (
  <Icon {...props} name='custom-doc-wallet' pack='assets' />
);
export const CustomWhereIAmIcon = (props) => (
  <Icon {...props} name='custom-where-i-am' pack='assets' />
);
export const CustomNewCompliantIcon = (props) => (
  <Icon {...props} name='custom-new-compliant' pack='assets' />
);
export const CustomCompliantsIcon = (props) => (
  <Icon {...props} name='custom-compliants' pack='assets' />
);

export const HomepageScreen = (props): React.ReactElement => {

  const [data, setData] = React.useState([]);
  const styles = useStyleSheet(themedStyles);

  // const token = useSelector(selectToken);
  // const dispatch = useDispatch();

  const onItemPress = (index: number): void => {
    props.navigation.navigate(data[index].route);
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
      style={styles.topBarIcon}
    />
  );

  useEffect(() => {
      getButtons();
  }, []);

  async function getButtons() {
    const buttonsArray = [];
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
    buttonsArray.push(
      {
        title: I18n.t('Where I Am'),
        route: 'Structures',
        icon: (style: ImageStyle) => {
          return React.createElement(
            ThemedIcon,
            { ...style, light: CustomWhereIAmIcon, dark: CustomWhereIAmIcon },
          );
        },
      },
    );
    buttonsArray.push(
    {
      title: I18n.t('New Compliant'),
      route: 'CompliantEdit',
      icon: (style: ImageStyle) => {
        return React.createElement(
          ThemedIcon,
          { ...style, light: CustomNewCompliantIcon, dark: CustomNewCompliantIcon },
        );
      },
    },
    );
    buttonsArray.push(
    {
      title: I18n.t('Compliants'),
      route: 'Compliants',
      icon: (style: ImageStyle) => {
        return React.createElement(
          ThemedIcon,
          { ...style, light: CustomCompliantsIcon, dark: CustomCompliantsIcon },
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
      <MenuGridList style={styles.buttonsContainer}
        data={data}
        onItemPress={onItemPress}
      />
      </View>
      <View style={styles.logoContainer}>
          <ImageBackground
            style={styles.imageLogo}
            source={require('../assets/images/white-logo.png')}>
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
