import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Divider,
  Drawer,
  DrawerElement,
  DrawerHeaderElement,
  DrawerHeaderFooter,
  DrawerHeaderFooterElement,
  Layout,
  MenuItemType,
  Text,
} from '@ui-kitten/components';
import { BookOpenIcon, LockIcon, MapIcon, PersonIcon, Settings2Icon, LogoutIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { WebBrowserService } from '../../services/web-browser.service';
import { AppInfoService } from '../../services/app-info.service';
import I18n from '../../i18n/i18n';

/*const DATA: MenuItemType[] = [
  { title: I18n.t('Document Wallet'), icon: BookOpenIcon },
  { title: I18n.t('Where I Am'), icon: MapIcon },
  { title: I18n.t('My Profile'), icon: PersonIcon },
  { title: I18n.t('Settings'), icon: Settings2Icon },
  { title: I18n.t('Change Password'), icon: LockIcon },
  { title: I18n.t('Kosmopolis'), icon: LockIcon },
  { title: I18n.t('Logout'), icon: LogoutIcon },
];*/

const version: string = AppInfoService.getVersion();

export const HomeDrawer = ({ navigation }): DrawerElement => {

/*const DATA: MenuItemType[] = [
  { title: I18n.t('Document Wallet'), icon: BookOpenIcon },
  { title: I18n.t('Where I Am'), icon: MapIcon },
  { title: I18n.t('My Profile'), icon: PersonIcon },
  { title: I18n.t('Settings'), icon: Settings2Icon },
  { title: I18n.t('Change Password'), icon: LockIcon },
  { title: I18n.t('Kosmopolis'), icon: LockIcon },
  { title: I18n.t('Logout'), icon: LogoutIcon },
];*/

  const [DATA, setDATA] = React.useState([]);

  useEffect(() => {
    const menuObj = [
      { title: I18n.t('Homepage'), icon: BookOpenIcon },
      { title: I18n.t('Document Wallet'), icon: BookOpenIcon },
      { title: I18n.t('Where I Am'), icon: MapIcon },
      { title: I18n.t('My Profile'), icon: PersonIcon },
      { title: I18n.t('Settings'), icon: Settings2Icon },
      { title: I18n.t('Change Password'), icon: LockIcon },
      { title: I18n.t('Kosmopolis'), icon: LockIcon },
      { title: I18n.t('Logout'), icon: LogoutIcon },
    ];
    const menuArray = menuObj;
    // menuArray.push(menuObj);
    setDATA(menuArray);
  }, []);



  const onItemSelect = (index: number): void => {
    switch (index) {
      // Document Wallet
      case 0: {
        navigation.toggleDrawer();
        navigation.navigate('Homepage');
        return;
      }
      case 1: {
        navigation.toggleDrawer();
        navigation.navigate('DocWallet');
        return;
      }
      // Where I Am
      case 2: {
        navigation.toggleDrawer();
        navigation.navigate('Structures');
        return;
      }
      // My Profile
      case 3: {
        navigation.toggleDrawer();
        navigation.navigate('MyProfile');
        return;
      }
      // Settings
      case 4: {
        navigation.toggleDrawer();
        navigation.navigate('Settings');
        return;
      }
      // Change Password
      case 5: {
        navigation.toggleDrawer();
        navigation.navigate('ChangePassword');
        return;
      }
      // Kosmopolis
      case 6: {
        navigation.toggleDrawer();
        WebBrowserService.openBrowserAsync('http://www.kosmopolis.me/');
        return;
      }
      // Logout
      case 7: {
        navigation.toggleDrawer();
        navigation.navigate('SignIn');
        return;
      }
    }
  };

  const renderHeader = (): DrawerHeaderElement => (
    <Layout
      style={styles.header}
      level='2'>
      <View style={styles.profileContainer}>
        <Avatar
          size='giant'
          source={require('../../assets/images/image-app-icon.png')}
        />
        <Text
          style={styles.profileName}
          category='h6'>
          Global Passport Project
        </Text>
      </View>
    </Layout>
  );

  const renderFooter = (): DrawerHeaderFooterElement => (
    <React.Fragment>
      <Divider/>
      <DrawerHeaderFooter
        disabled={true}
        description={`Version ${AppInfoService.getVersion()}`}
      />
    </React.Fragment>
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <Drawer
        header={renderHeader}
        footer={renderFooter}
        data={DATA}
        onSelect={onItemSelect}
      />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 128,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    marginHorizontal: 8,
  },
});
