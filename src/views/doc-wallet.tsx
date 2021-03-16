import React, { useEffect } from 'react';
import { Image, View, ListRenderItemInfo } from 'react-native';
import { Button, Divider, List, Layout, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Modal as ModalUiKitten, Input, Icon } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuGridList } from '../components/menu-grid-list.component';
import { DocumentItem } from './doc-wallet/document-item.component';
import { requestCameraPermission, requestExternalWritePermission } from '../services/image-picker';
import { MenuIcon } from '../components/icons';
import { Document } from './doc-wallet/data';
import {
  ImagePickerResponse,
  MediaType,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-env';
import I18n from './../i18n/i18n';
import FormData from 'form-data';
import slugify from '@sindresorhus/slugify';
import Spinner from 'react-native-loading-spinner-overlay';

import { ImageStyle, ImageSourcePropType } from 'react-native';
import { ThemedIcon } from '../components/themed-icon.component';
/*import {
 AssetTakePhotoDarkIcon,
 AssetTakePhotoIcon,
 AssetPhotoLibraryDarkIcon,
 AssetPhotoLibraryIcon,
} from '../components/icons';*/
import { MenuItem } from '../model/menu-item.model';
/*const initialDocuments: Document[] = [
  Document.passportDocument(),
  Document.idDocument(),
  Document.vaccinationPage1(),
  Document.vaccinationPage2(),
  Document.testDoc1(),
  Document.testDoc2(),
];*/

export interface LayoutData extends MenuItem {
  route: string;
}

const initialFileResponse: ImagePickerResponse = {
  base64: '',
  uri: '',
  width: 0,
  height: 0,
  fileSize: 0,
  type: '',
  fileName: '',
};

export const CustomTakePhotoIcon = (props) => (
  <Icon {...props} name='custom-take-photo' pack='assets' />
);
export const CustomFromLibraryIcon = (props) => (
  <Icon {...props} name='custom-from-library' pack='assets' />
);

export const DocWalletScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [documents, setDocuments] = React.useState([]);
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [modalFileVisible, setmodalFileVisible] = React.useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = React.useState(false);
  const [documentDelete, setDocumentDelete] = React.useState((): any => {});
  const [documentDeleteIndex, setDocumentDeleteIndex] = React.useState(0);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [generatedToken, setGeneratedToken ] = React.useState('');
  const [modalUploadImageVisible, setModalUploadImageVisible] = React.useState(false);
  const [documentTitle, setDocumentTitle] = React.useState('');
  const [fileResponse, setFileResponse] = React.useState<ImagePickerResponse>(initialFileResponse);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const ZoomImage = (): void => {
    setmodalFileVisible(true);
  };

  const onItemUploadPhotoPress = (index: number): void => {
    if (index === 0) {
      getPhoto('camera');
    } else if (index === 1) {
      getPhoto('library');
    }
  };

  const onItemRemove = (document: Document, index: number): void => {
    // DeleteDocument(document,index);
    setDocumentDelete(document);
    setDocumentDeleteIndex(index);
    setModalDeleteVisible(true);

  };

  async function DeleteDocument() {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    axios
    .delete(AppOptions.getServerUrl() + 'documents/' + documentDelete.idDocument, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      setLoading(false);
      documents.splice(documentDeleteIndex, 1);
      setDocuments([...documents]);
      setModalDeleteVisible(false);
      // alert('removed');
    })
    .catch(function (error) {
      setLoading(false);
      // alert(JSON.stringify(error));
      throw error;
    });
  }

  async function LoadFile(document) {

    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    axios
    .get(AppOptions.getServerUrl() + 'documents-base64/' + document.idDocument, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      setLoading(false);
      const image = 'data:' + document.mimeType + ';base64,' + response.data;
      props.navigation && props.navigation.navigate('DocDetails', { item: document, image: image });
    })
    .catch(function (error) {
      // console.log(error);
      setLoading(false);
      // alert(JSON.stringify(error));
      throw error;
    });

  }

  const onItemPress = (document: Document, index: number): void => {
    LoadFile(document);
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  const renderDocumentItem = (info: ListRenderItemInfo<Document>): React.ReactElement => (
    <DocumentItem
      style={styles.item}
      index={info.index}
      document={info.item}
      onRemove={onItemRemove}
      onItemPress={onItemPress}
    />
  );

  const onGenerateTokenButtonPress = async (): Promise<void> => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    axios.post(AppOptions.getServerUrl() + 'users-token', null, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function(response) {
      setLoading(false);
      setGeneratedToken(response.data.token);
      setmodalVisible(true);
    })
    .catch(function (error) {
      setLoading(false);
      showAlertMessage(
        I18n.t('Error generating token'),
        error.message,
      );
    });
  };

  async function getMyDocuments() {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    axios
    .get(AppOptions.getServerUrl() + 'documents', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      setLoading(false);
      setDocuments(response.data);
      // alert(JSON.stringify(response));
    })
    .catch(function (error) {
      setLoading(false);
      // alert(JSON.stringify(error));
      throw error;
    });
  }

  useEffect(() => {
    getButtons();
    getMyDocuments();
  }, []);

  async function getButtons() {
    const buttonsArray = [];
    buttonsArray.push(
      {
        title: I18n.t('Take Photo'),
        route: 'TakePhoto',
        icon: (style: ImageStyle) => {
          return React.createElement(
            ThemedIcon,
            { ...style, light: CustomTakePhotoIcon, dark: CustomTakePhotoIcon },
          );
        },
      },
    );
    buttonsArray.push(
      {
        title: I18n.t('From Library'),
        route: 'LibraryPhoto',
        icon: (style: ImageStyle) => {
          return React.createElement(
            ThemedIcon,
            { ...style, light: CustomFromLibraryIcon, dark: CustomFromLibraryIcon },
          );
        },
      },
    );
    setData(buttonsArray);
  }
  /*export const data: LayoutData[] = [
  {
    title: I18n.t('Take Photo'), // 'Take Photo',
    route: 'TakePhoto',
    icon: (style: ImageStyle) => {
      return React.createElement(
        ThemedIcon,
        { ...style, light: AssetTakePhotoIcon, dark: AssetTakePhotoDarkIcon },
      );
    },
  },
  {
    title: I18n.t('From Library'), // 'From Library',
    route: 'LibraryPhoto',
    icon: (style: ImageStyle) => {
      return React.createElement(
        ThemedIcon,
        { ...style, light: AssetPhotoLibraryIcon, dark: AssetPhotoLibraryDarkIcon },
      );
    },
  },
  ];*/

  // * IMAGE PICKER *
  const getPhoto = async (type: string) => {
    const mediaTypePhoto: MediaType = 'photo';

    if (type === 'camera') {
      const options = {
        mediaType: mediaTypePhoto,
        PhotoQuality: 1,
        saveToPhotos: true,
      };

      const isCameraPermitted = await requestCameraPermission();
      const isStoragePermitted = await requestExternalWritePermission();

      if (isCameraPermitted && isStoragePermitted) {
        launchCamera(options, (response) => {
          managePhoto(response);
        });
      }
    } else {
      const options = {
        mediaType: mediaTypePhoto,
        PhotoQuality: 1,
      };

      launchImageLibrary(options, (response) => {
        managePhoto(response);
      });
    }
  };

  const managePhoto = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      showAlertMessage(
        I18n.t('Photo canceled'),
        I18n.t('User canceled the operation'),
      );
      return;
    } else if (response.errorCode === 'camera_unavailable') {
      showAlertMessage(
        I18n.t('Camera not available'),
        I18n.t('Camera not available on this device'),
      );
      return;
    } else if (response.errorCode === 'permission') {
      showAlertMessage(
        I18n.t('Camera permission needed'),
        I18n.t('Please turn on the camera permission on this device for this app'),
      );
      return;
    } else if (response.errorCode === 'other') {
      showAlertMessage(
        I18n.t('Generic error'),
        response.errorMessage,
      );
      return;
    }

    setFileResponse(response);
    setModalUploadImageVisible(true);
  };

  /* IMAGE UPLOAD */
  const handleUpload = async () => {
    if (!documentTitle) {
      showAlertMessage(
        I18n.t('Title missing'),
        I18n.t('Please fill the document name'),
      );
    } else {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const extension =  fileResponse.fileName.split('.').pop();
      const fileName = slugify(documentTitle) + '.' + extension;

      const dataupload = new FormData();
      dataupload.append('file', {
        uri: fileResponse.uri,
        type: fileResponse.type,
        name: fileName,
      });

      axios.post(AppOptions.getServerUrl() + 'documents/' + documentTitle, dataupload, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(function(response) {
        setLoading(false);
        setModalUploadImageVisible(false);
        showAlertMessage(
          I18n.t('Document uploaded successfully'),
          I18n.t('Document uploaded successfully to IPFS!'),
        );
        getMyDocuments();
      })
      .catch(function (error) {
        setLoading(false);
        showAlertMessage(
          I18n.t('Error uploading file'),
          error.message,
          // JSON.stringify(error)
        );
      });
    }
  };

  /* ALERT MESSAGE */
  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={I18n.t('DocWallet')}
        titleStyle={styles.topBarTitle}
        leftControl={renderDrawerAction() }
        style={styles.topBar}
      />
      <Layout
      style={styles.container}
      level='2'>
      <Spinner
          visible={loading}
          textContent={I18n.t('Loading') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View>
          <MenuGridList
            data={data}
            onItemPress={onItemUploadPhotoPress}
          />
        </View>
        <Divider/>
        <Text
          style={styles.infoSection}>
          {I18n.t('Tap on document for the preview') + '. '
          + I18n.t('Swipe left on document to delete it') + '.' }
        </Text>
        <List
          data={documents}
          renderItem={renderDocumentItem}
        />
        <Divider/>
        <Text
          style={styles.infoSection}>
          {I18n.t('Generate a 30-minute token to be communicated to')}
        </Text>
        <Button
          style={styles.generateTokenButton}
          size='giant'
          appearance='outline'
          onPress={onGenerateTokenButtonPress}>
          {I18n.t('GENERATE A 30-MINUTE TOKEN')}
        </Button>
      </Layout>


      <ModalUiKitten
        visible={ modalUploadImageVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalUploadImageVisible(false)}
        >
        <Layout style={ styles.modal } >
          <Text style={styles.modalTitle} category='s1'>{I18n.t('Please specify a title for your document')}</Text>
          <Input
            placeholder={I18n.t('Enter Document Name')}
            value={documentTitle}
            onChangeText={setDocumentTitle}
          />
          <Layout style={styles.imageContainer}>
            <Image
                source={{uri: fileResponse.uri}}
                style={styles.imageStyle}
              />
          </Layout>
          <Button onPress={handleUpload}>{I18n.t('UPLOAD TO IPFS')}</Button>
          <Button status='basic' onPress={() => setModalUploadImageVisible(false)}>{I18n.t('CLOSE')}</Button>
        </Layout>
      </ModalUiKitten>

      <ModalUiKitten
        visible={ modalVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setmodalVisible(false)}>
        <Layout style={ styles.modal } >
          <Text style={ styles.modalText } >{I18n.t('30-Minutes Token Generated')}</Text>
          <Text style={ styles.modalText } category='h3' >{generatedToken}</Text>
          <Text style={ styles.modalText } >{I18n.t('Communicate this token only')}</Text>
          <Button status='basic' onPress={() => setmodalVisible(false)}>{I18n.t('CLOSE')}</Button>
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

      <ModalUiKitten
        visible={ modalDeleteVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalDeleteVisible(false)}>
        <Layout style={ styles.modal } >
          <Text style={ styles.modalText } category='h6' >
            {I18n.t('Are you sure to delete the selected document?')}
          </Text>
          <Button status='primary' onPress={DeleteDocument}>{I18n.t('DELETE')}</Button>
          <Button status='basic' onPress={() => setModalDeleteVisible(false)}>{I18n.t('CLOSE')}</Button>
        </Layout>
      </ModalUiKitten>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  infoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginHorizontal: 16,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
  generateTokenButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  backdrop_black: { backgroundColor: 'rgba(0, 0, 0, 1)' },
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
  errorText: {
    marginBottom: 4,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageStyle: {
    width: 150,
    height: 150,
    margin: 5,
  },
  spinnerTextStyle: {
    color: '#FFF',
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
