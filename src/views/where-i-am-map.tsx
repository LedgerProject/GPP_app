import React, { useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import {
  Button, Divider, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Layout, Select, Modal as ModalUiKitten,
} from '@ui-kitten/components';
import { MenuIcon } from '../components/icons';
// import { categoryOptions } from './where-i-am/data-category';
import { getBoundByRegion } from '../services/maps';
import MapView, {PROVIDER_GOOGLE, Marker, Callout, CalloutSubview } from 'react-native-maps';
import { Region } from 'react-native-maps';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-options';
import Geocoder from 'react-native-geocoding';
import I18n from './../i18n/i18n';
import GetLocation from 'react-native-get-location';
import Spinner from 'react-native-loading-spinner-overlay';

// Initialize the module (needs to be done only once)
Geocoder.init( AppOptions.getGeocoderApiKey() , {language : 'en'});

const { height, width } = Dimensions.get( 'window' );
const INITIAL_LATITUDE_DELTA = 40;
const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * (width / height);

interface RegionBoudaries {
  northWestLatitude: number;
  northWestLongitude: number;
  southEastLatitude: number;
  southEastLongitude: number;
}

const initialMapRegion: Region = {
  latitude: 48.368141,
  longitude: 35.412676,
  latitudeDelta: INITIAL_LATITUDE_DELTA,
  longitudeDelta: INITIAL_LONGITUDE_DELTA,
};

const initialBoudaries: RegionBoudaries = {
  northWestLatitude: 0,
  northWestLongitude: 0,
  southEastLatitude: 0,
  southEastLongitude: 0,
};

export const WhereIAmMapScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  const [mapRegion, setMapRegion] = React.useState<Region>();
  const [regionBoundaries, setRegionBoundaries] = React.useState<RegionBoudaries>(initialBoudaries);
  const [isMapReady, setMapReady] = React.useState(false);
  const [filterCategory, setFilterCategory] = React.useState(null);
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [markers, setMarkers] = React.useState([]);
  const [currentCountry, setCurrentCountry] = React.useState('');
  const [avoidNextRegionComplete, setAvoidNextRegionComplete] = React.useState(true);
  const [latitudeDelta, setLatitudeDelta] = React.useState(INITIAL_LATITUDE_DELTA);
  const [longitudeDelta, setLongitudeDelta] = React.useState(INITIAL_LONGITUDE_DELTA);
  const [loading, setLoading] = React.useState(false);
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');

  // Init functions
  useEffect(() => {
    getCategories();
    getCurrentPosition();
  }, []);

  // When map is ready set state to true (useful to show zoom controls)
  const handleMapReady = () => {
    setMapReady(true);
  };

  function getCurrentPosition() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
    .then(location => {
      const latDelta = 1;
      const lonDelta = latDelta * (width / height);

      setLatitudeDelta(latDelta);
      setLongitudeDelta(lonDelta);

      const initialRegion: Region = {
        latitude: location.latitude,
        longitude: location.longitude,
        // latitude: 41.9027835,
        // longitude: 12.4963655,
        latitudeDelta: latDelta,
        longitudeDelta: lonDelta,
      };

      setAvoidNextRegionComplete(false);

      setMapRegion(initialRegion);
    })
    .catch(error => {
      setMapRegion(initialMapRegion);
      // const { code, message } = error;
      // console.log(code, message);
    });
  }

  // Get the filter categories
  async function getCategories() {
    let x = 0;
    const token = await AsyncStorage.getItem('token');

    axios
      .get(AppOptions.getServerUrl() + 'categories', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
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

  // Get the markers from the endpoint, based on the region coordinates
  async function getMarkers(
    northWestLatitude,
    northWestLongitude,
    southEastLatitude,
    southEastLongitude,
    filterCat = null,
  ) {
    setLoading(true);
    // Remove the current markers on the map
    setMarkers([]);

    // Define the category filter
    let addCategory = '';
    if (filterCat) {
      addCategory = ' ,"idCategory": "' + filterCat.idCategory + '" ';
    }

    // Get current token
    const token = await AsyncStorage.getItem('token');

    // Define filters
    const where = `"where": {`
        + `"latitudeNorthWest": ` + northWestLatitude
        + `,"longitudeNorthWest": ` + northWestLongitude
        + `,"latitudeSouthEast": ` + southEastLatitude
        + `,"longitudeSouthEast": ` + southEastLongitude
        + addCategory
      + `},`;

    // Define fields
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
        + `,"iconimage": false`
        + `,"iconmarker": true`
      + `}`;

    // Get the structures based on coordinates and filters
    axios
      .get(AppOptions.getServerUrl() + 'structures/?filter={' + where + fields + '}', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        setLoading(false);
        setMarkers(response.data);
      })
      .catch(function (error) {
        setLoading(false);
        // alert(JSON.stringify(error));
        throw error;
      });
  }

  // Event on select the category
  const onSelectCategory = (option) => {
    setFilterCategory(option);

    getMarkers(
      regionBoundaries.northWestLatitude,
      regionBoundaries.northWestLongitude,
      regionBoundaries.southEastLatitude,
      regionBoundaries.southEastLongitude,
      option,
    );
  };

  // Event to show the list
  const onListButtonPress = (): void => {
   if (markers.length) {
    props.navigation && props.navigation.navigate('WhereIAmList', {
      regionBoundaries: regionBoundaries,
      option: filterCategory,
      Country: currentCountry,
    });
   } else {
    showAlertMessage(
      I18n.t('Structures Error'),
      I18n.t('No Structure Found'),
    );
   }
  };

  // Event to show the country information
  const onCountryButtonPress = (): void => {
    if (currentCountry) {
      props.navigation && props.navigation.navigate('WhereIAmCountry', { Country: currentCountry});
    } else {
      showAlertMessage(
        I18n.t('Country Error'),
        I18n.t('No Country Selected'),
      );
    }
  };

  const onMarkerPress = (): void => {
    setAvoidNextRegionComplete(true);
  };

  const onPanDragMap = (): void => {
    setAvoidNextRegionComplete(false);
  };

  // Event on Google Maps region change
  const onRegionChange = (curMapRegion) => {
    // Get the map boundaries
    const boundaries = getBoundByRegion(curMapRegion);

    // Set the map boundaries
    setRegionBoundaries(boundaries);

    if (avoidNextRegionComplete === false && latitudeDelta < 1.5) {
      setAvoidNextRegionComplete(true);

      // Get the markers from the endpoint
      getMarkers(
        boundaries.northWestLatitude,
        boundaries.northWestLongitude,
        boundaries.southEastLatitude,
        boundaries.southEastLongitude,
        filterCategory,
      );

      // Get the country based on current map region coordinates
      Geocoder.from(curMapRegion.latitude, curMapRegion.longitude)
        .then(json => {
          let countryLong = '';
          let countryShort = '';
          const addressLength = json.results[0].address_components.length;

          for (let i = 0; i < addressLength; i++) {
            if (json.results[0].address_components[i].short_name.length === 2) {
              countryLong = json.results[0].address_components[i].long_name;
              countryShort = json.results[0].address_components[i].short_name;
            }
          }

          setCurrentCountry(countryLong);
        })
        .catch(error => {
          // console.log(error)
        });
    }
  };

  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={I18n.t('Structures Map')}
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <Spinner
          visible={loading}
          textContent={I18n.t('Loading') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
      <ScrollView>
        <Layout style={styles.filtersContainer}>
          <Text style={styles.labelWhat}>{I18n.t('What are you searching for') + '?'}</Text>
          <Select
                {...props}
                style={styles.select}
                selectedOption={filterCategory}
                data={categoryOptions}
                placeholder={I18n.t('Show All')}
                onSelect={onSelectCategory}
              />
        </Layout>
        <Layout style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={isMapReady ? styles.Map : {}}
            initialRegion={mapRegion}
            onRegionChangeComplete={onRegionChange}
            zoomControlEnabled={true}
            onMapReady={handleMapReady}
            onPanDrag={onPanDragMap}
            >
            {
              markers.map( (structure, index) => {
                return (
                <Marker
                  key={index}
                  coordinate={{ latitude: structure.latitude, longitude: structure.longitude }}
                  // image={{ uri: 'data:image/png;base64,' + structure.iconmarker }}
                  onPress={onMarkerPress}
                >
            <View>
              <Image
                  source={ { uri: 'data:image/png;base64,' + structure.iconmarker } }
                  style={{ height: 37, width: 32 }}
                  />
            </View>
          <Callout style={styles.callout} onPress={(e) => {
              props.navigation && props.navigation.navigate('WhereIAmDetails',
              { idStructure: structure.idStructure });
            }}
            >
            <View>
              <Text category='s1' style={styles.bold}>{structure.structurename}</Text>
              <Text>{structure.address}</Text>
              <Text>{structure.city }</Text>
              <Button size='small' appearance='outline' status='basic'>{I18n.t('Structure Details')}</Button>

            </View>
          </Callout>

                </Marker>
                );
              })
            }
            </MapView>
        </Layout>
        <Layout style={styles.buttonsContainer}>
         <Layout style={styles.buttonLeft} >
          <Button style={styles2.button} status='basic' size='small'
            onPress={onListButtonPress}>{I18n.t('Show List')}
          </Button>
         </Layout>
         <Layout style={styles.buttonRight} >
          <Button style={styles2.button} status='basic'
            size='small' onPress={onCountryButtonPress}>{I18n.t('Country Informations')}</Button>
         </Layout>
        </Layout>
        <Layout style={styles.downContainer}>
          <Text style={styles.downText}>{I18n.t('Now you are on') + ':'}</Text>
          <Text style={styles.downTextBold}>{currentCountry}</Text>
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
      </ScrollView>
    </SafeAreaLayout>
  );
};

const styles2 = StyleSheet.create({
  button: { width: '100%' },
});

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
    width: '50%',
    height: 'auto',
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonLeft: {
    width: '50%',
    height: 'auto',
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  filtersContainer: {
    marginHorizontal: 10,
  },
  mapContainer: {
    width: '100%',
  },
  Map: {
    width: '100%',
    height: 350,
    margin: 0,
  },
  button: {
    width: '100%',
  },
  callout: {
    width: 180,
  },
  bold: {
    fontWeight: 'bold',
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
});
