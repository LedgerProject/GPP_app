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
} from '@ui-kitten/components';
import { EmailIcon, EyeIcon, EyeOffIcon, PersonIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';

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

  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = (): void => {
    navigation && navigation.goBack();
  };

  const onSignInButtonPress = (): void => {
    navigation && navigation.navigate('SignIn');
  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const onConfirmPasswordIconPress = (): void => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
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
          Please register to Global Passport Project
        </Text>
      </View>
      <Layout
        style={styles.formContainer}
        level='1'>
        <Input
          autoCapitalize='none'
          placeholder='First Name'
          icon={PersonIcon}
          value={firstName}
          onChangeText={setFirstName}
        />
        <Input
          style={styles.nameInput}
          autoCapitalize='none'
          placeholder='Last Name'
          icon={PersonIcon}
          value={lastName}
          onChangeText={setLastName}
        />
        <Input
          style={styles.emailInput}
          autoCapitalize='none'
          placeholder='E-Mail'
          icon={EmailIcon}
          value={email}
          onChangeText={setEmail}
        />
        <Input
          style={styles.emailInput}
          autoCapitalize='none'
          placeholder='Confirm E-Mail'
          icon={EmailIcon}
          value={confirmEmail}
          onChangeText={setConfirmEmail}
        />
        <Input
          style={styles.passwordInput}
          autoCapitalize='none'
          secureTextEntry={!passwordVisible}
          placeholder='Password'
          icon={passwordVisible ? EyeIcon : EyeOffIcon}
          value={password}
          onChangeText={setPassword}
          onIconPress={onPasswordIconPress}
        />
        <Input
          style={styles.passwordInput}
          autoCapitalize='none'
          secureTextEntry={!confirmPasswordVisible}
          placeholder='Confirm Password'
          icon={confirmPasswordVisible ? EyeIcon : EyeOffIcon}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onIconPress={onConfirmPasswordIconPress}
        />
        <CheckBox
          style={styles.termsCheckBox}
          textStyle={styles.termsCheckBoxText}
          text='I read and agree to Terms & Conditions'
          checked={termsAccepted}
          onChange={(checked: boolean) => setTermsAccepted(checked)}
        />
      </Layout>
      <Button
        style={styles.signUpButton}
        size='giant'
        onPress={onSignUpButtonPress}>
        SIGN UP
      </Button>
      <Button
        style={styles.signInButton}
        appearance='ghost'
        status='basic'
        onPress={onSignInButtonPress}>
        Already have an account? Sign In
      </Button>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
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
    marginBottom: 8
  },
  signUpButton: {
    marginHorizontal: 16,
  },
  signInButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
});

