// React import
import React, { useEffect} from 'react';

// React Native import
import { View, ImageBackground } from 'react-native';

// Environment import
import { AppOptions } from '../services/app-env';

// Locale import
import I18n from './../i18n/i18n';

// UIKitten import
import { Button, Input, Layout, StyleService, Text, useStyleSheet, Modal } from '@ui-kitten/components';

// Components import
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { EyeIcon, EyeOffIcon, EmailIcon } from '../components/icons';

// Zenroom import
import { sanitizeAnswers, recoveryKeypair, verifyAnswers } from '../services/zenroom/zenroom-service';
import clientSideContract from '../services/zenroom/zenroom-client-contract.zen';

// Redux import
import { useDispatch, useSelector } from 'react-redux';
import { manageToken } from '../redux/tokenSlice';
import { manageEmail } from '../redux/emailSlice';
import { selectLastLoginEmail, manageLastLoginEmail } from '../redux/lastLoginEmailSlice';
import { managePrivateKey } from '../redux/privateKeySlice';
import { managePublicKey } from '../redux/publicKeySlice';

// Axios import
import axios from 'axios';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { getPBKDFPublicKey } from '../services/user.service';

export default ({ navigation }): React.ReactElement => {
  const [email, setEmail] = React.useState<string>();
  const [showAnswers, setShowAnswers] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>();
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const styles = useStyleSheet(themedStyles);
  const [loading, setLoading] = React.useState(false);
  const [answer1, setAnswer1] = React.useState<string>();
  const [answer2, setAnswer2] = React.useState<string>();
  const [answer3, setAnswer3] = React.useState<string>();
  const [answer4, setAnswer4] = React.useState<string>();
  const [answer5, setAnswer5] = React.useState<string>();

  const lastLoginEmail = useSelector(selectLastLoginEmail);

  // Redux
  const dispatch = useDispatch();

  // Use effect
  useEffect(() => {
    setPassword('');
    setShowAnswers(false);
    setAnswer1('');
    setAnswer2('');
    setAnswer3('');
    setAnswer4('');
    setAnswer5('');
    setEmail('test4@stefanobaldassarre.it');
    setPassword('12345678');
  }, []);

  // Open the sign-up page
  const onSignUpButtonPress = (): void => {
    setShowAnswers(false);
    setAnswer1('');
    setAnswer2('');
    setAnswer3('');
    setAnswer4('');
    setAnswer5('');

    navigation && navigation.navigate('SignUp');
  };

  // Open the forgot password page
  const onForgotPasswordButtonPress = (): void => {
    dispatch(manageEmail(email));

    setShowAnswers(false);
    setAnswer1('');
    setAnswer2('');
    setAnswer3('');
    setAnswer4('');
    setAnswer5('');

    navigation && navigation.navigate('ForgotPassword');
  };

  // Show / hide the password
  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  // Try to login
  const onSignInCheckButtonPress = async (): Promise<void> => {
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

    // Check if current email match the last login email
    if (email !== lastLoginEmail) {
      if (showAnswers === false) {
        // Show answers
        setShowAnswers(true);
      } else {
        // Check if answered 3 questions
        let countAnswered = 0;

        if (answer1) {
          countAnswered++;
        }

        if (answer2) {
          countAnswered++;
        }

        if (answer3) {
          countAnswered++;
        }

        if (answer4) {
          countAnswered++;
        }

        if (answer5) {
          countAnswered++;
        }

        if (countAnswered !== 3) {
          setError(I18n.t('Please answer the 3 questions during registration'));
          setmodalVisible(true);
          return;
        }

        // Set the answers
        let answers = {
          question1: 'null',
          question2: 'null',
          question3: 'null',
          question4: 'null',
          question5: 'null',
        };

        if (answer1) {
          answers.question1 = answer1.trim();
        }

        if (answer2) {
          answers.question2 = answer2.trim();
        }

        if (answer3) {
          answers.question3 = answer3.trim();
        }

        if (answer4) {
          answers.question4 = answer4.trim();
        }

        if (answer5) {
          answers.question5 = answer5.trim();
        }

        // Sanitize the answers
        answers = sanitizeAnswers(answers);

        // Show the spinner
        setLoading(true);

        // Get the e-mail public key and pbkdf
        let emailPublicKey = '';
        let emailPBKDF = '';
        const pbkdfPublicKeyResponse = await getPBKDFPublicKey(email);

        switch (pbkdfPublicKeyResponse.code) {
          case '10':
            setLoading(false);
            setError(I18n.t('An error has occurred, please try again'));
            setmodalVisible(true);
            return;
          break;

          case '20':
            setLoading(false);
            setError(I18n.t('The specified e-mail not exists'));
            setmodalVisible(true);
            return;
          break;

          case '202':
            emailPublicKey = pbkdfPublicKeyResponse.publicKey;
            emailPBKDF = pbkdfPublicKeyResponse.pbkdf;
          break;
        }

        // Verify if the generated public key match the e-mail public key
        const publicKeyMatch = await verifyAnswers(clientSideContract, answers, emailPBKDF, emailPublicKey);

        if (publicKeyMatch) {
          // Generate private key and public key
          const keypairData = await recoveryKeypair(clientSideContract, answers, emailPBKDF);

          // Get public key and private key
          const publicKey = keypairData.user.keypair.public_key;
          const privateKey = keypairData.user.keypair.private_key;

          // Proceed with sign-in (saving the private key and public key locally)
          onSignInButtonPress(privateKey, publicKey);
        } else {
          // Answers not correct
          setLoading(false);
          setError(I18n.t('The answers are incorrect'));
          setmodalVisible(true);
        }
      }
    } else {
      // Proceed with sign-in
      onSignInButtonPress();
    }
  };

  // Sign-in procedure
  const onSignInButtonPress = (private_Key = null, public_Key = null): void => {
    // Show the spinner
    setLoading(true);
    // console.log(private_Key);
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

        setPassword('');
        setShowAnswers(false);
        setAnswer1('');
        setAnswer2('');
        setAnswer3('');
        setAnswer4('');
        setAnswer5('');

        // Save locally the token
        dispatch(manageToken(response.data.token));

        // Save locally private key, public key, last login mail
        if (private_Key) {
          dispatch(managePrivateKey(private_Key));
        }

        if (public_Key) {
          dispatch(managePublicKey(public_Key));
        }

        dispatch(manageLastLoginEmail(email));

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
        setError(I18n.t(errDescription));
        setmodalVisible(true);
      });
  };

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>
        <Spinner
          visible={loading}
          textContent={I18n.t('Please wait') + '...'}
          textStyle={styles.spinnerTextStyle}
        />

        <View style={styles.logoContainer}>
          <ImageBackground
            style={styles.imageAuth}
            source={require('../assets/images/logo-red.png')}>
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
            placeholder={I18n.t('E-Mail')}
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

          { showAnswers && (
            <View>
              <Text
                style={styles.selectQuestions}>
                {I18n.t('Please answer 3 of these 5 questions')}
              </Text>

              <Text
                style={styles.enterFieldLabel}>
                {I18n.t('Where my parents met?')}
              </Text>

              <Input
                placeholder={I18n.t('Answer')}
                value={answer1}
                onChangeText={setAnswer1}
              />

              <Text
                style={styles.enterFieldLabel}>
                {I18n.t('What is the name of your first pet?')}
              </Text>

              <Input
                placeholder={I18n.t('Answer')}
                value={answer2}
                onChangeText={setAnswer2}
              />

              <Text
                style={styles.enterFieldLabel}>
                {I18n.t('What is your home town?')}
              </Text>

              <Input
                placeholder={I18n.t('Answer')}
                value={answer3}
                onChangeText={setAnswer3}
              />

              <Text
                style={styles.enterFieldLabel}>
                {I18n.t('What is the name of your first teacher?')}
              </Text>

              <Input
                placeholder={I18n.t('Answer')}
                value={answer4}
                onChangeText={setAnswer4}
              />

              <Text
                style={styles.enterFieldLabel}>
                {I18n.t('What is the surname of your mother before wedding?')}
              </Text>

              <Input
                placeholder={I18n.t('Answer')}
                value={answer5}
                onChangeText={setAnswer5}
              />
            </View>
          )}

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
          onPress={onSignInCheckButtonPress}>
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
  enterFieldLabel: {
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 4,
    color: 'color-light-100',
  },
  selectQuestions: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#FFFFFF',
  },
});
