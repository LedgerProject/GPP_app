import React from 'react';
import { View, ImageBackground } from 'react-native';
import { Button, Input, Layout, Text, StyleService, useStyleSheet, Modal } from '@ui-kitten/components';
import { EmailIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from './../i18n/i18n';
import axios from 'axios';
import { AppOptions } from '../services/app-env';

export default ({ navigation }): React.ReactElement => {
  const [email, setEmail] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [modalVisible, setmodalVisible] = React.useState(false);

  const styles = useStyleSheet(themedStyles);

  const onBackToLoginButtonPress = (): void => {
    navigation && navigation.navigate('SignIn');
  };

  const onResetPasswordButtonPress = (): void => {
    // navigation && navigation.goBack();
    setError('');
    setSuccess('');
    if (!email) {
      setError(I18n.t('Please fill Email'));
      setmodalVisible(true);
      return;
    }
    setLoading(true);
    const postParams = {
        email: email,
      };
      axios
      .post(AppOptions.getServerUrl() + 'user/reset-password', postParams)
      .then(function (response) {
        setLoading(false);
        const data = response.data.resetPasswordOutcome;
        const code = parseInt(data.code, 10);
        switch (code) {
          case 10:
            setError(I18n.t('Email not exists'));
          break;
          case 11:
            setError(I18n.t('Email is empty'));
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
      .catch(function () { // error) {
        setLoading(false);
        // alert(error.message);
        setError(I18n.t('An error has occurred, please try again'));
        setmodalVisible(true);
        return;
      });

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
      <Modal
      visible={ modalVisible }
      backdropStyle={styles.backdrop}
      onBackdropPress={ () => setmodalVisible(false)}
      >
      <Layout style={ styles.modal } >
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
});
