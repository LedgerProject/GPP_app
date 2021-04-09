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
import { AppOptions } from '../services/app-env';
import Spinner from 'react-native-loading-spinner-overlay';

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
  const [loading, setLoading] = React.useState(false);
  const [step2, setStep2] = React.useState(false);
  const styles = useStyleSheet(themedStyles);
  const [answer1, setAnswer1] = React.useState<string>();
  const [answer2, setAnswer2] = React.useState<string>();
  const [answer3, setAnswer3] = React.useState<string>();
  const [answer4, setAnswer4] = React.useState<string>();
  const [answer5, setAnswer5] = React.useState<string>();

  const onStep2ButtonPress = (): void => {
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
      setStep2(true);
  };

  const onBackButtonPress = (): void => {
    setStep2(false);
  };

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
    if (!answer1) {
      setError(I18n.t('Please fill Answer 1'));
      setmodalVisible(true);
      return;
    }
    if (!answer2) {
      setError(I18n.t('Please fill Answer 2'));
      setmodalVisible(true);
      return;
    }
    if (!answer3) {
      setError(I18n.t('Please fill Answer 3'));
      setmodalVisible(true);
      return;
    }
    if (!answer4) {
      setError(I18n.t('Please fill Answer 4'));
      setmodalVisible(true);
      return;
    }
    if (!answer5) {
      setError(I18n.t('Please fill Answer 5'));
      setmodalVisible(true);
      return;
    }

    setLoading(true);
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
        setLoading(false);
        // handle success
        // navigation && navigation.navigate('Homepage');
        setSuccess(I18n.t('Congratulations! Registration completed'));
        setmodalVisible(true);
      })
      .catch(function () { // error) {
        setLoading(false);
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
            style={styles.signUpLabel}
            category='s1'
            status='control'>
            {I18n.t('Please register to Global Passport Project')}
          </Text>
        </View>
        { step2 === false && (
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
        <Button
          style={styles.signUpButton}
          size='giant'
          onPress={onStep2ButtonPress}>
           {I18n.t('CONTINUE')}
        </Button>
      </Layout>
      )}
      { step2 === true && (
      <Layout
          style={styles.formContainer}
          level='1'>
        <Button
          style={styles.signInButton}
          appearance='ghost'
          status='basic'
          onPress={onBackButtonPress}>
          {I18n.t('Go back')}
        </Button>
        <Text
            style={styles.enterEmailLabel}>
            {I18n.t('Question 1')}
          </Text>
          <Input
          style={styles.nameInput}
            placeholder={I18n.t('Answer 1')}
            value={answer1}
            onChangeText={setAnswer1}
          />
          <Text
            style={styles.enterEmailLabel}>
            {I18n.t('Question 2')}
          </Text>
          <Input
          style={styles.nameInput}
            placeholder={I18n.t('Answer 2')}
            value={answer2}
            onChangeText={setAnswer2}
          />

<Text
            style={styles.enterEmailLabel}>
            {I18n.t('Question 3')}
          </Text>
          <Input
          style={styles.nameInput}
            placeholder={I18n.t('Answer 3')}
            value={answer3}
            onChangeText={setAnswer3}
          />

<Text
            style={styles.enterEmailLabel}>
            {I18n.t('Question 4')}
          </Text>
          <Input
          style={styles.nameInput}
            placeholder={I18n.t('Answer 4')}
            value={answer4}
            onChangeText={setAnswer4}
          />

<Text
            style={styles.enterEmailLabel}>
            {I18n.t('Question 5')}
          </Text>
          <Input
          style={styles.nameInput}
            placeholder={I18n.t('Answer 5')}
            value={answer5}
            onChangeText={setAnswer5}
          />
        <Button
          style={styles.signUpButton}
          size='giant'
          onPress={onSignUpButtonPress}>
           {I18n.t('SIGN UP')}
        </Button>
      </Layout>
      )}

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
  spinnerTextStyle: {
    color: '#FFF',
  },
  enterEmailLabel: {
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
});

