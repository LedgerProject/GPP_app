// React import
import React, { useEffect } from 'react';

// React Native import
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

// UIKitten import
import { Button, Input, Layout, StyleService, Text, useStyleSheet, Select,
  TopNavigation, TopNavigationAction, Divider, Datepicker, Modal } from '@ui-kitten/components';

// Locale import
import I18n from './../i18n/i18n';

// Environment import
import { AppOptions } from '../services/app-env';

// Components import
import { PersonIcon, PlusIcon, MenuIcon, StopCircleIcon, GlobeIcon, CalendarIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

// Model import
import { genderOptions } from '../model/gender.model';

// Axios import
import axios from 'axios';

// Async Storage import
import AsyncStorage from '@react-native-async-storage/async-storage';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAvoidingView } from '../services/3rd-party';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';

export const MyProfileScreen = (props): React.ReactElement => {
  const [idUser, setIdUser] = React.useState<string>();
  const [firstName, setFirstName] = React.useState<string>();
  const [lastName, setLastName] = React.useState<string>();
  const [gender, setGender] = React.useState(props.selectedOption);
  const [nationality, setNationality] = React.useState(props.selectedOption);
  const [birthday, setBirthday] = React.useState<Date>();
  const [loading, setLoading] = React.useState(false);
  const [nationalityOptions, setNationalityOptions] = React.useState([]);
  const [nationalityObjects, setNationalityObjects] = React.useState([]);
  const [success, setSuccess] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [modalVisible, setmodalVisible] = React.useState(false);

  const today = new Date();
  const firstDayCalendar = new Date(1900, 1, 1);
  const styles = useStyleSheet(themedStyles);

  // Get token from Redux
  const token = useSelector(selectToken);

  // Use Effect
  useEffect(() => {
    getNationalities();
  }, []);

  // On selecting gender event
  const onSelectGender = (option) => {
    setGender(option);
  };

  // On selecting nationality event
  const onSelectNationality = (option) => {
    setNationality(option);
  };

  // Get the nationalities list
  async function getNationalities() {
    // Show spinner
    setLoading(true);

    // Get the current language
    let lang = await AsyncStorage.getItem('lang');
    lang = lang.substring(0, 2);

    // Set the filters
    const nationalitiesFilters = `nationalities?filter={`
        + `"include":[`
          + `{"relation": "nationalityLanguage", "scope": {"where": {"language": "` + lang + `"}}}`
        + `]`
      + `}`;

    // Get the nationalities list from the server
    axios
      .get(AppOptions.getServerUrl() + nationalitiesFilters, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(async function (response) {
        // Hide spinner
        setLoading(false);

        // Set the nationalities objects
        const data: any = response.data;
        setNationalityObjects(data);

        // Set the nationalities options
        const options = [];

        data.map((element) => {
          const option = { text: element.nationalityLanguage[0].nationality };
          options.push( option );
        });

        setNationalityOptions(options);

        getUserInformation(data);
      })
      .catch(function () {
        // Hide spinner
        setLoading(false);

        // Show the error message
        setError(I18n.t('An error has occurred, please try again'));
        setmodalVisible(true);
      });
  }

  // Get and set the user information
  async function getUserInformation(nationalitiesList: any) {
    // Show spinner
    setLoading(true);

    // Get the user informatiomn
    axios
      .get(AppOptions.getServerUrl() + 'users/logged-user', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        const data: any = response.data;

        if (data) {
          // Set the user ID
          setIdUser(data.idUser);

          // Set the user first name
          setFirstName(data.firstName);

          // Set the user last name
          setLastName(data.lastName);

          // Set the user gender
          if (data.gender) {
            setGender({ text: data.gender});
          }

          // Set the user nationality
          if (data.idNationality) {
            nationalitiesList.forEach( element => {
              if (element.idNationality === data.idNationality) {
                setNationality({ text: element.nationalityLanguage[0].nationality});
              }
            });
          }

          // Set the user birthday
          const bday = data.birthday;
          if (bday) {
            const birthdayDate = new Date(bday);
            setBirthday(birthdayDate);
          }
        }

        // Hide spinner
        setLoading(false);
      })
      .catch(function () {
        // Hide spinner
        setLoading(false);

        // Show the error message
        setError(I18n.t('An error has occurred, please try again'));
        setmodalVisible(true);
      });
  }

  // Save profile information
  async function onSaveButtonPress() {
    setError('');
    setSuccess('');

    // Check if first name is specified
    if (!firstName) {
      setError(I18n.t('Please enter your first name'));
      setmodalVisible(true);
      return;
    }

    // Check if last name is specified
    if (!lastName) {
      setError(I18n.t('Please enter your last name'));
      setmodalVisible(true);
      return;
    }

    // Show the spinner
    setLoading(true);

    // Set the post params
    const postParams = {
      firstName: firstName,
      lastName: lastName,
    };

    let key = '';

    if (gender) {
      key = 'gender';
      postParams[key] = gender.text;
    }

    if (nationality) {
      const nationalityIdentifier = nationality.text;

      nationalityObjects.forEach(element => {
        if (element.identifier === nationalityIdentifier) {
          key = 'idNationality';
          postParams[key] = element.idNationality;
        }
      });
    }

    if (birthday) {
      key = 'birthday';
      postParams[key] = birthday;
    }

    // Update the user profile
    axios
      .patch(AppOptions.getServerUrl() + 'users/' + idUser, postParams, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide the spinner
        setLoading(false);

        // Show the success message
        setSuccess(I18n.t('Profile updated successfully'));
        setmodalVisible(true);
      })
      .catch(errors => {
        // Hide the spinner
        setLoading(false);

        // Show the error message
        setError(I18n.t('An error has occurred, please try again'));
        setmodalVisible(true);
      });
  }

  // Delete user data
  const onDeleteButtonPress = (): void => {
    // Show spinner
    setLoading(true);

    // Hide spinner
    setLoading(false);
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
          title={I18n.t('My Profile')}
          titleStyle={styles.topBarTitle}
          leftControl={renderDrawerAction() }
          style={styles.topBar}
        />
        <Spinner
          visible={loading}
          textContent={I18n.t('Please wait') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView style={styles.container}>
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
              <Select
                {...props}
                icon={StopCircleIcon}
                style={styles.select}
                selectedOption={gender}
                data={genderOptions}
                placeholder={I18n.t('Select your gender')}
                onSelect={onSelectGender}
              />
              <Select
                {...props}
                icon={GlobeIcon}
                style={styles.selectNationality}
                selectedOption={nationality}
                data={nationalityOptions}
                placeholder={I18n.t('Select your nationality')}
                onSelect={onSelectNationality}
              />
              <Datepicker
                style={styles.datepicker}
                icon={CalendarIcon}
                date={birthday}
                min={firstDayCalendar}
                max={today}
                placeholder={I18n.t('Select your birthday')}
                onSelect={selectedDate => setBirthday(selectedDate)}
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
              <Button
                  style={styles.deleteButton}
                  size='giant'
                  status='danger'
                  appearance='outline'
                  onPress={onDeleteButtonPress}>
                  {I18n.t('Remove all my data')}
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
    backgroundColor: 'background-basic-color-4',
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
  datepicker: {
    marginTop: 12,
    marginBottom: 12,
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
  deleteButton: {
    marginVertical: 12,
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
