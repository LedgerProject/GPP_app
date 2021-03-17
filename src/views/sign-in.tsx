import React, { useEffect} from 'react';
import { View, ImageBackground } from 'react-native';
import { Button, Input, Layout, StyleService, Text, useStyleSheet, Modal } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { EyeIcon, EyeOffIcon, EmailIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import I18n from './../i18n/i18n';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-env';
import Spinner from 'react-native-loading-spinner-overlay';

export default ({ navigation }): React.ReactElement => {
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const styles = useStyleSheet(themedStyles);
  const [loading, setLoading] = React.useState(false);

  const onSignUpButtonPress = (): void => {
    navigation && navigation.navigate('SignUp');
  };

  const onForgotPasswordButtonPress = (): void => {
    navigation && navigation.navigate('ForgotPassword');
  };

  const onSignInButtonPress = (): void => {

    if (!email) {
      setError(I18n.t('Please fill Email'));
      setmodalVisible(true);
      return;
    }
    if (!password) {
      setError(I18n.t('Please fill Password'));
      setmodalVisible(true);
      return;
    }
    setLoading(true);
    const postParams = {
        email: email,
        password: password,
      };
      axios
      .post(AppOptions.getServerUrl() + 'users/login', postParams)
      .then(function (response) {
        // handle success
        setLoading(false);
        AsyncStorage.setItem('token', response.data.token);
        navigation && navigation.navigate('Homepage');
      })
      .catch(function () { // (error) {
        setLoading(false);
        setError(I18n.t('Please check Email or password'));
        setmodalVisible(true);
      });

  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>
      <Spinner
          visible={loading}
          textContent={I18n.t('Loading') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.headerContainer}>
          <ImageBackground
            style={styles.imageAuth}
            source={require('../assets/images/auth-background.png')}>
          </ImageBackground>
          <Text
            style={styles.signInLabel}
            category='s1'
            status='control'>
            {I18n.t('Sign in to your account')}
          </Text>
        </View>
        <Layout
          style={styles.formContainer}
          level='1'>
          <Input
            placeholder={I18n.t('E-mail')}
            icon={EmailIcon}
            value={email}
            keyboardType={'email-address'}
            onChangeText={setEmail}
            autoCapitalize='none'
          />
          <Input
            style={styles.passwordInput}
            placeholder={I18n.t('Password')}
            icon={passwordVisible ? EyeIcon : EyeOffIcon}
            value={password}
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
            onIconPress={onPasswordIconPress}
          />
          <View style={styles.forgotPasswordContainer}>
            <Button
              style={styles.forgotPasswordButton}
              appearance='ghost'
              status='basic'
              onPress={onForgotPasswordButtonPress}>
              {I18n.t('Forgot your password?')}
            </Button>
          </View>
        </Layout>
        <Button
          style={styles.signInButton}
          size='giant'
          onPress={onSignInButtonPress}>
          {I18n.t('SIGN IN')}
        </Button>
        <Button
          style={styles.signUpButton}
          appearance='ghost'
          status='basic'
          onPress={onSignUpButtonPress}>
          {I18n.t('Don\'t have an account? Create')}
        </Button>
      </KeyboardAvoidingView>

      <Modal
      visible={ modalVisible }
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setmodalVisible(false)}
      >
      <Layout style={ styles.modal } >
          <Text status='danger' style={ styles.modalText } >{error}</Text>
          <Button status='basic' onPress={() => setmodalVisible(false)}>{I18n.t('CLOSE')}</Button>
      </Layout>
      </Modal>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  container: {
    backgroundColor: 'background-basic-color-1',
  },
  imageAuth: {
    height: 160,
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 30,
    backgroundColor: 'color-primary-default',
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  signInLabel: {
    marginTop: 8,
    marginBottom: 8,
  },
  signInButton: {
    marginHorizontal: 16,
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  passwordInput: {
    marginTop: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modal: {
    textAlign: 'center',
    margin: 12,
    padding: 12,
    minWidth: 192,
  },
  modalText: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
