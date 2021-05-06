// React import
import React from 'react';

// React Native import
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// UIKitten import
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

// Theme import
import { appMappings, appThemes } from './app-theming';
import { Mapping, Theme, Theming } from '../services/theme.service';

// Components import
import { AppLoading, Task } from './app-loading.component';
import { CustomIconsPack } from './../components/custom-icons';
import { StatusBar } from '../components/status-bar.component';
import { SplashImage } from '../components/splash-image.component';

// Navigator import
import { AppNavigator } from '../navigation/app.navigator';

// AppStorage import
import { AppStorage } from '../services/app-storage.service';

// Redux import
import store from '../redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

const persistor = persistStore(store);

const loadingTasks: Task[] = [
  // Should be used it when running Expo.
  // In Bare RN Project this is configured by react-native.config.js
  // () => LoadFontsTask({
  //  'opensans-regular': require('../assets/fonts/opensans-regular.ttf'),
  //  'roboto-regular': require('../assets/fonts/roboto-regular.ttf'),
  // }),
  () => AppStorage.getMapping(defaultConfig.mapping).then(result => ['mapping', result]),
  () => AppStorage.getTheme(defaultConfig.theme).then(result => ['theme', result]),
];

const defaultConfig: { mapping: Mapping, theme: Theme } = {
  mapping: 'eva',
  theme: 'light',
};

const App = ({ mapping, theme }): React.ReactElement => {
  const [mappingContext, currentMapping] = Theming.useMapping(appMappings, mapping);
  const [themeContext, currentTheme] = Theming.useTheming(appThemes, mapping, theme);

  return (
    <React.Fragment>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IconRegistry icons={[EvaIconsPack, CustomIconsPack]}/>
          <AppearanceProvider>
            <ApplicationProvider {...currentMapping} theme={currentTheme}>
              <Theming.MappingContext.Provider value={mappingContext}>
                <Theming.ThemeContext.Provider value={themeContext}>
                  <SafeAreaProvider>
                    <StatusBar/>
                    <AppNavigator/>
                  </SafeAreaProvider>
                </Theming.ThemeContext.Provider>
              </Theming.MappingContext.Provider>
            </ApplicationProvider>
          </AppearanceProvider>
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
};

const Splash = ({ loading }): React.ReactElement => (
  <SplashImage
    loading={loading}
    source={require('../assets/images/splash-image.png')}
  />
);

export default (): React.ReactElement => (
  <AppLoading
    tasks={loadingTasks}
    initialConfig={defaultConfig}
    placeholder={Splash}>
    {props => <App {...props}/>}
  </AppLoading>
);
