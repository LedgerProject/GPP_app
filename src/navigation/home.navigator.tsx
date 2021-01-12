import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { LayoutsNavigator } from './layouts.navigator';
import { ComponentsNavigator } from './components.navigator';
import { SignInScreen } from './sign-in.navigator';
import { SignUpScreen } from './sign-up.navigator';
import { ForgotPassword } from './forgot-password.navigator';
import { HomepageNavigator } from './homepage.navigator';
import { ThemesNavigator } from './themes.navigator';
import { HomeBottomNavigation } from '../scenes/home/home-bottom-navigation.component';
import { HomeDrawer } from '../scenes/home/home-drawer.component';
import { LibrariesScreen } from '../scenes/libraries/libraries.component';

const Drawer = createDrawerNavigator();

/*
 * When dev is true in .expo/settings.json (started via `start:dev`),
 * open Components tab as default.
 */
const initialTabRoute: string = __DEV__ ? 'Components' : 'Layouts';

export const HomeNavigator = (): React.ReactElement => (
  <Drawer.Navigator
    screenOptions={{ gestureEnabled: false }}
    drawerContent={props => <HomeDrawer {...props}/>}>
    <Drawer.Screen name='SignIn' component={SignInScreen}/>
    <Drawer.Screen name='SignUp' component={SignUpScreen}/>
    <Drawer.Screen name='ForgotPassword' component={ForgotPassword}/>
    <Drawer.Screen name='Homepage' component={HomepageNavigator}/>
  </Drawer.Navigator>
);
