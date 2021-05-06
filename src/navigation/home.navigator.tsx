// React import
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Navigator import
import { HomepageNavigator } from './homepage.navigator';
import { SwitchScreen } from './switch.navigator';
import { IntroScreen } from './intro.navigator';
import { SignInScreen } from './sign-in.navigator';
import { SignUpScreen } from './sign-up.navigator';
import { ForgotPassword } from './forgot-password.navigator';

// Component import
import { HomeDrawer } from '../components/home-drawer.component';

const Drawer = createDrawerNavigator();

/*
 * When dev is true in .expo/settings.json (started via `start:dev`),
 * open Components tab as default.
 */
const initialTabRoute: string = __DEV__ ? 'Components' : 'Layouts';

export const HomeNavigator = (): React.ReactElement => {
  return (
    <Drawer.Navigator
      screenOptions={{ gestureEnabled: false }}
      drawerContent={props => <HomeDrawer {...props}/>}>
      <Drawer.Screen name='Switch' component={SwitchScreen}/>
      <Drawer.Screen name='Intro' component={IntroScreen}/>
      <Drawer.Screen name='SignIn' component={SignInScreen}/>
      <Drawer.Screen name='SignUp' component={SignUpScreen}/>
      <Drawer.Screen name='ForgotPassword' component={ForgotPassword}/>
      <Drawer.Screen name='Homepage' component={HomepageNavigator}/>
    </Drawer.Navigator>
  );
};
