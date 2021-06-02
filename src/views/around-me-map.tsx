// React import
import React, { useEffect } from 'react';

// React Native import
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

// Maps
import {PROVIDER_GOOGLE, Marker, Callout, Region } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';
import { getBoundByRegion } from '../services/maps';

// UIKitten import
import { Button, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet,
  Layout, Select, Modal as ModalUiKitten } from '@ui-kitten/components';

// Environment import
import { AppOptions } from '../services/app-env';

// Locale import
import I18n from './../i18n/i18n';

// Component import
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuIcon } from '../components/icons';

// Axios
import axios from 'axios';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';
import { Category, getCategories } from '../services/structures.service';

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
  longitude: 20.412676,
  latitudeDelta: INITIAL_LATITUDE_DELTA,
  longitudeDelta: INITIAL_LONGITUDE_DELTA,
};

const initialBoudaries: RegionBoudaries = {
  northWestLatitude: 0,
  northWestLongitude: 0,
  southEastLatitude: 0,
  southEastLongitude: 0,
};

export const AroundMeMapScreen = (props): React.ReactElement => {
  const [mapRegion, setMapRegion] = React.useState<Region>(undefined);
  const [regionBoundaries, setRegionBoundaries] = React.useState<RegionBoudaries>(initialBoudaries);
  const [isMapReady, setMapReady] = React.useState(false);
  const [filterCategory, setFilterCategory] = React.useState(null);
  const [categoryOptions, setCategoryOptions] = React.useState<Category[]>([]);
  const [markers, setMarkers] = React.useState([]);
  const [currentCountry, setCurrentCountry] = React.useState('');
  const [avoidNextRegionComplete, setAvoidNextRegionComplete] = React.useState(true);
  const [zoom, setZoom] = React.useState(40);
  const [loading, setLoading] = React.useState(false);
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [currentPosition, setCurrentPosition] = React.useState((): any => {});
  const [gpsActive, setGPSActive] = React.useState(false);
  const [initialPositionConfirmed, setInitialPositionConfirmed] = React.useState(false);
  const [deltaValue, setDeltaValue] = React.useState(0);
  const styles = useStyleSheet(themedStyles);

  // Get Token from Redux
  const token = useSelector(selectToken);
  // Use Effect
  useEffect(() => {
    setCategoriesList();
    getCurrentPosition();
  }, []);

  useEffect(() => {
    // Remove the current markers on the map if zoom > 1.0
    if (zoom > 1.0) {
      setMarkers([]);
    } else {
      if (avoidNextRegionComplete === false) {
        setAvoidNextRegionComplete(true);

        getMarkers(
          regionBoundaries.northWestLatitude,
          regionBoundaries.northWestLongitude,
          regionBoundaries.southEastLatitude,
          regionBoundaries.southEastLongitude,
          filterCategory,
          zoom,
        );
      }
    }
  }, [zoom]);

  // Get the filter categories
  const setCategoriesList = async () => {
    const categoriesArray = await getCategories(token);
    setCategoryOptions(categoriesArray);
  };

  // Get the user current position
  function getCurrentPosition() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
    .then(location => {
      const latDelta = 0.7;
      const lonDelta = latDelta * (width / height);

      setCurrentPosition({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      setGPSActive(true);

      const initialRegion: Region = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: latDelta,
        longitudeDelta: lonDelta,
      };

      setAvoidNextRegionComplete(false);

      setMapRegion(initialRegion);
    })
    .catch(error => {
      setGPSActive(false);

      setAvoidNextRegionComplete(false);

      setMapRegion(initialMapRegion);
    });
  }

  // When map is ready set state to true (useful to show zoom controls)
  const handleMapReady = () => {
    setMapReady(true);
  };

  // Get the markers from the endpoint, based on the region coordinates
  async function getMarkers(northWestLatitude, northWestLongitude, southEastLatitude, southEastLongitude,
    filterCat = null, delta = 0) {
    // Remove the current markers on the map

    setMarkers([]);
    if (delta < 1.0) {
      // Show spinner
      setLoading(true);

      // Define the category filter
      let addCategory = '';
      if (filterCat) {
        addCategory = ' ,"idCategory": "' + filterCat.idCategory + '" ';
      }

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
          // Hide spinner
          setLoading(false);

          // Show the error message
          setAlertTitle(I18n('Error getting structures'));
          setAlertMessage(I18n.t('An error has occurred, please try again'));
          setModalAlertVisible(true);
        });
    }
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
      deltaValue,
    );

  };

  // Open the structures list
  const onListButtonPress = (): void => {
    if (markers.length) {
      // Open the structures list, passing the filters, the region boundaries, the country and the current position
      props.navigation && props.navigation.navigate('AroundMeList', {
        regionBoundaries: regionBoundaries,
        selectedCategory: filterCategory,
        currentCountry: currentCountry,
        currentPosition: currentPosition,
      });
    } else {
      // Show the alert message (no structures available on the map)
    showAlertMessage(
      I18n.t('No structures available'),
      I18n.t('Search before the structures on the map, then click the list button'),
    );
    }
  };

  // Event to show the country information
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

  // Event on marker press
  const onMarkerPress = (): void => {
    setAvoidNextRegionComplete(true);
  };

  // Event on pan drag map
  const onPanDragMap = (): void => {
    setAvoidNextRegionComplete(false);
  };

  // Event on Google Maps region change
  const onRegionChange = (curMapRegion) => {
    setDeltaValue(curMapRegion.latitudeDelta);
    // Get the map boundaries
    const boundaries = getBoundByRegion(curMapRegion);

    // Set the map boundaries
    setRegionBoundaries(boundaries);
    setZoom(curMapRegion.latitudeDelta);

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
    .catch(error => {});
    // Load the structures from the server if the latitudeDelta (zoom is < 1.0)
    if (avoidNextRegionComplete === false && curMapRegion.latitudeDelta < 1.0) {
      setAvoidNextRegionComplete(true);
      // Get the markers from the endpoint
      getMarkers(
        boundaries.northWestLatitude,
        boundaries.northWestLongitude,
        boundaries.southEastLatitude,
        boundaries.southEastLongitude,
        filterCategory,
        curMapRegion.latitudeDelta,
      );
    }
  };

  const confirmInitialPosition = (): void => {
    setInitialPositionConfirmed(true);
  };

  // Show the alert message
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
        title={I18n.t('AroundMe')}
        titleStyle={styles.topBarTitle}
        leftControl={renderDrawerAction() }
        style={styles.topBar}
      />
      <Spinner
          visible={loading}
          textContent={I18n.t('Please wait') + '...'}
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
          { zoom >= 1.0 && (
            <Text style={styles.infoMapZoom}>
              {I18n.t('Zoom in to view the structures')}
            </Text>
          )}
          { zoom < 1.0 && (
            <Text style={styles.infoMapNoZoom}>
              {I18n.t('Click on a structure for details')}
            </Text>
          )}
          {mapRegion && (
            <MapView
              provider={PROVIDER_GOOGLE}
              style={isMapReady ? styles.Map : {}}
              initialRegion={mapRegion}
              region={!initialPositionConfirmed ? mapRegion : undefined}
              onRegionChange={!initialPositionConfirmed ? confirmInitialPosition : undefined}
              showsPointsOfInterest={false}
              showsBuildings={false}
              loadingEnabled={true}
              mapType={'standard'}
              onRegionChangeComplete={onRegionChange}
              zoomControlEnabled={true}
              onMapReady={handleMapReady}
              onPanDrag={onPanDragMap}>
              {
                markers.map( (structure, index) => {
                  return (
                    <Marker
                      key={index}
                      coordinate={{ latitude: structure.latitude, longitude: structure.longitude }}
                      tracksViewChanges={false}
                      onPress={onMarkerPress}>
                      <View>
                        <Image
                          source={ { uri: 'data:image/png;base64,' + structure.iconmarker } }
                          style={ { height: 37, width: 32 }}
                        />
                      </View>
                      <Callout style={styles.callout} onPress={(e) => {
                          props.navigation && props.navigation.navigate('AroundMeDetails',
                          { idStructure: structure.idStructure });
                        }}>
                        <View>
                          <Text
                            category='s1'
                            style={styles.bold}>{structure.structurename}
                          </Text>
                          <Text>{structure.address}</Text>
                          <Text>{structure.city }</Text>
                          <Button
                            size='small'
                            appearance='outline'
                            status='primary'>
                              {I18n.t('Structure Details')}
                          </Button>
                        </View>
                      </Callout>
                    </Marker>
                  );
                })
              }
              { currentPosition && gpsActive && (
                <Marker
                  key={-999}
                  coordinate={{
                    latitude: currentPosition.latitude,
                    longitude: currentPosition.longitude,
                  }}>
                </Marker>
              ) }
            </MapView>
          )}
        </Layout>
        <Layout style={styles.buttonsContainer}>
          <Layout style={styles.buttonLeft} >
            <Button
              style={styles2.button}
              status='primary'
              size='small'
              onPress={onListButtonPress}>
                {I18n.t('Show List')}
            </Button>
          </Layout>
          <Layout style={styles.buttonRight} >
            <Button
              style={styles2.button}
              status='primary'
              size='small'
              onPress={onCountryButtonPress}>
                {I18n.t('Country Informations')}
            </Button>
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
            <Button
              status='basic'
              onPress={() => setModalAlertVisible(false)}>
                {I18n.t('CLOSE')}
            </Button>
          </Layout>
        </ModalUiKitten>
      </ScrollView>
    </SafeAreaLayout>
  );
};

const styles2 = StyleSheet.create({
  button: {
    width: '100%',
  },
});

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'background-basic-color-4',
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
    paddingBottom: 10,
    backgroundColor: 'background-basic-color-4',
  },
  filtersContainer: {
    paddingHorizontal: 10,
    backgroundColor: 'background-basic-color-4',
  },
  mapContainer: {
    width: '100%',
    backgroundColor: 'background-basic-color-4',
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
  infoMapZoom: {
    textAlign: 'center',
    paddingBottom: 3,
    backgroundColor: '#F00',
    color: '#FFF',
  },
  infoMapNoZoom: {
    textAlign: 'center',
    paddingBottom: 3,
    backgroundColor: '#FFF',
    color: '#000',
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
