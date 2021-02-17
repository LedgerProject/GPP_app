import React, { useEffect } from 'react';
import { StyleSheet, ImageStyle } from 'react-native';
import { Divider, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuGridList } from '../components/menu-grid-list.component';
import { MenuIcon } from '../components/icons';
// import { data } from './homepage/data';
import I18n from './../i18n/i18n';
import { ThemedIcon } from './../components/themed-icon.component';
import {
  AssetDocWalletDarkIcon,
  AssetDocWalletIcon,
  AssetStructuresDarkIcon,
  AssetStructuresIcon,
  AssetSocialDarkIcon,
  AssetSocialIcon,
  AssetNewPostIcon,
  AssetNewPostDarkIcon,
} from './../components/icons';

export const HomepageScreen = (props): React.ReactElement => {

  const [data, setData] = React.useState([]);

  const onItemPress = (index: number): void => {
    props.navigation.navigate(data[index].route);
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
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
            { ...style, light: AssetDocWalletIcon, dark: AssetDocWalletDarkIcon },
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
            { ...style, light: AssetStructuresIcon, dark: AssetStructuresDarkIcon },
          );
        },
      },
    );
    buttonsArray.push(
    {
      title: I18n.t('Social'),
      route: 'Social',
      icon: (style: ImageStyle) => {
        return React.createElement(
          ThemedIcon,
          { ...style, light: AssetSocialIcon, dark: AssetSocialDarkIcon },
        );
      },
    },
    );
    buttonsArray.push(
    {
      title: I18n.t('New Post'),
      route: 'NewPost',
      icon: (style: ImageStyle) => {
        return React.createElement(
          ThemedIcon,
          { ...style, light: AssetNewPostIcon, dark: AssetNewPostDarkIcon },
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
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <MenuGridList
        data={data}
        onItemPress={onItemPress}
      />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
