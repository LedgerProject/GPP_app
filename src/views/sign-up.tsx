import React, { useEffect, useCallback } from 'react';
import { View, ImageBackground, Linking } from 'react-native';
import { Button, CheckBox, Input, Layout, StyleService, Text, useStyleSheet, Modal, List } from '@ui-kitten/components';
import { EmailIcon, EyeIcon, EyeOffIcon, PersonIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { AppOptions } from '../services/app-env';
import { QuestionItem } from './sign-up/question-item.component';
import axios from 'axios';
import I18n from './../i18n/i18n';
import Spinner from 'react-native-loading-spinner-overlay';

// Zenroom import
import { sanitizeAnswers, recoveryKeypair } from '../services/zenroom/zenroom-service';
import clientSideContract from '../services/zenroom/zenroom-client-contract.zen';

// Redux import
import { useDispatch } from 'react-redux';
import { manageLastLoginEmail } from '../app/lastLoginEmailSlice';
import { managePrivateKey } from '../app/privateKeySlice';
import { managePublicKey } from '../app/publicKeySlice';

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
  const [modalAnswerVisible, setmodalAnswerVisible] = React.useState(false);
  const [success, setSuccess] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [step2, setStep2] = React.useState(false);
  const styles = useStyleSheet(themedStyles);
  const [answer, setAnswer] = React.useState<string>();
  const [answered, setAnswered] = React.useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = React.useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = React.useState<string>();
  const [questions, setQuestions] = React.useState([]);
  const [pbkdf, setPbkdf] = React.useState<string>();
  const termsAndConditionsUrl = AppOptions.getTermsAndConditionsUrl();
  // Redux
  const dispatch = useDispatch();

  // Use effect
  useEffect(() => {
    setQuestions([
      {'question': I18n.t('Where my parents met?'), 'answer': '' },
      {'question': I18n.t('What is the name of your first pet?'), 'answer': '' },
      {'question': I18n.t('What is your home town?'), 'answer': '' },
      {'question': I18n.t('What is the name of your first teacher?'), 'answer': '' },
      {'question': I18n.t('What is the surname of your mother before wedding?'), 'answer': '' },
    ]);
  }, []);

  // Show / hide password
  const onPasswordIconPress = async (): Promise<void> => {
    setPasswordVisible(!passwordVisible);
  };

  // Show / hide confirm password
  const onConfirmPasswordIconPress = (): void => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Open the sign-in page
  const onSignInButtonPress = (): void => {
    setmodalVisible(false);
    navigation && navigation.navigate('SignIn');
  };

  // Sign-up: step 1
  const onSignUpStep1ButtonPress = (): void => {
    // Initialize the error and success messages
    setError('');
    setSuccess('');

    // Check if first name is entered
    if (!firstName) {
      setError(I18n.t('Please enter your first name'));
      setmodalVisible(true);
      return;
    }

    // Check if last name is entered
    if (!lastName) {
      setError(I18n.t('Please enter your last name'));
      setmodalVisible(true);
      return;
    }

    // Check if the email is entered
    if (!email) {
      setError(I18n.t('Please enter your e-mail'));
      setmodalVisible(true);
      return;
    }

    // Check if confirmation email is entered
    if (!confirmEmail) {
      setError(I18n.t('Please confirm your e-mail'));
      setmodalVisible(true);
      return;
    }

    // Check if the confirmation email match the specified email
    if (email !== confirmEmail) {
      setError(I18n.t('The confirmation email does not match the specified email'));
      setmodalVisible(true);
      return;
    }

    // Check if the password is entered
    if (!password) {
      setError(I18n.t('Please enter the password'));
      setmodalVisible(true);
      return;
    }

    // Check if the confirmation password is entered
    if (!confirmPassword) {
      setError(I18n.t('Please confirm the password'));
      setmodalVisible(true);
      return;
    }

    // Check if the confirmation password match the specified password
    if (password !== confirmPassword) {
      setError(I18n.t('The confirmation password does not match the specified password'));
      setmodalVisible(true);
      return;
    }

    // Check if accepted terms and conditions
    if (!termsAccepted) {
      setError(I18n.t('Please accept terms and conditions'));
      setmodalVisible(true);
      return;
    }

    // Show the spinner
    setLoading(true);

    // Get the PBKDF from the server, sending the user e-mail
    const postParams = {
      email: email,
    };

    axios
      .post(AppOptions.getServerUrl() + 'users/pbkdf', postParams)
      .then(function (response) {
        // Get the PBKDF
        const data = response.data.pbkdfResponse;

        // Hide the spinner
        setLoading(false);

        // Check if the e-mail already exists into the database
        if (data.code === '20') {
          setError(I18n.t('The specified e-mail already exists'));
          setmodalVisible(true);
        } else if (data.code === '202') {
          // PBKDF generated
          setPbkdf(data.pbkdf);

          // Show the step 2
          setStep2(true);
        } else {
          setError(I18n.t('An error has occurred, please try again'));
          setmodalVisible(true);
        }
      })
      .catch(function () {
        // Hide the spinner
        setLoading(false);

        setError(I18n.t('An error has occurred, please try again'));
        setmodalVisible(true);
      return;
    });
  };

  // Render the questions list
  const renderQuestionItem = ({ item, index }) => (
    <QuestionItem
      index={index}
      item={item}
      onListviewButtonPress={onPressItem}/>
  );

  // Let the user enter the answer
  const onPressItem = (index: number, item: any): void => {
    // Check if yet answered to 3 questions
    if (answered === 3) {
      setError(I18n.t('You cannot select more than 3 questions'));
      setmodalVisible(true);
    } else {
      // Enter the answer
      setCurrentAnswer(index);
      setCurrentQuestion(questions[index].question);
      setAnswer(questions[index].answer);
      setmodalAnswerVisible(true);
    }
  };

  // Confirm the answer entered
  const onConfirmButtonPress = (index): void => {
    const questions_array = [];
    let count: number = 0;

    questions.forEach( (question, qindex) => {
      if (index === qindex) {
        question.answer = answer.trim();
      }

      if (question.answer) {
        count++;
      }

      questions_array.push(question);
    });

    setQuestions(questions_array);
    setAnswered(count);
    setmodalAnswerVisible(false);
  };

  // Back button from questions
  const onBackButtonPress = (): void => {
    setStep2(false);
  };

  // Sign-up: step 2
  const onSignUpStep2ButtonPress = async (): Promise<void> => {
    // Set the answers
    let answers = {
      question1: 'null',
      question2: 'null',
      question3: 'null',
      question4: 'null',
      question5: 'null',
    };

    if (questions[0].answer) {
      answers.question1 = questions[0].answer;
    }
    if (questions[1].answer) {
      answers.question2 = questions[1].answer;
    }
    if (questions[2].answer) {
      answers.question3 = questions[2].answer;
    }
    if (questions[3].answer) {
      answers.question4 = questions[3].answer;
    }
    if (questions[4].answer) {
      answers.question5 = questions[4].answer;
    }

    // Sanitize the answers
    answers = sanitizeAnswers(answers);

    // Show the spinner
    setLoading(true);

    // Generate the public and private key
    const keypairData = await recoveryKeypair(clientSideContract, answers, pbkdf);

    // Get public key and private key
    const publicKey = keypairData.user.keypair.public_key;
    const privateKey = keypairData.user.keypair.private_key;

    // Save locally the keypair and the last login email
    dispatch(managePublicKey(publicKey));
    dispatch(managePrivateKey(privateKey));
    dispatch(manageLastLoginEmail(email));

    // Proceed with user registration
    const postParams = {
      userType: 'user',
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      pbkdf: pbkdf,
      publicKey: publicKey,
    };

    axios
      .post(AppOptions.getServerUrl() + 'users/signup', postParams)
      .then(function (response) {
        // Hide the spinner
        setLoading(false);

        // Show a success message
        setSuccess(I18n.t('Congratulations! Registration completed'));
        setmodalVisible(true);

        // Reset the registration inputs
        setStep2(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setConfirmEmail('');
        setPassword('');
        setConfirmPassword('');
        setTermsAccepted(false);
        const questions_array = [];
        questions.forEach( (question) => {
          question.answer = '';
          questions_array.push(question);
        });
        setQuestions(questions_array);
        setAnswered(0);

        // Open the login page
        navigation && navigation.navigate('SignIn');
      })
      .catch(function (err) {
        // Hide the spinner
        setLoading(false);

        // Show an error message
        setError(I18n.t('An error has occurred, please try again'));
        setmodalVisible(true);
      });
  };

  const onReadTermsButtonPress = () =>
    Linking.canOpenURL(termsAndConditionsUrl).then(() => {
      Linking.openURL(termsAndConditionsUrl);
    });

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>
        <Spinner
          visible={loading}
          textContent={I18n.t('Loading') + '...'}
          textStyle={styles.spinnerTextStyle}/>

        <View style={styles.logoContainer}>
          <ImageBackground
            style={styles.imageAuth}
            source={require('../assets/images/red-logo.png')}>
          </ImageBackground>
        </View>

        <View style={styles.headerContainer}>
          <Text
            style={styles.signUpLabel}
            category='s1'
            status='control'>
            {I18n.t('Please register to Global Passport Project')}
          </Text>
        </View>

        { step2 === false && ( // Registration step 1
          <Layout
            style={styles.formContainer}
            level='1'>
            <Input
              autoCapitalize='none'
              placeholder={I18n.t('First Name')}
              icon={PersonIcon}
              value={firstName}
              onChangeText={setFirstName}/>

            <Input
              style={styles.nameInput}
              autoCapitalize='none'
              placeholder={I18n.t('Last Name')}
              icon={PersonIcon}
              value={lastName}
              onChangeText={setLastName}/>

            <Input
              style={styles.emailInput}
              autoCapitalize='none'
              placeholder={I18n.t('E-Mail')}
              icon={EmailIcon}
              keyboardType={'email-address'}
              value={email}
              onChangeText={setEmail}/>

            <Input
              style={styles.emailInput}
              autoCapitalize='none'
              placeholder={I18n.t('Confirm E-Mail')}
              icon={EmailIcon}
              keyboardType={'email-address'}
              value={confirmEmail}
              onChangeText={setConfirmEmail}/>

            <Input
              style={styles.passwordInput}
              autoCapitalize='none'
              secureTextEntry={!passwordVisible}
              placeholder={I18n.t('Password')}
              icon={passwordVisible ? EyeIcon : EyeOffIcon}
              value={password}
              onChangeText={setPassword}
              onIconPress={onPasswordIconPress}/>

            <Input
              style={styles.passwordInput}
              autoCapitalize='none'
              secureTextEntry={!confirmPasswordVisible}
              placeholder={I18n.t('Confirm Password')}
              icon={confirmPasswordVisible ? EyeIcon : EyeOffIcon}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onIconPress={onConfirmPasswordIconPress}/>

            <Text
              style={styles.readTermsButton}
              status='basic'
              onPress={onReadTermsButtonPress}>
              {I18n.t('Please read Terms and Conditions')}
            </Text>

            <CheckBox
              style={styles.termsCheckBox}
              textStyle={styles.termsCheckBoxText}
              text={I18n.t('I read and agree to Terms & Conditions')}
              checked={termsAccepted}
              onChange={(checked: boolean) => setTermsAccepted(checked)}/>

            <Button
              style={styles.signUpButton}
              size='giant'
              onPress={onSignUpStep1ButtonPress}>
              {I18n.t('CONTINUE')}
            </Button>

            <Button
              style={styles.signInButton}
              appearance='ghost'
              status='basic'
              onPress={onSignInButtonPress}>
              {I18n.t('Already have an account? Sign In!')}
            </Button>
          </Layout>
        )}
        { step2 === true && ( // Registration step 2
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

            { answered === 3 && ( // Answered 3 questions
              <Button
                style={styles.signUpButton}
                size='giant'
                onPress={onSignUpStep2ButtonPress}>
                {I18n.t('SIGN UP')}
              </Button>
            )}

            <Text
              style={styles.selectQuestions}>
              {I18n.t('Please answer 3 of these 5 questions')}
            </Text>

            <List
              data={questions}
              renderItem={renderQuestionItem}
              style={styles.questionsContainer}/>
          </Layout>
        )}
      </KeyboardAvoidingView>

      <Modal
        visible={ modalVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setmodalVisible(false)}>
        <Layout style={ styles.modal }>
          <Text
            style={ styles.modalText }
            status={error ? 'danger' : 'success' }>
            {error ? error : success}
          </Text>

          <Button
            status={error ? 'basic' : 'primary' }
            onPress={error ? () => setmodalVisible(false) : onSignInButtonPress}>
            { error ? I18n.t('CLOSE') : I18n.t('SIGN IN')}
          </Button>
        </Layout>
      </Modal>

      <Modal
        visible={ modalAnswerVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setmodalAnswerVisible(false)}>
        <Layout style={ styles.modalQuestions }>
          <Text style={ styles.modalText }>{ currentQuestion }</Text>

          <Input style={styles.nameInput}
            placeholder={I18n.t('Your answer')}
            value={answer}
            onChangeText={setAnswer}
          />
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonLeft}>
              <Button style={styles.button} status={'basic'}
                onPress={() => setmodalAnswerVisible(false)}>
                {I18n.t('Cancel')}
              </Button>
            </View>

            <View style={styles.buttonRight}>
              <Button style={styles.button} status={'primary'}
                onPress={() => onConfirmButtonPress(currentAnswer) }>
                {I18n.t('Confirm')}
              </Button>
            </View>
          </View>
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
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: 'background-basic-color-4',
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
    marginBottom: 16,
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
    marginBottom: 10,
  },
  signInButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  questionsContainer: {
    marginVertical: 12,
    marginHorizontal: 16,
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
  modalQuestions: {
    textAlign: 'center',
    margin: 12,
    padding: 12,
    minWidth: 300,
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
  selectQuestions: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  buttonRight: {
    width: '50%',
    height: 'auto',
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonLeft: {
    width: '50%',
    height: 'auto',
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    width: '100%',
  },
  readTermsButton: {
    paddingHorizontal: 0,
    marginTop: 10,
    color: '#DDD',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
