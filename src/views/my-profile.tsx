import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  Button,
  Input,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  Select,
  TopNavigation,
  TopNavigationAction,
  Divider,
  Datepicker, Modal,
} from '@ui-kitten/components';
import { ProfileAvatar } from '../services/profile-avatar.component';
import { PersonIcon, PlusIcon } from '../components/icons';
import { genderOptions } from './my-profile/data';
// import { genderOptions, nationalityOptions } from './my-profile/data';
import { MenuIcon, StopCircleIcon, GlobeIcon, CalendarIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import I18n from './../i18n/i18n';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-env';
import Spinner from 'react-native-loading-spinner-overlay';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import {
  manageToken,
  selectToken,
} from '../app/tokenSlice';

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
  const today = new Date();
  const firstDayCalendar = new Date(1900, 1, 1);

  const styles = useStyleSheet(themedStyles);

  const [success, setSuccess] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [modalVisible, setmodalVisible] = React.useState(false);

  // Get Token from REDUX
  const token = useSelector(selectToken);

  const onSelectGender = (option) => {
    setGender(option);
  };

  const onSelectNationality = (option) => {
    setNationality(option);
  };

  async function onSaveButtonPress() {
    setError('');
    setSuccess('');
    if (!firstName) {
      setError(I18n.t('Please fill First Name'));
      setmodalVisible(true);
      return;
    }
    if (!lastName) {
      setError(I18n.t('Please fill Last Name'));
      setmodalVisible(true);
      return;
    }
    // const token = await AsyncStorage.getItem('token');
    setLoading(true);
    const postParams = {
        firstName: firstName,
        lastName: lastName,
      };
      let key = '';
      if (gender) {
        const gender_value = gender.text;
        key = 'gender';
        postParams[key] = gender_value;
      }
      if (nationality) {
        const nationality_identifier = nationality.text;
        let nationality_value = '';
        // search nationality
        nationalityObjects.forEach(element => {
          if (element.identifier === nationality_identifier) {
            nationality_value = element.idNationality;
            key = 'idNationality';
            postParams[key] = nationality_value;
          }
        });
        //
      }
      if (birthday) {
        key = 'birthday';
        postParams[key] = birthday;
      }

      axios
      .patch(AppOptions.getServerUrl() + 'users/' + idUser, postParams, {
        headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        setLoading(false);
            setSuccess(I18n.t(
              'Profile updated successfully',
              ));
        setmodalVisible(true);
      })
      .catch(errors => {

        setLoading(false);
        setError(I18n.t('An error has occurred, please try again'));
        setmodalVisible(true);
        throw error;
        return;
      });

  }

  const onDeleteButtonPress = (): void => {
    setLoading(true);
    // TODO
    setLoading(false);
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

  async function getNationalities() {
      setLoading(true);
      // const token = await AsyncStorage.getItem('token');
      let lang = await AsyncStorage.getItem('lang');
      lang = lang.substring(0, 2);
      axios
        .get(AppOptions.getServerUrl() + `nationalities?filter={`
         + `"include":[`
          + `{"relation": "nationalityLanguage", "scope": {"where": {"language": "` + lang + `"}}}`
         + `]`
          + `}`
          , {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          setLoading(false);
          const data: any = response.data;
          setNationalityObjects(data);
          const options = [];
          data.map ( (element) => {
            const option = { text: element.identifier };
            options.push( option );
          });
          setNationalityOptions(options);

          // Getuser
          axios
          .get(AppOptions.getServerUrl() + 'users/logged-user', {
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json',
            },
          })
          .then(function (user_response) {
            setLoading(false);
            const user_data: any = user_response.data;
            if (user_data) {
              const bday = user_data.birthday;
              if (bday) {
                const bday_date = new Date(bday);
                setBirthday(bday_date);
              }
              setIdUser(user_data.idUser);
              setFirstName(user_data.firstName);
              setLastName(user_data.lastName);
              if (user_data.gender) {
                setGender({ text: user_data.gender});
              }
              if (user_data.idNationality) {
                data.forEach( element => {
                  if (element.idNationality === user_data.idNationality) {
                    setNationality({ text: element.identifier});
                  }
                });
              }
            }
          })
          .catch(function () {
            // setLoading(false);
            // throw error;
          });

          //

        })
        .catch(function () {
          setLoading(false);
          // alert(JSON.stringify(error));
          throw error;
        });
    }

    async function getUser() {
      setLoading(true);
      // const token = await AsyncStorage.getItem('token');
      axios
        .get(AppOptions.getServerUrl() + 'users/logged-user', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          setLoading(false);
          const data: any = response.data;
          if (data) {
            let bday = data.birthday;
            if (bday) {
              bday = bday.substring(0, 10);
              const bday_date = new Date(bday + ' 00:00:00');
              setBirthday(bday_date);
            }
            setIdUser(data.idUser);
            setFirstName(data.firstName);
            setLastName(data.lastName);
            if (data.gender) {
              setGender({ text: data.gender});
            }
            if (data.idNationality) {
              nationalityObjects.forEach( element => {
                if (element.idNationality === data.idNationality) {
                  setNationality({ text: element.identifier});
                }
              });
            }
          }
        })
        .catch(function () {
          setLoading(false);
          throw error;
        });
    }


  useEffect(() => {
    getNationalities();
    // getUser();
  }, []);

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
          textContent={I18n.t('Loading') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView style={styles.container}>
            {/*<View style={styles.headerContainer}>
              <ProfileAvatar
                style={styles.profileAvatar}
                resizeMode='center'
                source={require('../assets/images/image-person.png')}
                editButton={renderEditAvatarButton}
              />
            </View>*/}
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
