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
  Select,
  TopNavigation,
  TopNavigationAction,
  Divider,
} from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { ProfileAvatar } from '../services/profile-avatar.component';
import { EmailIcon, EyeIcon, EyeOffIcon, PersonIcon, PlusIcon } from '../components/icons';
import { genderOptions, nationalityOptions } from './my-profile/data';
import { MenuIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { ScrollView } from 'react-native-gesture-handler';

export const MyProfileScreen = (props): React.ReactElement => {

  const [firstName, setFirstName] = React.useState<string>();
  const [lastName, setLastName] = React.useState<string>();
  const [gender, setGender] = React.useState(props.selectedOption);
  const [nationality, setNationality] = React.useState(props.selectedOption);
  const [email, setEmail] = React.useState<string>();
  const [confirmEmail, setConfirmEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [confirmPassword, setConfirmPassword] = React.useState<string>();
  const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState<boolean>(false);

  const styles = useStyleSheet(themedStyles);

  const onSelectGender = (option) => {
    setGender(option);
  };

  const onSelectNationality = (option) => {
    setNationality(option);
  };

  const onSaveButtonPress = (): void => {
    // TODO
  };

  const onDeleteButtonPress = (): void => {
    // TODO
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  const renderEditAvatarButton = (): React.ReactElement => (
    <Button
      style={styles.editAvatarButton}
      status='basic'
      icon={PlusIcon}
    />
  );

  return (
    <View
      style={{flex: 1}}>
      <TopNavigation
        title='My Profile'
        leftControl={renderDrawerAction()}
      />
      <Divider />
      <ScrollView>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.headerContainer}>
            <ProfileAvatar
              style={styles.profileAvatar}
              resizeMode='center'
              source={require('../assets/images/image-person.png')}
              editButton={renderEditAvatarButton}
            />
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
            <Select
              {...props}
              style={styles.select}
              selectedOption={gender}
              data={genderOptions}
              placeholder='Select your gender'
              onSelect={onSelectGender}
            />
            <Select
              {...props}
              style={styles.selectNationality}
              selectedOption={nationality}
              data={nationalityOptions}
              placeholder='Select your nationality'
              onSelect={onSelectNationality}
            />
            <Divider />
            <Text
            style={styles.infoSection}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu ligula ac magna sodales molestie.
              Mauris et orci ultrices, cursus est nec, dictum massa.
          </Text>
          <Button
              style={styles.saveButton}
              size='giant'
              onPress={onSaveButtonPress}>
              Save
          </Button>
          <Button
              style={styles.deleteButton}
              size='giant'
              status='danger'
              appearance='outline'
              onPress={onDeleteButtonPress}>
              Remove all my data
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
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 216,
    backgroundColor: 'color-primary-default',
  },
  profileAvatar: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignSelf: 'center',
    backgroundColor: 'background-basic-color-1',
    tintColor: 'color-primary-default',
  },
  editAvatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  nameInput: {
    marginTop: 8,
  },
  select: {
    marginTop: 8,
    width: '100%',
  },
  selectNationality: {
    marginTop: 12,
    width: '100%',
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
  deleteButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
});
