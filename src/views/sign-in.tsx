import React from 'react';
import { View, ImageBackground } from 'react-native';
import { Button, Input, Layout, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { EyeIcon, EyeOffIcon, EmailIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import I18n from './../i18n/i18n';

export default ({ navigation }): React.ReactElement => {
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = (): void => {
    navigation && navigation.navigate('SignUp');
  };

  const onForgotPasswordButtonPress = (): void => {
    navigation && navigation.navigate('ForgotPassword');
  };

  const onSignInButtonPress = (): void => {
    navigation && navigation.navigate('Homepage');
  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.imageAuth}
          source={require('../assets/images/auth-background.png')}>
        </ImageBackground>
        <Text
          style={styles.signInLabel}
          category='s1'
          status='control'>
          Sign in to your account {I18n.t('hello')}
        </Text>
      </View>
      <Layout
        style={styles.formContainer}
        level='1'>
        <Input
          placeholder='E-Mail'
          icon={EmailIcon}
          value={email}
          onChangeText={setEmail}
        />
        <Input
          style={styles.passwordInput}
          placeholder='Password'
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
            Forgot your password?
          </Button>
        </View>
      </Layout>
      <Button
        style={styles.signInButton}
        size='giant'
        onPress={onSignInButtonPress}>
        SIGN IN
      </Button>
      <Button
        style={styles.signUpButton}
        appearance='ghost'
        status='basic'
        onPress={onSignUpButtonPress}>
        Don't have an account? Create
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
});
