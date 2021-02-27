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
  Divider,
} from '@ui-kitten/components';
import { EyeIcon, EyeOffIcon, MenuIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import I18n from './../i18n/i18n';

export const ChangePasswordScreen = (props): React.ReactElement => {
  const [currentPassword, setCurrentPassword] = React.useState<string>();
  const [newPassword, setNewPassword] = React.useState<string>();
  const [confirmNewPassword, setConfirmNewPassword] = React.useState<string>();
  const [currentPasswordVisible, setCurrentPasswordVisible] = React.useState<boolean>(false);
  const [newPasswordVisible, setNewPasswordVisible] = React.useState<boolean>(false);
  const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = React.useState<boolean>(false);

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

  const onSaveButtonPress = (): void => {
    // TODO
  };

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
        <Divider />
        <ScrollView>
          <KeyboardAvoidingView style={styles.container}>
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
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
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
});
