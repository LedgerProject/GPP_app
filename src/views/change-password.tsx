import React from 'react';
import { View } from 'react-native';
import {
  Button,
  Input,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  Divider, Modal,
} from '@ui-kitten/components';
import { EyeIcon, EyeOffIcon, MenuIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from './../i18n/i18n';
import axios from 'axios';
import { AppOptions } from '../services/app-env';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const onCurrentPasswordIconPress = (): void => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const onNewPasswordIconPress = (): void => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const onConfirmNewPasswordIconPress = (): void => {
    setConfirmNewPasswordVisible(!confirmNewPasswordVisible);
  };

  async function onSaveButtonPress() {
    // TODO
    setError('');
    setSuccess('');
    if (!currentPassword) {
      setError(I18n.t('Please fill Current Password'));
      setmodalVisible(true);
      return;
    }
    if (!newPassword) {
      setError(I18n.t('Please fill New Password'));
      setmodalVisible(true);
      return;
    }
    if (!confirmNewPassword) {
      setError(I18n.t('Please confirm New Password'));
      setmodalVisible(true);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError(I18n.t('Passwords not match'));
      setmodalVisible(true);
      return;
    }
    const token = await AsyncStorage.getItem('token');
    setLoading(true);
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
        setLoading(false);
        const data = response.data.changePasswordOutcome;
        const code =  parseInt(data.code, 10);
        switch (code) {
          case 10:
            setError(I18n.t('Current password is wrong'));
          break;
          case 20:
            setError(I18n.t('New password at least 8 characters'));
          break;
          case 30:
            setError(I18n.t('An error has occurred, please try again'));
          break;
          case 201: case 202:
            setSuccess(I18n.t(
              'Password updated successfully',
              ));
            setNewPassword('');
            setConfirmNewPassword('');
            setCurrentPassword('');
          break;
          default:
            setError(data.message);
        }
        setmodalVisible(true);
      })
      .catch(errors => {
        setLoading(false);
        /*let code = error.status;
        if (code == 401) {
          setError(I18n.t('Current password is wrong'));
        } else {
          setError(I18n.t('An error has occurred, please try again'));
        } */
        setError(I18n.t('Current password is wrong'));
        setmodalVisible(true);
        throw error;
        return;
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
          textContent={I18n.t('Loading') + '...'}
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
              <Divider />
              <Text
                style={styles.infoSection}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse eu ligula ac magna sodales molestie.
                  Mauris et orci ultrices, cursus est nec, dictum massa.
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
