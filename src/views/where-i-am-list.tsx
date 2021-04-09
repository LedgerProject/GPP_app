import React, { useEffect } from 'react';
import { View, ScrollView, ListRenderItemInfo, Alert } from 'react-native';
import {
  Input, Button, Divider, List, ListItem, StyleService, Text,
  TopNavigation, TopNavigationAction, useStyleSheet, Layout, Select, Modal as ModalUiKitten,
} from '@ui-kitten/components';
import { ArrowBackIcon, MenuIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
// import { categoryOptions } from './where-i-am/data-category';

import { StructureItem } from './where-i-am/structure-item.component';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-env';
import I18n from './../i18n/i18n';
import Spinner from 'react-native-loading-spinner-overlay';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import {
  manageToken,
  selectToken,
} from '../app/tokenSlice';

export const WhereIAmListScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const { regionBoundaries, option, Country, currentPosition } = props.route.params;

  const [filter, setFilter] = React.useState(props.selectedOption);
  const [searchterm, setSearchterm] = React.useState('');
  const [categories, setCategories] = React.useState([]);
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [markers, setMarkers] = React.useState([]);
  const [searchMarkers, setSearchMarkers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');

  // Get Token from REDUX
  const token = useSelector(selectToken);

  const onSelectFilter = (selected_option) => {
    setFilter(selected_option);
    getMyRegion(
      regionBoundaries.northWestLatitude,
      regionBoundaries.northWestLongitude,
      regionBoundaries.southEastLatitude,
      regionBoundaries.southEastLongitude,
      selected_option.idCategory,
      currentPosition.latitude,
      currentPosition.longitude,
    );
  };

  async function getMyRegion(Lat1, Lon1, Lat2, Lon2, idCategory = null, currentLat = null, currentLon = null) {
    setLoading(true);
    setMarkers([]);
    let add_on = '';
    if (idCategory) {
      add_on = ' ,"idCategory": "' + idCategory + '" ';
    }
    if (currentLat && currentLon) {
      add_on = add_on + ' ,"userLatitude": "' + currentLat + '" ,"userLongitude": "' + currentLon + '" ';
    }
    // get position

    // ask structures
    // const token = await AsyncStorage.getItem('token');
    // console.log(token);
    const where = `"where": {`
        + `"latitudeNorthWest": ` + Lat1
        + `,"longitudeNorthWest": ` + Lon1
        + `,"latitudeSouthEast": ` + Lat2
        + `,"longitudeSouthEast": ` + Lon2
        + add_on
      + `},`;

    const fields = `"fields": {`
        + `"idStructure": true`
        + `,"idOrganization": false`
        + `,"organizationname": false`
        + `,"alias": true`
        + `,"structurename": true`
        + `,"address": true`
        + `,"city": true`
        + `,"latitude": true`
        + `,"longitude": true`
        + `,"email": false`
        + `,"email": false`
        + `,"phoneNumberPrefix": false`
        + `,"phoneNumber": false`
        + `,"website": false`
        + `,"idIcon": false`
        + `,"iconimage": true`
        + `,"iconmarker": false`
      + `}`;
    axios
      .get(AppOptions.getServerUrl() + 'structures/?filter={' + where + fields + '}', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      setLoading(false);
       // console.log(response);
       setMarkers(response.data);
       setSearchMarkers(response.data);
    })
    .catch(function (error) {
      setLoading(false);
      // alert(JSON.stringify(error));
      throw error;
    });
  }

  useEffect(() => {
    getCategories();
    let option_category = { index: 0, text: I18n.t('Show All'), idCategory: '' };
    if (option) {
      option_category = option;
    }
    onSelectFilter(option_category);
  }, []);

  async function getCategories() {
    let x = 0;
    // const token = await AsyncStorage.getItem('token');
    axios
    .get(AppOptions.getServerUrl() + 'categories', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
       setCategories(response.data);
       const data: any = response.data;
       const categoryArray = [];
       categoryArray.push( { index: x, text: I18n.t('Show All'), idCategory: '' } );
       data.map( (category) => {
         x++;
         const catObj = { index: x, text: category.identifier, idCategory: category.idCategory };
         categoryArray.push( catObj );
       });
       setCategoryOptions(categoryArray);
    })
    .catch(function (error) {
      // alert(JSON.stringify(error));
      throw error;
    });
  }

  const handleTextChange = (text): void => {
    setSearchterm(text);
    let show_structures = [];
    if (!text) {
      show_structures = markers;
    } else {
      markers.forEach(element => {
        const search = text.toLowerCase();
        const name = element.structurename.toLowerCase();
        const address = element.address.toLowerCase();
        const city = element.city.toLowerCase();
        if (name.includes(search) || address.includes(search) || city.includes(search)) {
          show_structures.push(element);
        }
      });
    }
    setSearchMarkers(show_structures);
  };

  const onMapButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmMap');
  };

  const onCountryButtonPress = (): void => {

  if (Country) {
    props.navigation && props.navigation.navigate('WhereIAmCountry', {
      Country: Country,
    });
  } else {
    showAlertMessage(
      I18n.t('Country Error'),
      I18n.t('No Country Selected'),
    );
  }
  };

  const onDetailsButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmDetails');
  };

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  );

  const onPressItem = (idStructure: string, index: number, distance: number): void => {
    // console.log(distance);
    props.navigation && props.navigation.navigate('WhereIAmDetails', { idStructure: idStructure, distance: distance });
  };

  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

    const renderStructureItem = ({ item, index }) => (
    <StructureItem
      index={index}
      item={item}
      onListviewButtonPress={onPressItem}
      />
  );

  return (

    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={I18n.t('Structures List')}
        titleStyle={styles.topBarTitle}
        leftControl={renderDrawerAction() }
        style={styles.topBar}
      />
      <Divider/>
      <Spinner
          visible={loading}
          textContent={I18n.t('Loading') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
      <Layout style={styles.safeArea}>
        <View style={styles.filtersContainer}>
          <Text style={styles.labelWhat}>{I18n.t('What are you searching for') + '?'}</Text>
          <Select
            {...props}
            style={styles.select}
            selectedOption={filter}
            data={categoryOptions}
            placeholder={I18n.t('Show All')}
            onSelect={onSelectFilter}
            />
          <Input autoCapitalize='none' placeholder={I18n.t('Enter the term to filter the search')}
            value={searchterm} onChangeText={text => handleTextChange(text)} />
        </View>
        <List data={searchMarkers} renderItem={renderStructureItem} />
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonLeft} >
            <Button style={styles.button} status='primary' size='small'
              onPress={onMapButtonPress}>{I18n.t('Show Map')}
            </Button>
          </View>
          <View style={styles.buttonRight} >
            <Button style={styles.button} status='primary'
              size='small' onPress={onCountryButtonPress}>{I18n.t('Country Informations')}</Button>
          </View>
        </View>
        <Layout style={styles.downContainer}>
          <Text style={styles.downText}>{I18n.t('Now you are on') + ':'}</Text>
          <Text style={styles.downTextBold}>{Country}</Text>
        </Layout>
      </Layout>
      <ModalUiKitten
        visible={ modalAlertVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalAlertVisible(false)}>
        <Layout style={ styles.modal } >
          <Text style={ styles.modalText } category='h6' >{alertTitle}</Text>
          <Text style={ styles.modalText } >{alertMessage}</Text>
          <Button status='basic' onPress={() => setModalAlertVisible(false)}>{I18n.t('CLOSE')}</Button>
        </Layout>
      </ModalUiKitten>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  labelWhat: {
    textAlign: 'left',
    color: 'grey',
    marginTop: 4,
  },
  select: {
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
  },
  topContainer: {
    padding: 6,
    paddingLeft: 12,
    paddingRight: 12,
  },
  downContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  downText: {
    textAlign: 'center',
  },
  downTextBold: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRight: {
    width: '50%', height: 'auto', flex: 1, marginLeft: 5, marginRight: 10, alignItems: 'center',
  },
  buttonLeft: {
    width: '50%', height: 'auto', flex: 1, marginLeft: 10, marginRight: 5, alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row', marginTop: 10,
  },
  filtersContainer: {
    marginHorizontal: 10, marginBottom: 4,
  },
  button: { width: '100%' },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modal: {
    textAlign: 'center',
    margin: 12,
    padding: 12,
  },
  modalText: {
    marginBottom: 4,
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: 4,
    textAlign: 'center',
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
