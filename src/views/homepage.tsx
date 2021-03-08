import React, { useEffect } from 'react';
import { StyleSheet, ImageStyle, Image } from 'react-native';
import { Divider, TopNavigation, TopNavigationAction, Icon, StyleService, useStyleSheet } from '@ui-kitten/components';
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
      <Divider/>
      <MenuGridList
        data={data}
        onItemPress={onItemPress}
      />
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
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
});
