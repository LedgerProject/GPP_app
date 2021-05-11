// React import
import React, { useEffect } from 'react';

// React Native import
import { Image, ImageStyle, View, ListRenderItemInfo } from 'react-native';
import { ImagePickerResponse, MediaType, launchCamera, launchImageLibrary } from 'react-native-image-picker';

// UIKitten import
import { Button, Divider, List, Layout, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Modal as ModalUiKitten, Input } from '@ui-kitten/components';

// Component import
import { Document, DocumentItem } from '../components/document-item.component';
import { ThemedIcon } from '../components/themed-icon.component';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuGridList } from '../components/menu-grid-list.component';
import { MenuIcon, CustomTakePhotoIcon, CustomFromLibraryIcon } from '../components/icons';

// Environment import
import { AppOptions } from '../services/app-env';

// Locale import
import I18n from './../i18n/i18n';

// Axios import
import axios from 'axios';

// Model import
import { MenuItem } from '../model/menu-item.model';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';
import { selectPrivateKey } from '../redux/privateKeySlice';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';
import FormData from 'form-data';
import { requestCameraPermission, requestExternalWritePermission } from '../services/image-picker';
import slugify from '@sindresorhus/slugify';

// LayoutData interface
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

export const DocWalletScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [documents, setDocuments] = React.useState([]);
  const [selectedDocuments, setSelectedDocuments] = React.useState([]);
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = React.useState(false);
  const [documentDelete, setDocumentDelete] = React.useState((): any => {});
  const [documentDeleteIndex, setDocumentDeleteIndex] = React.useState(0);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [generatedToken, setGeneratedToken ] = React.useState('');
  const [modalUploadImageVisible, setModalUploadImageVisible] = React.useState(false);
  const [documentTitle, setDocumentTitle] = React.useState<string>();
  const [fileResponse, setFileResponse] = React.useState<ImagePickerResponse>(initialFileResponse);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  // Get Token from Redux
  const token = useSelector(selectToken);
  const privateKey = useSelector(selectPrivateKey);

  // Use Effect
  useEffect(() => {
    setButtons();
    getMyDocuments();
    // console.log(privateKey);
  }, []);

  // Set the "Take Photo" and "From Library" buttons
  async function setButtons() {
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

  // Get the user documents from the server
  async function getMyDocuments() {
    // Show spinner
    setLoading(true);

    axios
      .get(AppOptions.getServerUrl() + 'documents', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);

        // Set the checked value for each document
        const allDocuments = response.data;

        allDocuments.forEach( (element, index) => {
          allDocuments[index].isChecked = false;
        });

        setDocuments(allDocuments);
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);

        // Show the error message
        showAlertMessage(
          I18n.t('Error loading documents'),
          I18n.t('An error has occurred, please try again'),
        );
      });
  }

  // Take Photo or From Library click event
  const onItemUploadPhotoPress = (index: number): void => {
    if (index === 0) {
      takePhoto('camera');
    } else if (index === 1) {
      takePhoto('library');
    }
  };

  // Take Photo (Image Picker)
  const takePhoto = async (type: string) => {
    const mediaTypePhoto: MediaType = 'photo';

    if (type === 'camera') {
      const options = {
        mediaType: mediaTypePhoto,
        PhotoQuality: 1,
        saveToPhotos: true,
      };

      // Check if use of camera is permitted (or request the use)
      const isCameraPermitted = await requestCameraPermission();

      // Check if the storage is permitted (or request the use)
      const isStoragePermitted = await requestExternalWritePermission();

      // If camera and storage are permitted, manage the photo
      if (isCameraPermitted && isStoragePermitted) {
        // Launch the camera to take the photo
        launchCamera(options, (response) => {
          managePhoto(response);
        });
      }
    } else {
      const options = {
        mediaType: mediaTypePhoto,
        PhotoQuality: 1,
      };

      // Launch the image library to select a photo
      launchImageLibrary(options, (response) => {
        managePhoto(response);
      });
    }
  };

  // Manage the taken or selected photo
  const managePhoto = async (response: ImagePickerResponse) => {
    // Check if the response is an error
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

    // Set the file response
    setFileResponse(response);

    // Show the modal to specify the document title
    setModalUploadImageVisible(true);
  };

  // Photo upload
  const photoUpload = async () => {
    // Check if specified the document title
    if (!documentTitle) {
      showAlertMessage(
        I18n.t('Title missing'),
        I18n.t('Please enter the document name'),
      );

      return;
    }

    // Show spinner
    setLoading(true);

    // Get the file extension
    const extension =  fileResponse.fileName.split('.').pop();

    // Set the file name + extension
    const fileName = slugify(documentTitle) + '.' + extension;

    // Set the post parameters
    const dataupload = new FormData();

    dataupload.append('file', {
      uri: fileResponse.uri,
      type: fileResponse.type,
      name: fileName,
    });
    dataupload.append('title', documentTitle);
    dataupload.append('privateKey', privateKey);

    // Send the document to the server, blockchain and ipfs
    axios
      .post(AppOptions.getServerUrl() + 'documents/upload', dataupload, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(function(response) {
        // Hide spinner
        setLoading(false);

        // Hide the modal to enter the document title
        setModalUploadImageVisible(false);

        // Show success message
        showAlertMessage(
          I18n.t('Document uploaded successfully'),
          I18n.t('Document uploaded successfully to Blockchain and IPFS!'),
        );
        setDocumentTitle('');
        // Load the user documents
        getMyDocuments();
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);

        // Show the error message
        showAlertMessage(
          I18n.t('Error uploading file'),
          error.message,
        );
      });
  };

  // On document press event (from the list)
  const onDocumentPress = (document: Document, index: number): void => {
    loadDocument(document);
  };

  // Load the selected document from Blockchain and IPFS
  async function loadDocument(document) {
    // Show spinner
    setLoading(true);
    const postParams = {
      idDocument: document.idDocument,
      privateKey: privateKey,
    };
    axios
      .post(AppOptions.getServerUrl() + 'documents/download-base64', postParams, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);

        // Set the base64 image
        const image = 'data:' + document.mimeType + ';base64,' + response.data;

        // Open the document details view
        props.navigation && props.navigation.navigate('DocWalletDetails', { item: document, image: image });
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);

        // Show the error message
        showAlertMessage(
          I18n.t('Error loading document'),
          I18n.t('An error has occurred, please try again'),
        );
      });
  }

  // On document remove event
  const onDocumentRemove = (document: Document, index: number): void => {
    // Set the document and the index to delete
    setDocumentDelete(document);
    setDocumentDeleteIndex(index);

    // Show the modal asking the delete confirmation
    setModalDeleteVisible(true);
  };

  // Try to remove the selected document
  async function deleteDocument() {
    // Show spinner
    setLoading(true);

    axios
      .delete(AppOptions.getServerUrl() + 'documents/' + documentDelete.idDocument, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);

        // Remove the document also from the list
        documents.splice(documentDeleteIndex, 1);
        setDocuments([...documents]);

        // Hide the modal asking the delete confirmation
        setModalDeleteVisible(false);
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);
        setModalDeleteVisible(false);
        // Show the error message
        showAlertMessage(
          I18n.t('Error removing document'),
          I18n.t('An error has occurred, please try again'),
        );
      });
  }

  // Document checkbox change event
  const onCheckboxChange = (value: boolean, document: Document, index: number): void => {
    const allDocuments = documents;
    const allSelectedDocuments = [];

    allDocuments[index].isChecked = value;
    allDocuments.forEach( (element) => {
      if (element.isChecked === true) {
        allSelectedDocuments.push(element.idDocument);
      }
    });
    setSelectedDocuments(allSelectedDocuments);
  };

  // Generate token event
  const onGenerateTokenButtonPress = async (): Promise<void> => {
    // Check if selected at least one document
    if (selectedDocuments.length === 0) {
      showAlertMessage(
        I18n.t('No document selected'),
        I18n.t('Please select at least one document'),
      );
    } else {
      // Show spinner
      setLoading(true);
      const postParams = {
        privateKey: privateKey,
        idDocuments: selectedDocuments,
      };
      axios
        .post(AppOptions.getServerUrl() + 'users-token', postParams, {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        })
        .then(function(response) {
          // Hide spinner
          setLoading(false);

          // Set the generated token
          setGeneratedToken(response.data.token);

          // Show the modal with the token
          setmodalVisible(true);
        })
        .catch(function (error) {
          setLoading(false);
          showAlertMessage(
            I18n.t('Error generating token'),
            error.message,
          );
        });
    }
  };

  // Alert message
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

  const renderDocumentItem = (info: ListRenderItemInfo<Document>): React.ReactElement => (
    <DocumentItem
      style={styles.item}
      index={info.index}
      document={info.item}
      onRemove={onDocumentRemove}
      onItemPress={onDocumentPress}
      onCheckboxPress={onCheckboxChange}
    />
  );

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
          textContent={I18n.t('Please wait') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View>
          <MenuGridList style={styles.buttonsContainer}
            data={data}
            onItemPress={onItemUploadPhotoPress}
          />
        </View>
        <Text
          style={styles.infoSection}>
          { I18n.t('Tap on document for the preview') + '\n'
          + I18n.t('Swipe left on document to delete it') }
        </Text>
        <List
          style={styles.listContainer}
          data={documents}
          renderItem={renderDocumentItem}
        />
        <Text
          style={styles.infoSection}>
          {I18n.t('Generate a 30-minute token')}
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
        <Layout style={ styles.modal }>
          <Text style={styles.modalTitle} category='s1'>{I18n.t('Please specify a title for your document')}</Text>
          <Input
            placeholder={I18n.t('Enter the document name')}
            value={documentTitle}
            onChangeText={setDocumentTitle}
          />
          <Layout style={styles.imageContainer}>
            <Image
              source={{uri: fileResponse.uri}}
              style={styles.imageStyle}
            />
          </Layout>
          <Layout style={styles.modalButtonsContainer}>
          <Button
            style={styles.modalButtonLeft}
            onPress={photoUpload}>
            {I18n.t('UPLOAD')}
          </Button>
          <Button
            style={styles.modalButtonRight}
            status='basic'
            onPress={() => setModalUploadImageVisible(false)}>
            {I18n.t('CLOSE')}
          </Button>
          </Layout>
        </Layout>
      </ModalUiKitten>

      <ModalUiKitten
        visible={ modalVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setmodalVisible(false)}>
        <Layout style={ styles.modal } >
          <Text style={ styles.modalText } >{I18n.t('30-Minutes Token Generated')}</Text>
          <Text style={ styles.modalText } category='h3' >{generatedToken}</Text>
          <Text style={ styles.modalText } >{I18n.t('Communicate this token')}</Text>
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
          <Layout style={styles.modalButtonsContainer}>
            <Button
            style={styles.modalButtonLeft}
            status='basic'
            onPress={() => setModalDeleteVisible(false)}>{I18n.t('CLOSE')}</Button>
            <Button
            style={styles.modalButtonRight}
            status='primary'
            onPress={deleteDocument}>{I18n.t('DELETE')}</Button>
          </Layout>
        </Layout>
      </ModalUiKitten>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-4',
  },
  buttonsContainer: {
    backgroundColor: 'background-basic-color-4',
  },
  divider: {
    backgroundColor: 'color-primary-default',
  },
  listContainer: {
    marginHorizontal: 16,
    borderRadius: 4,
    padding: 5,
  },
  safeArea: {
    flex: 1,
  },
  infoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginHorizontal: 16,
    color: 'color-light-100',
    textAlign: 'center',
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop_black: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
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
  modalButtonRight: {
    width: '100%',
    height: 'auto',
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  modalButtonLeft: {
    width: '100%',
    height: 'auto',
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
