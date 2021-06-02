// React import
import React from 'react';

// React Native import
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

// UIKitten import
import { Button, Input, Layout, StyleService, Text, useStyleSheet, TopNavigation,
  TopNavigationAction, Divider, Modal } from '@ui-kitten/components';

// Environment import
import { AppOptions } from '../services/app-env';

// Locale import
import I18n from './../i18n/i18n';

// Components import
import { EyeIcon, EyeOffIcon, MenuIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

// Axios import
import axios from 'axios';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAvoidingView } from '../services/3rd-party';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';

export const ChangePasswordScreen = (props): React.ReactElement => {
  const [currentPassword, setCurrentPassword] = React.useState<string>();
  const [newPassword, setNewPassword] = React.useState<string>();
  const [confirmNewPassword, setConfirmNewPassword] = React.useState<string>();
  const [currentPasswordVisible, setCurrentPasswordVisible] = React.useState<boolean>(false);
  const [newPasswordVisible, setNewPasswordVisible] = React.useState<boolean>(false);
  const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [modalVisible, setmodalVisible] = React.useState(false);

  const styles = useStyleSheet(themedStyles);

  // Get token from Redux
  const token = useSelector(selectToken);

  // Change visibility of current password
  const onCurrentPasswordIconPress = (): void => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  // Change visibility of new password
  const onNewPasswordIconPress = (): void => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  // Change visibility of confirm new password
  const onConfirmNewPasswordIconPress = (): void => {
    setConfirmNewPasswordVisible(!confirmNewPasswordVisible);
  };

  // Proceed changing the password
  async function onSaveButtonPress() {
    // Reset the error and success messages
    setError('');
    setSuccess('');

    // Check if entered the current password
    if (!currentPassword) {
      setError(I18n.t('Please enter the current password'));
      setmodalVisible(true);
      return;
    }

    // Check if entered the new password
    if (!newPassword) {
      setError(I18n.t('Please enter the new password'));
      setmodalVisible(true);
      return;
    }

    // Check if new password is at least 8 characters
    if (newPassword.length < 8) {
      setError(I18n.t('Specify a new password of at least 8 characters'));
      setmodalVisible(true);
      return;
    }

    // Check if entered the confirm new password
    if (!confirmNewPassword) {
      setError(I18n.t('Please confirm the new password'));
      setmodalVisible(true);
      return;
    }

    // Check if the new password and the confirm new password match
    if (newPassword !== confirmNewPassword) {
      setError(I18n.t('Confirm new password does not match the new password'));
      setmodalVisible(true);
      return;
    }

    // Show spinner
    setLoading(true);

    // Try to change the password
    const postParams = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    axios
      .post(AppOptions.getServerUrl() + 'user/change-password', postParams, {
        headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);

        // Check if the password is changed
        const data = response.data.changePasswordOutcome;

        switch (data.code) {
          case '10':
            setError(I18n.t('Current password is wrong'));
          break;

          case '20':
            setError(I18n.t('Specify a new password of at least 8 characters'));
          break;

          case '30':
            setError(I18n.t('An error has occurred, please try again'));
          break;

          case '201':
          case '202':
            setSuccess(I18n.t('Password updated successfully'));

            setNewPassword('');
            setConfirmNewPassword('');
            setCurrentPassword('');
          break;

          default:
            setError(data.message);
        }

        setmodalVisible(true);
      })
      .catch(err => {
        // Set the error message
        let errDescription = '';

        if (err.response) {
          switch (err.response.data.error.statusCode) {
            case 401:
              errDescription = 'Current password is wrong';
            break;

            default:
              errDescription = err.response.data.error.message;
            break;
          }
        } else {
          errDescription = 'Unable to reach the server, please try again';
        }

        setLoading(false);

        setError(I18n.t(errDescription));
        setmodalVisible(true);
      });
  }

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <View
        style={{flex: 1}}>
        <TopNavigation
          title={I18n.t('Change Password')}
          titleStyle={styles.topBarTitle}
          leftControl={renderDrawerAction() }
          style={styles.topBar}
        />
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView style={styles.container}>
            <Spinner
              visible={loading}
              textContent={I18n.t('Please wait') + '...'}
              textStyle={styles.spinnerTextStyle}
            />
            <Layout
              style={styles.formContainer}
              level='1'>
              <Input
                style={styles.passwordInput}
                placeholder={I18n.t('Current Password')}
                icon={currentPasswordVisible ? EyeIcon : EyeOffIcon}
                value={currentPassword}
                secureTextEntry={!currentPasswordVisible}
                onChangeText={setCurrentPassword}
                onIconPress={onCurrentPasswordIconPress}
              />
              <Input
                style={styles.passwordInput}
                placeholder={I18n.t('New Password')}
                icon={newPasswordVisible ? EyeIcon : EyeOffIcon}
                value={newPassword}
                secureTextEntry={!newPasswordVisible}
                onChangeText={setNewPassword}
                onIconPress={onNewPasswordIconPress}
              />
              <Input
                style={styles.passwordInput}
                placeholder={I18n.t('Confirm New Password')}
                icon={confirmNewPasswordVisible ? EyeIcon : EyeOffIcon}
                value={confirmNewPassword}
                secureTextEntry={!confirmNewPasswordVisible}
                onChangeText={setConfirmNewPassword}
                onIconPress={onConfirmNewPasswordIconPress}
              />
              <Text
                style={styles.infoSection}>
                  {I18n.t('Change password info')}
              </Text>
              <Button
                  style={styles.saveButton}
                  size='giant'
                  onPress={onSaveButtonPress}>
                  {I18n.t('Save')}
              </Button>
            </Layout>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
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
    backgroundColor: 'background-basic-color-4',
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    backgroundColor: 'background-basic-color-4',
  },
  passwordInput: {
    marginBottom: 8,
  },
  infoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 4,
    marginHorizontal: 16,
    color: 'color-light-100',
  },
  saveButton: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  topBar: {
    backgroundColor: 'color-primary-default',
  },
  topBarTitle: {
    color: '#FFFFFF',
  },
  topBarIcon: {
    color: '#FFFFFF',
    tintColor: '#FFFFFF',
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
