// React import
import React, { useEffect } from 'react';

// React Native import
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

// UIKitten import
import { Button, Layout, StyleService, useStyleSheet, Select, TopNavigation, TopNavigationAction,
  Divider, Text, Modal as ModalUiKitten } from '@ui-kitten/components';

// Locale import
import I18n from './../i18n/i18n';

// Components import
import { MenuIcon, GlobeIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

// Model import
import languageOptions from '../model/language.model';

// Other imports
import { KeyboardAvoidingView } from '../services/3rd-party';

export const SettingsScreen = (props): React.ReactElement => {
  const [language, setLanguage] = React.useState(props.selectedOption);
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');

  const styles = useStyleSheet(themedStyles);

  // Use Effect
  useEffect(() => {
    showLanguage();
  }, []);

  // Show the current language
  const showLanguage = async () => {
    const lang = await AsyncStorage.getItem('lang');
    languageOptions.forEach( element => {
      if (element.lang === lang) {
        setLanguage({ text: element.text, lang: element.lang});
      }
    });
  };

  // On selecting language event
  const onSelectLanguage = (option) => {
    setLanguage(option);
  };

  // On changing language event
  const onSaveButtonPress = (): void => {
    if (language) {
      AsyncStorage.setItem('lang', language.lang);

      I18n.locale = language.lang;

      showAlertMessage(
        (I18n.t('Language Settings')),
        (I18n.t('Language updated successfully.')),
      );
    }
  };

  // Restart the application
  const restartApp = (): void => {
    setModalAlertVisible(false);

    RNRestart.Restart();
  };

  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <View
        style={{flex: 1}}>
        <TopNavigation
          title={I18n.t('Settings')}
          titleStyle={styles.topBarTitle}
          leftControl={renderDrawerAction() }
          style={styles.topBar}
        />
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView style={styles.container}>
            <Layout
              style={styles.formContainer}
              level='1'>
              <Select
                {...props}
                icon={GlobeIcon}
                style={styles.select}
                selectedOption={language}
                data={languageOptions}
                placeholder={I18n.t('Select the application language')}
                onSelect={onSelectLanguage}
              />
              <Text
                style={styles.infoSection}>
                  {I18n.t('Select the application language')}
              </Text>
              <Button
                  style={styles.saveButton}
                  size='giant'
                  onPress={onSaveButtonPress}>
                  {I18n.t('Save')}
              </Button>
            </Layout>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
      <ModalUiKitten
        visible={ modalAlertVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalAlertVisible(false)}>
        <Layout style={ styles.modal } >
          <Text style={ styles.modalText } category='h6' >{I18n.t(alertTitle)}</Text>
          <Text style={ styles.modalText } >{I18n.t(alertMessage)}</Text>
          <Button status='basic' onPress={() => restartApp() }>{I18n.t('CLOSE')}</Button>
        </Layout>
      </ModalUiKitten>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  container: {
    backgroundColor: 'background-basic-color-4',
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    backgroundColor: 'background-basic-color-4',
  },
  select: {
    marginTop: 8,
    marginBottom: 12,
    width: '100%',
  },
  infoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 4,
    marginHorizontal: 16,
    color: 'color-light-100',
  },
  saveButton: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modal: {
    textAlign: 'center',
    margin: 12,
    padding: 12,
  },
  modalText: {
    marginBottom: 4,
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: 4,
    textAlign: 'center',
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
