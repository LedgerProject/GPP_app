import React from 'react';
import { View, ImageBackground } from 'react-native';
import { Button, Input, Layout, Text, StyleService, useStyleSheet } from '@ui-kitten/components';
import { EmailIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from './../i18n/i18n';

export default ({ navigation }): React.ReactElement => {
  const [email, setEmail] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);

  const styles = useStyleSheet(themedStyles);

  const onBackToLoginButtonPress = (): void => {
    navigation && navigation.navigate('SignIn');
  };

  const onResetPasswordButtonPress = (): void => {
    navigation && navigation.goBack();
  };

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <KeyboardAvoidingView>
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
            style={styles.forgotPasswordLabel}
            category='s1'
            status='control'>
            Forgot password?
          </Text>
        </View>
        <Layout
          style={styles.formContainer}
          level='1'>
          <Text
            style={styles.enterEmailLabel}>
            Please enter your email address
          </Text>
          <Input
            placeholder='E-Mail'
            icon={EmailIcon}
            value={email}
            onChangeText={setEmail}
          />
        </Layout>
        <Button
          style={styles.resetPasswordButton}
          size='giant'
          onPress={onResetPasswordButtonPress}>
          RESET PASSWORD
        </Button>
        <Button
          style={styles.backToLoginButton}
          appearance='ghost'
          status='basic'
          onPress={onBackToLoginButtonPress}>
          Back to login
        </Button>
      </KeyboardAvoidingView>
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
  forgotPasswordLabel: {
    marginTop: 8,
    marginBottom: 8,
  },
  enterEmailLabel: {
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  resetPasswordButton: {
    marginHorizontal: 16,
  },
  backToLoginButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
