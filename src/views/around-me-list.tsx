// React import
import React, { useEffect } from 'react';

// React Native import
import { View } from 'react-native';

// UIKitten import
import { Input, Button, List, StyleService, Text, TopNavigation, TopNavigationAction,
  useStyleSheet, Layout, Select, Modal as ModalUiKitten } from '@ui-kitten/components';

// Environment import
import { AppOptions } from '../services/app-env';

// Locale import
import I18n from './../i18n/i18n';

// Component import
import { ArrowBackIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { StructureItem } from '../components/structure-item.component';

// Axios import
import axios from 'axios';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';
import { Category, getCategories } from '../services/structures.service';

export const AroundMeListScreen = (props): React.ReactElement => {
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

  const styles = useStyleSheet(themedStyles);
  const { regionBoundaries, selectedCategory, currentCountry, currentPosition } = props.route.params;

  // Get Token from Redux
  const token = useSelector(selectToken);

  // Use effect
  useEffect(() => {
    // Set the filter categories list
    setCategoriesList();

    // Set the selected category from maps
    let currentCategory = {
      index: 0,
      idCategory: '',
      alias: '',
      text: I18n.t('Show All'),
    };

    if (selectedCategory) {
      currentCategory = selectedCategory;
    }

    onSelectFilter(currentCategory);
  }, []);

  // Get the filter categories
  const setCategoriesList = async () => {
    const categoriesArray = await getCategories(token);
    setCategoryOptions(categoriesArray);
  };

  // Event on select filter category
  const onSelectFilter = (selectedOption) => {
    setFilter(selectedOption);

    let userLatitude = null;
    let userLongitude = null;

    if (currentPosition) {
      userLatitude = currentPosition.latitude;
      userLongitude = currentPosition.longitude;
    }

    getStructures(
      regionBoundaries.northWestLatitude,
      regionBoundaries.northWestLongitude,
      regionBoundaries.southEastLatitude,
      regionBoundaries.southEastLongitude,
      selectedOption.idCategory,
      userLatitude,
      userLongitude,
    );
  };

  // Get the structures from the server
  async function getStructures(latitudeNorthWest, longitudeNorthWest, latitudeSouthEast, longitudeSouthEast,
    idCategory = null, currentLat = null, currentLon = null) {
    // Show spinner
    setLoading(true);

    // Reset the markers
    setMarkers([]);

    // Set the filters
    let filters = '';
    let orderBy = '';

    if (idCategory) {
      filters = ' ,"idCategory": "' + idCategory + '" ';
    }

    if (currentLat && currentLon) {
      filters = filters + ' ,"userLatitude": "' + currentLat + '" ,"userLongitude": "' + currentLon + '" ';
    } else {
      orderBy = ', "order": ["structurename"] ';
    }

    const where = `"where": {`
        + `"latitudeNorthWest": ` + latitudeNorthWest
        + `,"longitudeNorthWest": ` + longitudeNorthWest
        + `,"latitudeSouthEast": ` + latitudeSouthEast
        + `,"longitudeSouthEast": ` + longitudeSouthEast
        + filters
      + `},`;

    // Set the fields
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
      .get(AppOptions.getServerUrl() + 'structures/?filter={' + where + fields + orderBy + '}', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);

        // Set the markers on the map
        setMarkers(response.data);

        // Set the markers for textual search
        setSearchMarkers(response.data);
    })
    .catch(function (error) {
      // Hide spinner
      setLoading(false);

      // Show the error message
      showAlertMessage(
        I18n.t('Error loading structures'),
        I18n.t('An error has occurred, please try again'),
      );
    });
  }

  // Textual filter change
  const onTextChange = (text): void => {
    setSearchterm(text);

    let structuresFiltered = [];
    if (!text) {
      structuresFiltered = markers;
    } else {
      markers.forEach(element => {
        const search = text.toLowerCase();
        const name = element.structurename.toLowerCase();
        const address = element.address.toLowerCase();
        const city = element.city.toLowerCase();

        if (name.includes(search) || address.includes(search) || city.includes(search)) {
          structuresFiltered.push(element);
        }
      });
    }

    setSearchMarkers(structuresFiltered);
  };

  // Open the map view
  const onMapButtonPress = (): void => {
    props.navigation && props.navigation.navigate('AroundMeMap');
  };

  // Open the country information view
  const onCountryButtonPress = (): void => {
    if (currentCountry) {
      props.navigation && props.navigation.navigate('AroundMeCountry', {
        Country: currentCountry,
      });
    } else {
      showAlertMessage(
        I18n.t('No country available'),
        I18n.t('Show before the country on the map'),
      );
    }
  };

  // Back to the previous view
  const navigateBack = () => {
    props.navigation.goBack();
  };

  // Open the structure details view
  const onDetailsButtonPress = (idStructure: string, index: number, distance: number): void => {
    props.navigation && props.navigation.navigate('AroundMeDetails', { idStructure: idStructure, distance: distance });
  };

  // Show the alert messahe
  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

  const renderStructureItem = ({ item, index }) => (
    <StructureItem
      index={index}
      item={item}
      onListviewButtonPress={onDetailsButtonPress}
    />
  );

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowBackIcon}
      onPress={navigateBack}
    />
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={I18n.t('AroundMe - List')}
        titleStyle={styles.topBarTitle}
        leftControl={renderDrawerAction() }
        style={styles.topBar}
      />
      <Spinner
        visible={loading}
        textContent={I18n.t('Please wait') + '...'}
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
          <Input
            autoCapitalize='none'
            placeholder={I18n.t('Enter the term to filter the search')}
            value={searchterm}
            onChangeText={text => onTextChange(text)}
          />
        </View>
        <List
          data={searchMarkers}
          renderItem={renderStructureItem}
        />
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
          <Text style={styles.downTextBold}>{currentCountry}</Text>
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
    paddingTop: 10,
    backgroundColor: 'background-basic-color-4',
  },
  downText: {
    textAlign: 'center',
    color: 'color-light-100',
  },
  downTextBold: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'color-light-100',
  },
  buttonRight: {
    width: '50%',
    height: 'auto',
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: 'background-basic-color-4',
  },
  buttonLeft: {
    width: '50%',
    height: 'auto',
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
    alignItems: 'center',
    backgroundColor: 'background-basic-color-4',
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'background-basic-color-4',
  },
  filtersContainer: {
    paddingHorizontal: 10,
    paddingBottom: 4,
    backgroundColor: 'background-basic-color-4',
  },
  button: {
    width: '100%',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
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
