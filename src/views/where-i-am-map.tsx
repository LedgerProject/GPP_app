import React, { useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { Button, Divider, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout, Select } from '@ui-kitten/components';
import { MenuIcon } from '../components/icons';
// import { categoryOptions } from './where-i-am/data-category';
import { getBoundByRegion } from '../services/maps';
import MapView, {PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Region } from 'react-native-maps';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-options';
import Geocoder from 'react-native-geocoding';
import I18n from './../i18n/i18n';
import GetLocation from 'react-native-get-location';

// Initialize the module (needs to be done only once)
Geocoder.init('AIzaSyB0V5h9bq_CfW2Z9pVJHFJI8oiZ8NfdjUY', {language : 'en'});

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
        latitudeDelta: latDelta,
        longitudeDelta: lonDelta,
      };

      setAvoidNextRegionComplete(false);

      setMapRegion(initialRegion);
    })
    .catch(error => {
      setMapRegion(initialMapRegion);
      const { code, message } = error;
      console.warn(code, message);
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
        categoryArray.push( { index: x, text: 'Show All', idCategory: '' } );
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
        + `"idStructureCategory": false`
        + `,"idStructure": true`
        + `,"idCategory": false`
        + `,"identifier": false`
        + `,"structureAlias": true`
        + `,"structureName": true`
        + `,"structureAddress": true`
        + `,"structureLatitude": true`
        + `,"structureLongitude": true`
        + `,"structureIdIcon": false`
        + `,"structureImage": false`
        + `,"structureMarker": true`
      + `}`;

    // Get the structures based on coordinates and filters
    axios
      .get(AppOptions.getServerUrl() + 'structures/map-search?filter={' + where + fields + '}', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        setMarkers(response.data);
      })
      .catch(function (error) {
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
    props.navigation && props.navigation.navigate('WhereIAmList',
    { regionBoundaries: regionBoundaries, option: filterCategory });
  };

  // Event to show the country information
  const onCountryButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmCountry');
    // , { idCountry: '868ec3ad-7777-4875-8048-e2a0d586ae46' });
  };

  const onMarkerPress = (): void => {
    setAvoidNextRegionComplete(true);
  };

  const onPanDragMap = (): void => {
    setAvoidNextRegionComplete(false);
  };

  // Event on Google Maps region change
  const onRegionChange = (curMapRegion) => {
    // Set the map region state
    setMapRegion(curMapRegion);

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
      Geocoder.from(mapRegion.latitude, mapRegion.longitude)
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
        .catch(error => console.warn(error));
    }
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
        title='Structures Map'
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>
        <Layout style={styles.filtersContainer}>
          <Text style={styles.labelWhat}>What are you searching for?</Text>
          <Select
                {...props}
                style={styles.select}
                selectedOption={filterCategory}
                data={categoryOptions}
                placeholder='Show All'
                onSelect={onSelectCategory}
              />
        </Layout>
        <Layout style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={isMapReady ? styles.Map : {}}
            region={mapRegion}
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
                  coordinate={{ latitude: structure.structureLatitude, longitude: structure.structureLongitude }}
                  title={structure.structureName}
                  description={structure.structureAddress + ' ' + structure.structureCity }
                  onPress={onMarkerPress}
                >
                <Image
                  source={ { uri: 'data:image/png;base64,' + structure.structureMarker } }
                  style={{ height: 37, width: 32 }}
                  />
                </Marker>
                );
              })
            }
            </MapView>
        </Layout>
        <Layout style={styles.buttonsContainer}>
         <Layout style={styles.buttonLeft} >
          <Button style={styles2.button} status='basic' size='small' onPress={onListButtonPress}>Show List</Button>
         </Layout>
         <Layout style={styles.buttonRight} >
          <Button style={styles2.button} status='basic'
            size='small' onPress={onCountryButtonPress}>Country Informations</Button>
         </Layout>
        </Layout>
        <Layout style={styles.downContainer}>
          <Text style={styles.downText}>Now you are on:</Text>
          <Text style={styles.downTextBold}>{currentCountry}</Text>
        </Layout>
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
});
