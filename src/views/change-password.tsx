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
import { PersonIcon, PlusIcon } from '../components/icons';
import { EyeIcon, EyeOffIcon, MenuIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { ScrollView } from 'react-native-gesture-handler';

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
    <View
      style={{flex: 1}}>
      <TopNavigation
        title='Change Password'
        leftControl={renderDrawerAction()}
      />
      <Divider />
      <ScrollView>
        <KeyboardAvoidingView style={styles.container}>
          <Layout
            style={styles.formContainer}
            level='1'>
            <Input
              style={styles.passwordInput}
              placeholder='Current Password'
              icon={currentPasswordVisible ? EyeIcon : EyeOffIcon}
              value={currentPassword}
              secureTextEntry={!currentPasswordVisible}
              onChangeText={setCurrentPassword}
              onIconPress={onCurrentPasswordIconPress}
            />
            <Input
              style={styles.passwordInput}
              placeholder='New Password'
              icon={newPasswordVisible ? EyeIcon : EyeOffIcon}
              value={newPassword}
              secureTextEntry={!newPasswordVisible}
              onChangeText={setNewPassword}
              onIconPress={onNewPasswordIconPress}
            />
            <Input
              style={styles.passwordInput}
              placeholder='Confirm New Password'
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
                Save
            </Button>
          </Layout>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const themedStyles = StyleService.create({
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
});
