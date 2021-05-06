// React import
import React, { useEffect } from 'react';

// React Native import
import { View , ScrollView, Image, Modal } from 'react-native';
import {FlatListSlider} from 'react-native-flatlist-slider';
import ImageViewer from 'react-native-image-zoom-viewer';

// UIKitten import
import { Input, Button, StyleService, Text, TopNavigation, TopNavigationAction,
  useStyleSheet, Layout, Modal as ModalUiKitten } from '@ui-kitten/components';

// Environment import
import { AppOptions } from '../services/app-env';

// Locale import
import I18n from './../i18n/i18n';

// Map
import MapView, {PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import openMap from 'react-native-open-maps';

// Component import
import { ArrowBackIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

// Axios import
import axios from 'axios';

// AsyncStorage import
import AsyncStorage from '@react-native-async-storage/async-storage';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';

export const AroundMeDetailsScreen = (props): React.ReactElement => {
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

  const { idStructure, distance } = props.route.params;

  // Get Token from Redux
  const token = useSelector(selectToken);

  // Use effect
  useEffect(() => {
    getStructureInformation();
  }, []);

  // Back to the previous view
  const navigateBack = () => {
    props.navigation.goBack();
  };

  // Start the device navigator, passing the structure coordinates
  const onNavigatorButtonPress = (): void => {
    openMap({
      latitude: structure.latitude,
      longitude: structure.longitude,
      end: structure.address + ', ' + structure.city,
    });
  };

  // Show the modal to send the message
  const onContactButtonPress = (): void => {
    setmodalContactVisible(true);
  };

  // Send the message to the structure
  const onSendMessage = async () => {
    // Check if entered the message
    if (!contactMessage) {
      showAlertMessage(
        I18n.t('Message missing'),
        I18n.t('Please enter the message'),
      );
      return;
    }

    // Show spinner
    setLoading(true);

    // Send the message to the structure
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
        // Hide spinner
        setLoading(false);

        // Hide the message modal
        setmodalContactVisible(false);

        // Show the success message
        showAlertMessage(
          I18n.t('Message sent successfully'),
          I18n.t('Message sent successfully to the stucture'),
        );
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);

        // Show the error message
        showAlertMessage(
          I18n.t('Error sending message'),
          I18n.t('An error has occurred, please try again'),
        );
      });
  };

  // Zoom on the selected image
  const onZoomImage = (): void => {
    setmodalVisible(true);
  };

  // Get the structure information
  async function getStructureInformation() {
    // Show spinner
    setLoading(true);

    // Get current language
    let lang = await AsyncStorage.getItem('lang');
    lang = lang.substring(0, 2);

    // Set the filters and relations
    const filters = `?filter={"include":[`
        + `{"relation": "icon"},`
        + `{"relation": "structureCategory", "scope":`
          + `{"include": [{"relation": "category", "scope":`
          + `{"include": [{"relation": "categoryLanguage", "scope": {"where": {"language": "` + lang + `"}}}]}`
        + `}]}`
      + `},`
      + `{"relation": "structureImage"},`
      + `{"relation": "structureLanguage", "scope": {"where": {"language": "` + lang + `"}}}`
    + `]}`;

    axios
      .get(AppOptions.getServerUrl() + `structures/` + idStructure + filters, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);

        // Set the structure information
        setStructure(response.data);

        // Set the structure images
        const imagesData: any = response.data.structureImage;
        const ImagesArray = [];

        if (imagesData) {
          imagesData.map( (element) => {
            const imgObj = {
              url: AppOptions.getServerUrl() +
                'galleries/structures/' + element.folder + '/' +
                element.filename,
              desc: '',
              props: {},
            };

            ImagesArray.push(imgObj);
          });
        }

        setImages(ImagesArray);

        // Set the stucture description
        const langData: any = response.data.structureLanguage;

        if (langData) {
          langData.map((element) => {
            if (element.language === 'en') {
              setStructureDescription(element.description);
            }
          });
        }
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);

        // Show the error message
        showAlertMessage(
          I18n.t('Error getting structure information'),
          I18n.t('An error has occurred, please try again'),
        );
      });
  }

  // Show the alert message
  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

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
        title={I18n.t('AroundMe - Details')}
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
        <Layout style={styles.header}>
          {(images && images.length > 0 && (
            <FlatListSlider
              data={images}
              onPress={ onZoomImage }
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
              style={styles.description}>
              {structureDescription}
            </Text>
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
                  }}>
                  { structure.latitude && structure.longitude && (
                    <Marker
                      coordinate={{
                        latitude : structure.latitude,
                        longitude : structure.longitude,
                      }}>
                      <View>
                        { structure.icon && structure.icon.marker && (
                          <Image
                            source={ { uri: 'data:image/png;base64,' + structure.icon.marker } }
                            style={{ height: 37, width: 32 }}
                          />
                        )}
                      </View>
                    </Marker>
                  )}
                </MapView>
              )}
            </Layout>
            <View style={styles.elementSubcontainer}>
              <Text style={styles.latlon}>
                {I18n.t('Latitude') + ':'}
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
            <Layout style={styles.buttonLeft}>
              <Button
                style={styles.button}
                status='primary'
                size='small'
                onPress={onNavigatorButtonPress}>
                {I18n.t('Start the navigator')}
              </Button>
            </Layout>
            <Layout style={styles.buttonRight} >
              <Button
                style={styles.button}
                status='primary'
                size='small'
                onPress={onContactButtonPress}>
                {I18n.t('Contact us')}
              </Button>
            </Layout>
          </Layout>
        </Layout>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={ () => setmodalVisible(false) }>
        <ImageViewer
          imageUrls={images}
          enableSwipeDown={true}
          onSwipeDown={ () => setmodalVisible(false) }
        />
      </Modal>
      <ModalUiKitten
        visible={modalContactVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={ () => setmodalContactVisible(false) }>
        <Layout style={ [styles.modal, styles.modalContact] }>
          <Text
            style={styles.modalTitle}
            category='s1'>
            {I18n.t('Write your request')}
          </Text>
          <Input
            placeholder={I18n.t('Enter the message')}
            value={contactMessage}
            onChangeText={setContactMessage}
            multiline={true}
            textStyle={{ minHeight: 90, textAlignVertical: 'top' }}
          />
          <Layout style={styles.modalButtonsContainer}>
            <Layout style={styles.buttonLeftModal}>
              <Button onPress={onSendMessage}>{I18n.t('SEND')}</Button>
            </Layout>
            <Layout style={styles.buttonRightModal}>
              <Button
                status='basic'
                onPress={() => setmodalContactVisible(false)}>
                {I18n.t('CLOSE')}
              </Button>
            </Layout>
          </Layout>
        </Layout>
      </ModalUiKitten>
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
  backdrop: {
    /* backgroundColor: 'rgba(0, 0, 0, 0.5)', */
  },
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
