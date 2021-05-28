// React import
import React, { useEffect, useState} from 'react';
import { View, ImageBackground } from 'react-native';

// Environment import
import { AppOptions } from '../services/app-env';

// Language import
import I18n from './../i18n/i18n';

// UIKitten import
import { Button, Input, Layout, Text, StyleService, useStyleSheet, Modal } from '@ui-kitten/components';
import { EmailIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

// Zenroom import
import { sanitizeAnswers, verifyAnswers } from '../services/zenroom/zenroom-service';
import clientSideContract from '../services/zenroom/zenroom-client-contract.zen';

// Redux import
import { useSelector } from 'react-redux';
import { selectEmail } from '../redux/emailSlice';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { getPBKDFPublicKey } from '../services/user.service';

export default ({ navigation }): React.ReactElement => {
  // workaround for Xiaomi fix
  const [email, setEmail] = useState('.');

  const lastLoginEmail = useSelector(selectEmail);
  const [answer1, setAnswer1] = React.useState<string>();
  const [answer2, setAnswer2] = React.useState<string>();
  const [answer3, setAnswer3] = React.useState<string>();
  const [answer4, setAnswer4] = React.useState<string>();
  const [answer5, setAnswer5] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [modalVisible, setmodalVisible] = React.useState(false);

  const styles = useStyleSheet(themedStyles);

  // Use effect
  useEffect(() => {
    // workaround for Xiaomi fix
    setTimeout(() => {
      // setEmail(lastLoginEmail);
      setEmail('');
    }, 1);
  }, []);

  // Open the login page
  const onBackToLoginButtonPress = (): void => {
    navigation && navigation.navigate('SignIn');
  };

  const onResetPasswordButtonPress = async (): Promise<void> => {
    // Initialize the error and success messages
    setError('');
    setSuccess('');

    // Check if the e-mail is entered
    if (!email) {
      setError(I18n.t('Please enter your e-mail'));
      setmodalVisible(true);
      return;
    }

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
      // The public key match, send an e-mail to reset the password
      const postParams = {
        email: email,
      };

      axios
        .post(AppOptions.getServerUrl() + 'user/reset-password', postParams)
        .then(function (response) {
          // Hide the spinner
          setLoading(false);

          // Get the data response
          const data = response.data.resetPasswordOutcome;

          switch (data.code) {
            case 10:
              setError(I18n.t('The specified e-mail not exists'));
            break;

            case 11:
              setError(I18n.t('The e-mail is empty'));
            break;

            case 20:
              setError(I18n.t('Request already done in the last 24 hours'));
            break;

            case 30:
              setError(I18n.t('An error has occurred, please try again'));
            break;

            case 202:
              setSuccess(I18n.t(
                'Congratulations! Password recovery link sent successfully to your email address',
                ));
            break;

            default:
              setError(data.message);
          }

          setmodalVisible(true);
        })
        .catch(function () {
          setLoading(false);
          setError(I18n.t('An error has occurred, please try again'));
          setmodalVisible(true);
        });
    } else {
      // Answers not correct
      setLoading(false);
      setError(I18n.t('The answers are incorrect'));
      setmodalVisible(true);
    }
  };

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <KeyboardAvoidingView>
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
            style={styles.forgotPasswordLabel}
            category='s1'
            status='control'>
            {I18n.t('Forgot password?')}
          </Text>
        </View>

        <Layout
          style={styles.formContainer}
          level='1'>
          <Text
            style={styles.selectQuestions}>
            {I18n.t('Please answer 3 of these 5 questions')}
          </Text>

          <Text
            style={styles.enterFieldLabel}>
            {I18n.t('Please enter your e-mail address')}
          </Text>

          <Input
            placeholder={I18n.t('E-Mail')}
            icon={EmailIcon}
            value={email}
            keyboardType={'email-address'}
            onChangeText={setEmail}
          />

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

          <Button
            style={styles.resetPasswordButton}
            size='giant'
            onPress={onResetPasswordButtonPress}>
            {I18n.t('RESET PASSWORD')}
          </Button>

          <Button
            style={styles.backToLoginButton}
            appearance='ghost'
            status='basic'
            onPress={onBackToLoginButtonPress}>
            {I18n.t('Back to login')}
          </Button>
        </Layout>
      </KeyboardAvoidingView>

      <Modal
        visible={ modalVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={ () => setmodalVisible(false)}>
        <Layout style={ styles.modal }>
          <Text style={ styles.modalText } status={error ? 'danger' : 'success' }>{error ? error : success}</Text>
          <Button
            status={error ? 'basic' : 'primary' }
            onPress={ () => setmodalVisible(false) }>
            { I18n.t('CLOSE') }
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
  forgotPasswordLabel: {
    marginTop: 8,
    marginBottom: 8,
  },
  enterFieldLabel: {
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 4,
    color: 'color-light-100',
  },
  resetPasswordButton: {
    margin: 16,
  },
  backToLoginButton: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  selectQuestions: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
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
