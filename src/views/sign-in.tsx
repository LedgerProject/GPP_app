import React, { useEffect} from 'react';
import { View, ImageBackground } from 'react-native';
import { Button, Input, Layout, StyleService, Text, useStyleSheet, Modal } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { EyeIcon, EyeOffIcon, EmailIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import I18n from './../i18n/i18n';
import axios from 'axios';
import { AppOptions } from '../services/app-env';
import Spinner from 'react-native-loading-spinner-overlay';

// Redux import
import { useDispatch } from 'react-redux';
import { manageToken } from '../app/tokenSlice';
import { manageEmail } from '../app/emailSlice';

export default ({ navigation }): React.ReactElement => {
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const styles = useStyleSheet(themedStyles);
  const [loading, setLoading] = React.useState(false);

  // Redux
  const dispatch = useDispatch();

  // Use effect
  useEffect(() => {
    setEmail('test@globalpassportproject.me');
    setPassword('12345678');
  }, []);

  // Open the sign-up page
  const onSignUpButtonPress = (): void => {
    navigation && navigation.navigate('SignUp');
  };

  // Open the forgot password page
  const onForgotPasswordButtonPress = (): void => {
    dispatch(manageEmail(email));
    navigation && navigation.navigate('ForgotPassword');
  };

  // Show / hide the password
  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  // Try to login
  const onSignInButtonPress = (): void => {
    // Check if the e-mail is entered
    if (!email) {
      setError(I18n.t('Please enter the e-mail'));
      setmodalVisible(true);
      return;
    }

    // Check if the password is entered
    if (!password) {
      setError(I18n.t('Please enter the password'));
      setmodalVisible(true);
      return;
    }

    // Show the spinner
    setLoading(true);

    // Set the post params
    const postParams = {
      email: email,
      password: password,
    };

    // Request from the backend
    axios
      .post(AppOptions.getServerUrl() + 'users/login', postParams)
      .then(function (response) {
        // Hide the spinner
        setLoading(false);

        // Save locally the token
        dispatch(manageToken(response.data.token));

        // Open the homepage page
        navigation && navigation.navigate('Homepage');
      })
      .catch(function (err) {
        // Set the error message
        let errDescription = '';

        if (err.response) {
          switch (err.response.data.error.statusCode) {
            case 401:
              errDescription = 'Please check e-mail or password';
            break;

            default:
              errDescription = err.response.data.error.message;
            break;
          }
        } else {
          errDescription = 'Unable to reach the server, please try again.';
        }

        // Hide the spinner
        setLoading(false);

        // Show the error
        setError(errDescription);
        setmodalVisible(true);
      });
  };

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>
        <Spinner
          visible={loading}
          textContent={I18n.t('Loading') + '...'}
          textStyle={styles.spinnerTextStyle}
        />

        <View style={styles.logoContainer}>
          <ImageBackground
            style={styles.imageAuth}
            source={require('../assets/images/red-logo.png')}>
          </ImageBackground>
        </View>  
        <View style={styles.headerContainer}>    
          <Text
            style={styles.signInLabel}
            category='s1'
            status='control'>
            {I18n.t('Sign-in to your account')}
          </Text>
        </View>

        <Layout style={styles.formContainer} level='1'>
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
          {I18n.t('SIGN-IN')}
        </Button>

        <Button
          style={styles.signUpButton}
          appearance='ghost'
          status='basic'
          onPress={onSignUpButtonPress}>
          {I18n.t('Don\'t have an account yet? Sign Up!')}
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
    backgroundColor: 'background-basic-color-4',
  },
  imageAuth: {
    height: 123.9,
    flex: 1,
    width: 120,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 30,
    padding: 30,
    backgroundColor: 'color-light-100',
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
    backgroundColor: 'background-basic-color-4',
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
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
