import React, { useEffect } from 'react';
import { View , ScrollView, Modal } from 'react-native';
import {
  Input, Button, Divider, List, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Layout, Icon,
} from '@ui-kitten/components';
import { ArrowBackIcon, MenuIcon } from '../components/icons';
import {FlatListSlider} from 'react-native-flatlist-slider';
import ImageViewer from 'react-native-image-zoom-viewer';
import MapView, {PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-options';
import I18n from './../i18n/i18n';

/* export class Structure {
  constructor(
    readonly idStructure: string,
    readonly address: string,
    readonly name: string,
    readonly city: string,
    readonly email: string,
    readonly latitude: number,
    readonly longitude: number,
    readonly phoneNumber: string,
    readonly phoneNumberPrefix: string,
    readonly website: string,
    ) {  }
} */

export const WhereIAmDetailsScreen = (props): React.ReactElement => {

  const { idStructure } = props.route.params;
  const [modalVisible, setmodalVisible] = React.useState(false);
  const styles = useStyleSheet(themedStyles);
  const [structure, setStructure] = React.useState( (): any => [] );

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  );

  const onNavigatorButtonPress = (): void => {
    // props.navigation && props.navigation.navigate('WhereIAmList');
  };

  const onContactButtonPress = (): void => {
    // props.navigation && props.navigation.navigate('WhereIAmCountry');
  };

  const ZoomImage = (): void => {
    // alert(JSON.stringify(item));
    // props.navigation && props.navigation.navigate('Homepage');
    setmodalVisible(true);
  };

  const images = [
    {
     image: 'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
     desc: 'Silent Waters in the mountains in midst of Himilayas',
    },
   {
     image: 'https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80',
     desc: 'Red fort in India New Delhi is a magnificient masterpeiece of humans',
   },
   ];

   const zoom_images = [
    {
     url: 'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
     props: {},
    },
    {
     url: 'https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80',
     props: {},
    },
   ];

   async function getStructure() {
    // console.log(idStructure);

    const token = await AsyncStorage.getItem('token');
    // console.log(token);
    axios
    .get(AppOptions.getServerUrl() + 'structures/' + idStructure, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      // console.log(response.data);
      setStructure(response.data);
    })
    .catch(function (error) {
      // alert(JSON.stringify(error));
      throw error;
    });
  }

   useEffect(() => {
    getStructure();
  }, []);

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title='Details'
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>

  <Layout style={styles.header}>
  <FlatListSlider
    data={images}
    onPress={ ZoomImage }
    autoscroll={false}
    loop={false}

  />
  <Layout
    style={styles.detailsContainer}
    level='1'>
    <Text
      category='h6'>
      {structure.name}
    </Text>
    <Text
      style={styles.subtitle}
      appearance='hint'
      category='p2'>
      {structure.address} {structure.city}
    </Text>
    <Text
      style={styles.price}
      category='h4'>
      { /* structure.address */ } 0.97km
    </Text>

    <Text
      style={styles.description}
      appearance='hint'>{structure.address}</Text>

    <Layout style={styles.mapContainer}>
    { structure.latitude && structure.longitude && (
    <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.Map}
              region={{
                latitude: structure.latitude,
                longitude: structure.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
      <Marker coordinate={{ latitude : structure.latitude , longitude : structure.longitude }}
        // image={{uri: item.icon}}
      />
    </MapView>
    )}
    </Layout>

    <View style={styles.elementSubcontainer}>
          <Text>Latitude: <Text>{structure.latitude}</Text></Text>
    </View>
    <View style={styles.elementSubcontainer}>
          <Text>Longitude: <Text>{structure.longitude}</Text></Text>
    </View>

  </Layout>
  <Layout style={styles.buttonsContainer}>
         <Layout style={styles.buttonLeft} >
          <Button style={styles.button} status='basic' size='small'
          onPress={onNavigatorButtonPress}>Start the navigator</Button>
         </Layout>
         <Layout style={styles.buttonRight} >
          <Button style={styles.button} status='basic'
            size='small' onPress={onContactButtonPress}>Contact us</Button>
         </Layout>
  </Layout>

</Layout>

</ScrollView>

<Modal
visible={modalVisible}
transparent={true}
onRequestClose={ () => setmodalVisible(false) }
>
  <ImageViewer
  imageUrls={zoom_images}
  enableSwipeDown={true}
  onSwipeDown={ () => setmodalVisible(false) }
  />
</Modal>
</SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  commentList: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    marginBottom: 8,
  },
  image: {
    height: 340,
    width: '100%',
  },
  detailsContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  subtitle: {
    marginTop: 4,
  },
  price: {
    position: 'absolute',
    top: 24,
    right: 16,
  },
  description: {
    marginVertical: 16,
  },
  size: {
    marginBottom: 16,
  },
  colorGroup: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  colorRadio: {
    marginHorizontal: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  sectionLabel: {
    marginVertical: 8,
  },
  commentInputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'text-basic-color',
  },
  commentInput: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  mapContainer: {
    width: '100%',
  },
  Map: {
    width: '100%',
    height: 350,
    margin: 0,
  },
  elementSubcontainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
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
  button: { width: '100%' },
  backdrop: { /* backgroundColor: 'rgba(0, 0, 0, 0.5)', */ },
});
