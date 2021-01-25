import React from 'react';
import { View, ImageBackground } from 'react-native';
import {
  Button,
  CheckBox,
  Input,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  Modal,
} from '@ui-kitten/components';
import { EmailIcon, EyeIcon, EyeOffIcon, PersonIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { KeyboardAvoidingView } from '../services/3rd-party';
import axios from 'axios';
import I18n from './../i18n/i18n';
import { AppOptions } from '../services/app-options';

export default ({ navigation }): React.ReactElement => {

  const [firstName, setFirstName] = React.useState<string>();
  const [lastName, setLastName] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  const [confirmEmail, setConfirmEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [confirmPassword, setConfirmPassword] = React.useState<string>();
  const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState<boolean>(false);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [success, setSuccess] = React.useState<string>();
  const [error, setError] = React.useState<string>();

  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = (): void => {
    // navigation && navigation.goBack();
    setError('');
    setSuccess('');
    if (!firstName) {
      setError(I18n.t('Please fill First Name'));
      setmodalVisible(true);
      return;
    }
    if (!lastName) {
      setError(I18n.t('Please fill Last Name'));
      setmodalVisible(true);
      return;
    }
    if (!email) {
      setError(I18n.t('Please fill Email'));
      setmodalVisible(true);
      return;
    }
    if (!confirmEmail) {
      setError(I18n.t('Please confirm Email'));
      setmodalVisible(true);
      return;
    }
    if (email !== confirmEmail) {
      setError(I18n.t('Email and confirm Email do not match'));
      setmodalVisible(true);
      return;
    }
    if (!password) {
      setError(I18n.t('Please fill Password'));
      setmodalVisible(true);
      return;
    }
    if (!confirmPassword) {
      setError(I18n.t('Please confirm Password'));
      setmodalVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setError(I18n.t('Password and confirm Password do not match'));
      setmodalVisible(true);
      return;
    }
    if (!termsAccepted) {
      setError(I18n.t('Please accept terms and conditions'));
      setmodalVisible(true);
      return;
    }
    const postParams = {
        userType: 'user',
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      };
      axios
      .post(AppOptions.getServerUrl() + 'users/signup', postParams)
      .then(function (response) {
        // handle success
        // navigation && navigation.navigate('Homepage');
        setSuccess(I18n.t('Congratulations! Registration completed'));
        setmodalVisible(true);
      })
      .catch(function () { // error) {
        // alert(error.message);
        setError(I18n.t('An error has occurred, please try again'));
        setmodalVisible(true);
        return;
      });

  };

  const onSignInButtonPress = (): void => {
    setmodalVisible(false);
    navigation && navigation.navigate('SignIn');
  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const onConfirmPasswordIconPress = (): void => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.headerContainer}>
          <ImageBackground
            style={styles.imageAuth}
            source={require('../assets/images/auth-background.png')}>
          </ImageBackground>
          <Text
            style={styles.signUpLabel}
            category='s1'
            status='control'>
            {I18n.t('Please register to Global Passport Project')}
          </Text>
        </View>
        <Layout
          style={styles.formContainer}
          level='1'>
          <Input
            autoCapitalize='none'
            placeholder={I18n.t('First Name')}
            icon={PersonIcon}
            value={firstName}
            onChangeText={setFirstName}
          />
          <Input
            style={styles.nameInput}
            autoCapitalize='none'
            placeholder={I18n.t('Last Name')}
            icon={PersonIcon}
            value={lastName}
            onChangeText={setLastName}
          />
          <Input
            style={styles.emailInput}
            autoCapitalize='none'
            placeholder={I18n.t('E-mail')}
            icon={EmailIcon}
            keyboardType={'email-address'}
            value={email}
            onChangeText={setEmail}
          />
          <Input
            style={styles.emailInput}
            autoCapitalize='none'
            placeholder={I18n.t('Confirm E-Mail')}
            icon={EmailIcon}
            keyboardType={'email-address'}
            value={confirmEmail}
            onChangeText={setConfirmEmail}
          />
          <Input
            style={styles.passwordInput}
            autoCapitalize='none'
            secureTextEntry={!passwordVisible}
            placeholder={I18n.t('Password')}
            icon={passwordVisible ? EyeIcon : EyeOffIcon}
            value={password}
            onChangeText={setPassword}
            onIconPress={onPasswordIconPress}
          />
          <Input
            style={styles.passwordInput}
            autoCapitalize='none'
            secureTextEntry={!confirmPasswordVisible}
            placeholder={I18n.t('Confirm Password')}
            icon={confirmPasswordVisible ? EyeIcon : EyeOffIcon}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onIconPress={onConfirmPasswordIconPress}
          />
          <CheckBox
            style={styles.termsCheckBox}
            textStyle={styles.termsCheckBoxText}
            text={I18n.t('I read and agree to Terms & Conditions')}
            checked={termsAccepted}
            onChange={(checked: boolean) => setTermsAccepted(checked)}
          />
        </Layout>
        <Button
          style={styles.signUpButton}
          size='giant'
          onPress={onSignUpButtonPress}>
           {I18n.t('SIGN UP')}
        </Button>
        <Button
          style={styles.signInButton}
          appearance='ghost'
          status='basic'
          onPress={onSignInButtonPress}>
          {I18n.t('Already have an account? Sign In')}
        </Button>
      </KeyboardAvoidingView>
      <Modal
      visible={ modalVisible }
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setmodalVisible(false)}
      >
      <Layout style={ styles.modal } >
      <Text style={ styles.modalText } status={error ? 'danger' : 'success' }>{error ? error : success}</Text>
      <Button
      status={error ? 'basic' : 'primary' }
      onPress={error ? () => setmodalVisible(false) : onSignInButtonPress}>
        { error ? I18n.t('CLOSE') : I18n.t('SIGN IN')}
        </Button>
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
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  nameInput: {
    marginTop: 8,
  },
  emailInput: {
    marginTop: 8,
  },
  passwordInput: {
    marginTop: 8,
  },
  termsCheckBox: {
    marginTop: 16,
  },
  termsCheckBoxText: {
    color: 'text-hint-color',
  },
  signUpLabel: {
    marginTop: 8,
    marginBottom: 8,
  },
  signUpButton: {
    marginHorizontal: 16,
  },
  signInButton: {
    marginVertical: 12,
    marginHorizontal: 16,
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
});

