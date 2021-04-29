import React, { useEffect} from 'react';
import { View, ImageBackground } from 'react-native';
import { Button, CheckBox, Input, Layout, StyleService, Text, useStyleSheet, Modal, List } from '@ui-kitten/components';
import { EmailIcon, EyeIcon, EyeOffIcon, PersonIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { KeyboardAvoidingView } from '../services/3rd-party';
import axios from 'axios';
import I18n from './../i18n/i18n';
import { AppOptions } from '../services/app-env';
import Spinner from 'react-native-loading-spinner-overlay';
import { QuestionItem } from './sign-up/question-item.component';

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

  const onStep2ButtonPress = (): void => {
      setLoading(true);
      // navigation && navigation.goBack();
      setError('');
      setSuccess('');
      if (!firstName) {
        setError(I18n.t('Please fill First Name'));
        setmodalVisible(true);
        setLoading(false);
        return;
      }
      if (!lastName) {
        setError(I18n.t('Please fill Last Name'));
        setmodalVisible(true);
        setLoading(false);
        return;
      }
      if (!email) {
        setError(I18n.t('Please fill Email'));
        setmodalVisible(true);
        setLoading(false);
        return;
      }
      if (!confirmEmail) {
        setError(I18n.t('Please confirm Email'));
        setmodalVisible(true);
        setLoading(false);
        return;
      }
      if (email !== confirmEmail) {
        setError(I18n.t('Email and confirm Email do not match'));
        setmodalVisible(true);
        setLoading(false);
        return;
      }
      if (!password) {
        setError(I18n.t('Please fill Password'));
        setmodalVisible(true);
        setLoading(false);
        return;
      }
      if (!confirmPassword) {
        setError(I18n.t('Please confirm Password'));
        setmodalVisible(true);
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError(I18n.t('Password and confirm Password do not match'));
        setmodalVisible(true);
        setLoading(false);
        return;
      }
      if (!termsAccepted) {
        setError(I18n.t('Please accept terms and conditions'));
        setmodalVisible(true);
        setLoading(false);
        return;
      }
      const postParams = {
        email: email,
      };
      /*axios
      .post(AppOptions.getServerUrl() + 'users/signup', postParams)
      .then(function (response) {
        setLoading(false);
        setStep2(true);
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
      });*/


      axios
      .post(AppOptions.getServerUrl() + 'users/pbkdf', postParams)
      .then(function (response) {
        const data = response.data.pbkdfResponse;
        setLoading(false);
        if (data.code === '20') {
          setError(I18n.t('Email already exists'));
          setmodalVisible(true);
        } else if (data.code === '202') {
          // PBKDF generated
          setPbkdf(data.pbkdf);
          setStep2(true);
        }
        // handle success
        // navigation && navigation.navigate('Homepage');
        // setSuccess(I18n.t('Congratulations! Registration completed'));
        // setmodalVisible(true);
      })
      .catch(function () {
      // .catch(function (error) { // error) {
        // console.log(error);
        setLoading(false);
        // alert(error.message);
        setError(I18n.t('An error has occurred, please try again'));
        setmodalVisible(true);
        return;
      });
  };

  const onBackButtonPress = (): void => {
    setStep2(false);
  };

  const onSignUpButtonPress = (): void => {
    // navigation && navigation.goBack();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!firstName) {
      setError(I18n.t('Please fill First Name'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (!lastName) {
      setError(I18n.t('Please fill Last Name'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (!email) {
      setError(I18n.t('Please fill Email'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (!confirmEmail) {
      setError(I18n.t('Please confirm Email'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (email !== confirmEmail) {
      setError(I18n.t('Email and confirm Email do not match'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (!password) {
      setError(I18n.t('Please fill Password'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (!confirmPassword) {
      setError(I18n.t('Please confirm Password'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError(I18n.t('Password and confirm Password do not match'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (!termsAccepted) {
      setError(I18n.t('Please accept terms and conditions'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    /*if (!answer1) {
      setError(I18n.t('Please fill Answer 1'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (!answer2) {
      setError(I18n.t('Please fill Answer 2'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (!answer3) {
      setError(I18n.t('Please fill Answer 3'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (!answer4) {
      setError(I18n.t('Please fill Answer 4'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }
    if (!answer5) {
      setError(I18n.t('Please fill Answer 5'));
      setmodalVisible(true);
      setLoading(false);
      return;
    }*/

    const answers = {
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

    // answers = sanitizeAnswers(answers);


    // setLoading(true);
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

  const onPressItem = (index: number, item: any): void => {
    if (answered === 3) {
      setError(I18n.t('You cannot select more than 3 questions'));
      setmodalVisible(true);
    } else {
      setCurrentAnswer(index);
      setCurrentQuestion(questions[index].question);
      setAnswer(questions[index].answer);
      setmodalAnswerVisible(true);
    }
  };

  const renderQuestionItem = ({ item, index }) => (
    <QuestionItem
      index={index}
      item={item}
      onListviewButtonPress={onPressItem}
      />
  );

  useEffect(() => {
    // console.log(getSafetyQuestions('en_GB'));
    setQuestions([
      {'question': I18n.t('Where my parents met?'), 'answer': '' },
      {'question': I18n.t('What is the name of your first pet?'), 'answer': '' },
      {'question': I18n.t('What is your home town?'), 'answer': '' },
      {'question': I18n.t('What is the name of your first teacher?'), 'answer': '' },
      {'question': I18n.t('What is the surname of your mother before wedding?'), 'answer': '' },
    ]);
  }, []);

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
        <Button
          style={styles.signInButton}
          appearance='ghost'
          status='basic'
          onPress={onSignInButtonPress}>
          {I18n.t('Already have an account? Sign In')}
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

        <Text style={styles.selectQuestions}>{I18n.t('Please Select 3 Questions of 5')}</Text>

        <List data={questions} renderItem={renderQuestionItem} />

        { answered === 3 && (
        <Button
          style={styles.signUpButton}
          size='giant'
          onPress={onSignUpButtonPress}>
           {I18n.t('SIGN UP')}
        </Button>
        )}
      </Layout>
      )}


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
      <Modal
      visible={ modalAnswerVisible }
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setmodalAnswerVisible(false)}
      >
      <Layout style={ styles.modalQuestions } >
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
  },
  signInButton: {
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
  },
  buttonRight: {
    width: '50%', height: 'auto', flex: 1, marginLeft: 5, marginRight: 10, alignItems: 'center',
  },
  buttonLeft: {
    width: '50%', height: 'auto', flex: 1, marginLeft: 10, marginRight: 5, alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row', marginTop: 10,
  },
  button: { width: '100%' },
});

