import React, { useEffect } from 'react';
import { View , ScrollView, Image, Platform, Modal, Text as TextNative } from 'react-native';
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
import { AppOptions } from '../services/app-env';
import I18n from './../i18n/i18n';
import openMap from 'react-native-open-maps';
import Spinner from 'react-native-loading-spinner-overlay';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import {
  manageToken,
  selectToken,
} from '../redux/tokenSlice';

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

export const AroundMeDetailsScreen = (props): React.ReactElement => {

  const { idStructure, distance } = props.route.params;
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
  const [loading, setLoading] = React.useState(false);

  // Get Token from REDUX
  const token = useSelector(selectToken);

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
      setLoading(true);
      // const token = await AsyncStorage.getItem('token');
      const postParams = {
        structureMessage: contactMessage,
      };
      axios
      .post(AppOptions.getServerUrl() + 'structures/' + idStructure + '/send-message', postParams, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        setLoading(false);
        setmodalContactVisible(false);
        showAlertMessage(
          I18n.t('Congratulations'),
          I18n.t('Message sent successfully'),
        );

      })
      .catch(function (error) {
        // console.log(error);
        setLoading(false);
        showAlertMessage(
          I18n.t('Error'),
          I18n.t('An error has occurred, please try again'),
        );
        // alert(JSON.stringify(error));
        throw error;
      });

    }
  };


  const ZoomImage = (): void => {
    setmodalVisible(true);
  };

   async function getStructure() {
    setLoading(true);
    // const token = await AsyncStorage.getItem('token');
    let lang = await AsyncStorage.getItem('lang');
    lang = lang.substring(0, 2);
    axios
    .get(AppOptions.getServerUrl() + `structures/` + idStructure + `?filter={"include":[`
    + `{"relation": "icon"},`
    + `{"relation": "structureCategory", "scope":`
    + `{"include": [{"relation": "category", "scope":`
    + `{"include": [{"relation": "categoryLanguage", "scope": {"where": {"language": "` + lang + `"}}}]}`
    + `}]}`
    + `},`
    + `{"relation": "structureImage"},`
    + `{"relation": "structureLanguage", "scope": {"where": {"language": "` + lang + `"}}}`
    + `]}`
    , {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      setLoading(false);
      setStructure(response.data);

      const image_data: any = response.data.structureImage;
      const ImagesArray = [];
      if (image_data) {
      image_data.map( (element) => {
        const imgObj = {
          url: AppOptions.getServerUrl() +
          'galleries/structures/' + element.folder + '/' +
          element.filename, desc: '', props: {} };
        ImagesArray.push( imgObj );
      });
      }
      setImages(ImagesArray);

      const lang_data: any = response.data.structureLanguage;
      if (lang_data) {
      lang_data.map( (element) => {
        if (element.language === 'en') {
          setStructureDescription(element.description);
        }
      });
      }

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
       setLoading(false);
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
        title={I18n.t('Details')}
        titleStyle={styles.topBarTitle}
        leftControl={renderDrawerAction() }
        style={styles.topBar}
      />
      <Spinner
          visible={loading}
          textContent={I18n.t('Loading') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
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
      style={styles.structureName}
      category='h6'>
      {structure.name}
    </Text>
    <Text
      style={styles.subtitle}
      appearance='hint'
      category='p2'>
      {structure.address} {structure.city}
    </Text>
    { distance && (
    <Text
      style={styles.price}
      category='h6'>
      { parseFloat(distance).toFixed(1) } km
    </Text>
    )}
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
          <Text style={styles.latlon}>{I18n.t('Latitude') + ':'}
           <Text style={styles.latlon}>{structure.latitude}</Text>
          </Text>
    </View>
    <View style={styles.elementSubcontainer}>
          <Text style={styles.latlon}>
            {I18n.t('Longitude') + ':'}
             <Text style={styles.latlon}>{structure.longitude}</Text>
          </Text>
    </View>

  </Layout>
  <Layout style={styles.buttonsContainer}>
         <Layout style={styles.buttonLeft} >
          <Button style={styles.button} status='primary' size='small'
          onPress={onNavigatorButtonPress}>{I18n.t('Start the navigator')}</Button>
         </Layout>
         <Layout style={styles.buttonRight} >
          <Button style={styles.button} status='primary'
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
            textStyle={{ minHeight: 90, textAlignVertical: 'top' }}
          />
  <Layout style={styles.modalButtonsContainer}>
         <Layout style={styles.buttonLeftModal} >
          <Button onPress={handleSend}>{I18n.t('SEND')}</Button>
         </Layout>
         <Layout style={styles.buttonRightModal} >
          <Button status='basic' onPress={() => setmodalContactVisible(false)}>{I18n.t('CLOSE')}</Button>
         </Layout>
  </Layout>
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
    backgroundColor: 'background-basic-color-4',
  },
  commentList: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingBottom: 8,
    backgroundColor: 'background-basic-color-4',
  },
  image: {
    height: 340,
    width: '100%',
  },
  detailsContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'background-basic-color-4',
  },
  subtitle: {
    marginTop: 4,
    color: 'color-light-100',
  },
  price: {
    position: 'absolute',
    top: 24,
    right: 16,
    color: 'color-light-100',
  },
  description: {
    marginVertical: 16,
    color: 'color-light-100',
  },
  size: {
    marginBottom: 16,
    color: 'color-light-100',
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
    color: 'color-light-100',
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
    backgroundColor: 'background-basic-color-4',
    color: 'color-light-100',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'background-basic-color-4',
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
  buttonRightModal: {
    width: '50%',
    height: 'auto',
    flex: 1,
    marginLeft: 5,
  },
  buttonLeftModal: {
    width: '50%',
    height: 'auto',
    flex: 1,
    marginRight: 5,
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
  spinnerTextStyle: {
    color: '#FFF',
  },
  structureName: {
    paddingRight: 90,
    color: 'color-light-100',
  },
  latlon: {
    color: 'color-light-100',
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
