import React, { useEffect } from 'react';
import { View , ScrollView, Image, Platform, Modal } from 'react-native';
import {
  Input, Button, Divider, List, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Layout, Icon, ListItem, Modal as ModalUiKitten,
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
import openMap from 'react-native-open-maps';
import { ConversationListScreen } from 'src/scenes/messaging/conversation-list.component';
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
  const [modalContactVisible, setmodalContactVisible] = React.useState(false);
  const styles = useStyleSheet(themedStyles);
  const [structure, setStructure] = React.useState( (): any => [] );
  const [structureDescription, setStructureDescription] = React.useState('');
  const [images, setImages] = React.useState( (): any => [] );
  const [contactMessage, setContactMessage] = React.useState('');
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  );

  const onNavigatorButtonPress = (): void => {
    openMap({
      latitude: structure.latitude,
      longitude: structure.longitude,
      end: structure.address + ', ' + structure.city,
    });
  };

  const onContactButtonPress = (): void => {
    setmodalContactVisible(true);
  };

  /* ALERT MESSAGE */
  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

  const handleSend = async () => {
    if (!contactMessage) {
      showAlertMessage(
        I18n.t('Message missing'),
        I18n.t('Please fill the Message'),
      );
    } else {
      const token = await AsyncStorage.getItem('token');

    }
  };


  const ZoomImage = (): void => {
    setmodalVisible(true);
  };

   async function getStructure() {
    const token = await AsyncStorage.getItem('token');


    axios
    .get(AppOptions.getServerUrl() + `structures/` + idStructure + `?filter={"include":[`
    + `{"relation": "icon"},`
    + `{"relation": "structureCategory", "scope":`
    + `{"include": [{"relation": "category", "scope":`
    + `{"include": [{"relation": "categoryLanguage", "scope": {"where": {"language": "en"}}}]}`
    + `}]}`
    + `},`
    + `{"relation": "structureImage"},`
    + `{"relation": "structureLanguage", "scope": {"where": {"language": "en"}}}`
    + `]}`
    , {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {

      setStructure(response.data);

      const image_data: any = response.data.structureImage;
      const ImagesArray = [];
      image_data.map( (element) => {
        const imgObj = {
          url: AppOptions.getServerUrl() +
          'galleries/structures/' + element.folder + '/' +
          element.filename, desc: '', props: {} };
        ImagesArray.push( imgObj );
      });
      setImages(ImagesArray);

      const lang_data: any = response.data.structureLanguage;
      lang_data.map( (element) => {
        if (element.language === 'en') {
          setStructureDescription(element.description);
        }
      });

      // get images
      /*axios
      .get(AppOptions.getServerUrl() + 'structures/' + idStructure + '/structures-images', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (images_response) {
        const image_data: any = images_response.data;
        const ImagesArray = [];
        image_data.map( (element) => {
          const imgObj = {
            url: AppOptions.getServerUrl() +
            'galleries/structures/' + element.folder + '/' +
            element.filename, desc: '', props: {} };
          ImagesArray.push( imgObj );
        });
        setImages(ImagesArray);
      })
      .catch(function (error) {
        // throw error;
      });
      // get description
      axios
      .get(AppOptions.getServerUrl() + 'structures/' + idStructure + '/structures-languages', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (lang_response) {
        const data: any = lang_response.data;
        data.map( (element) => {
          if (element.language === 'en') {
            setStrucureDescription(element.description);
          }
        });
      })
      .catch(function (error) {
        // throw error;
      });
      //*/
    })
    .catch(function (error) {
       alert(JSON.stringify(error));
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
  {(images && images.length > 0 && (
  <FlatListSlider
    data={images}
    onPress={ ZoomImage }
    autoscroll={false}
    loop={false}
    imageKey={'url'}
  />
  ))}
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
    >{structureDescription}</Text>

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
      { structure.latitude && structure.longitude && (
      <Marker coordinate={{ latitude : structure.latitude , longitude : structure.longitude }}>
      <View>{ structure.icon && structure.icon.marker && (
              <Image
                  source={ { uri: 'data:image/png;base64,' + structure.icon.marker } }
                  style={{ height: 37, width: 32 }}
                  />
      ) }
      </View>
      </Marker>
      )}
    </MapView>
    )}
    </Layout>

    <View style={styles.elementSubcontainer}>
          <Text>{I18n.t('Latitude') + ':'} <Text>{structure.latitude}</Text></Text>
    </View>
    <View style={styles.elementSubcontainer}>
          <Text>{I18n.t('Longitude') + ':'} <Text>{structure.longitude}</Text></Text>
    </View>

  </Layout>
  <Layout style={styles.buttonsContainer}>
         <Layout style={styles.buttonLeft} >
          <Button style={styles.button} status='basic' size='small'
          onPress={onNavigatorButtonPress}>{I18n.t('Start the navigator')}</Button>
         </Layout>
         <Layout style={styles.buttonRight} >
          <Button style={styles.button} status='basic'
            size='small' onPress={onContactButtonPress}>{I18n.t('Contact us')}</Button>
         </Layout>
  </Layout>

</Layout>

</ScrollView>

<Modal
visible={modalVisible}
transparent={true} // backdropStyle={styles.backdrop}
onRequestClose={ () => setmodalVisible(false) } // onBackdropPress={ () => setmodalVisible(false) }
>
  <ImageViewer
  imageUrls={images}
  enableSwipeDown={true}
  onSwipeDown={ () => setmodalVisible(false) }
  />
</Modal>

<ModalUiKitten
visible={modalContactVisible}
backdropStyle={styles.backdrop}
onBackdropPress={ () => setmodalContactVisible(false) }
>
<Layout style={ [styles.modal, styles.modalContact] } >
          <Text style={styles.modalTitle} category='s1'>{I18n.t('Write your request')}</Text>
          <Input
            placeholder={I18n.t('Enter Message')}
            value={contactMessage}
            onChangeText={setContactMessage}
            multiline={true}
            textStyle={{ minHeight: 64 }}
          />
          <Button onPress={handleSend}>{I18n.t('SEND')}</Button>
          <Button status='basic' onPress={() => setmodalContactVisible(false)}>{I18n.t('CLOSE')}</Button>
        </Layout>
</ModalUiKitten>

<ModalUiKitten
        visible={ modalAlertVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalAlertVisible(false)}
        >
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
  modal: {
    textAlign: 'center',
    margin: 12,
    padding: 12,
  },
  modalContact: {
    width: 280,
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
