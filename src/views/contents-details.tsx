import React, { useEffect } from 'react';
import { Image, View, ListRenderItemInfo } from 'react-native';
import { Button, Divider, List, Layout, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Modal as ModalUiKitten, Input, Icon, Toggle } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuGridList } from '../components/menu-grid-list.component';
import { CompliantImage, CompliantImageModel } from './compliants/compliant-image.component';

import { requestCameraPermission, requestExternalWritePermission } from '../services/image-picker';
import { ArrowBackIcon, MenuIcon } from '../components/icons';

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
import { MenuItem } from '../model/menu-item.model';
import { KeyboardAvoidingView } from '../services/3rd-party';
import GetLocation from 'react-native-get-location';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';
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

export const ContentsDetailsScreen = (props): React.ReactElement => {
  const [documents, setDocuments] = React.useState((): any => {});
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [modalFileVisible, setmodalFileVisible] = React.useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = React.useState(false);
  const [documentDelete, setDocumentDelete] = React.useState((): any => {});
  const [documentDeleteIndex, setDocumentDeleteIndex] = React.useState(0);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [compliantTitle, setCompliantTitle] = React.useState('');
  const [compliantSharePosition, setCompliantSharePosition] = React.useState(false);
  const [compliantShareName, setCompliantShareName] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState((): any => {});
  const [compliantDescription, setCompliantDescription] = React.useState('');
  // const [fileResponse, setFileResponse] = React.useState<ImagePickerResponse>(initialFileResponse);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [Content, setContent] = React.useState((): any => {});
  const [remaining, setRemaining] = React.useState(5);

  const token = useSelector(selectToken);

  // const item = null;
  const styles = useStyleSheet(themedStyles);

  const { item, abuseAlarm } = props.route.params;

  const ZoomImage = (): void => {
    setmodalFileVisible(true);
  };

  const onCheckedPositionChange = (isChecked) => {
    setCompliantSharePosition(isChecked);
  };
  const onCheckedNameChange = (isChecked) => {
    setCompliantShareName(isChecked);
  };

  // Get the user documents from the server
  async function getMyDocuments(idContent) {
    // Show spinner
    setLoading(true);
    axios
      .get(AppOptions.getServerUrl() + 'contents/' + idContent + '/media' , {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);
        setDocuments(response.data);
        setRemaining(5 - response.data.length);
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);
        setRemaining(5);
        // Show the error message
        showAlertMessage(
          I18n.t('Error loading documents'),
          I18n.t('An error has occurred, please try again'),
        );
      });
  }

  const onItemUploadPhotoPress = (index: number): void => {
    if (index === 0) {
      getPhoto('camera');
    } else if (index === 1) {
      getPhoto('library');
    }
  };

  const onItemRemove = (compliantImage: CompliantImageModel, index: number): void => {
    // DeleteDocument(document,index);
    setDocumentDelete(compliantImage);
    setDocumentDeleteIndex(index);
    setModalDeleteVisible(true);

  };

  async function DeleteDocument() {
    setLoading(true);
    axios
    .delete(AppOptions.getServerUrl() + 'contents/' + Content.idContent + '/delete/' + documentDelete.idContentMedia, {
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

  /*const onItemPress = (document: Document, index: number): void => {

  };*/

  const renderCompliantItem = (info: ListRenderItemInfo<CompliantImageModel>): React.ReactElement => (
    <CompliantImage
      style={styles.item}
      index={info.index}
      compliantImage={info.item}
      onItemPress={onItemPress}
      onRemove={onItemRemove}
    />
  );

  const onSendButtonPress = async (): Promise<void> => {
    if (!compliantTitle) {
      showAlertMessage(
        I18n.t('Title missing'),
        I18n.t('Please fill the title'),
      );
      return;
    } else if (!compliantDescription) {
      showAlertMessage(
        I18n.t('Description missing'),
        I18n.t('Please fill the descripton'),
      );
      return;
    }

    // Show spinner
    setLoading(true);

    // Set the post params
    const postParams = {
      // idUser: '000000000000000',
      title: compliantTitle,
      description: compliantDescription,
      sharePosition: compliantSharePosition,
      shareName: compliantShareName,
      // contentType: abuseAlarm ? 'abuseAlarm' : 'newsStory',
      // insertDate: "2021-05-25T00:00:00.000Z"
    };
    let key = '';
    if (!Content) {
      key = 'idUser';
      postParams[key] = '000000000000000';
      key = 'contentType';
      postParams[key] = abuseAlarm ? 'abuseAlarm' : 'newsStory';
      key = 'insertDate';
      postParams[key] = '2021-05-25T00:00:00.000Z';
    }

    if (currentPosition.latitude && currentPosition.longitude && compliantSharePosition) {
      key = 'positionLatitude';
      postParams[key] = currentPosition.latitude;
      key = 'positionLongitude';
      postParams[key] = currentPosition.longitude;
    }



    if (!Content) {
    // save new content
    axios
      .post(AppOptions.getServerUrl() + 'contents', postParams , {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        setContent(response.data);
        showAlertMessage(
          I18n.t('Save completed'),
          I18n.t('Content saved successfully, now you can upload images'),
        );
        // Hide spinner
        setLoading(false);
      })
      .catch(function () {
        // Hide spinner
        setLoading(false);
        showAlertMessage(
          I18n.t('Error saving content'),
          I18n.t('An error has occurred, please try again'),
        );
      });
    } else {
    // update new content
    axios
      .patch( AppOptions.getServerUrl() + 'contents/' + Content.idContent, postParams, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        showAlertMessage(
          I18n.t('Save completed'),
          I18n.t('Content saved successfully'),
        );
        // Hide spinner
        setLoading(false);
      })
      .catch(function () {
        // Hide spinner
        setLoading(false);
        showAlertMessage(
          I18n.t('Error saving content'),
          I18n.t('An error has occurred, please try again'),
        );
      });
    }
  };

  useEffect(() => {
    getButtons();

    if (item) {
      // load documents
      getMyDocuments(item.idContent);
      setContent(item);
      setCompliantTitle(item.title);
      setCompliantShareName(item.shareName);
      setCompliantSharePosition(item.sharePosition);
      setCompliantDescription(item.description);
     }

    // Get Location
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
    .then(location => {
      setCurrentPosition({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    })
    .catch(error => {
      setCurrentPosition({
        latitude: 0,
        longitude: 0,
      });
      // const { code, message } = error;
      // console.warn(code, message);
    });

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
    // add to documents
     const element: any = {
      'id': response.fileName,
      'name': response.fileName,
      'uri': response.uri,
      'size': response.fileSize,
    };
    // const elements: any = documents;
    // console.log(documents);
    // elements.push(element);
    // setDocuments(elements);
    //
    // setFileResponse(response);
    // setModalUploadImageVisible(true);
    photoUpload(response);
  };

  // Photo upload
  const photoUpload = async (fileResponse) => {

    // Show spinner
    setLoading(true);

    // Get the file extension
    const extension =  fileResponse.fileName.split('.').pop();

    // Set the post parameters
    const dataupload = new FormData();

    dataupload.append('file', {
      uri: fileResponse.uri,
      type: fileResponse.type,
      name: fileResponse.fileName,
    });

    // dataupload.append('title', documentTitle);

    // Send the document to the server, blockchain and ipfs
    axios
      .post(AppOptions.getServerUrl() + 'contents/' + Content.idContent + '/upload', dataupload, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(function(response) {
        // Hide spinner
        setLoading(false);

        // Hide the modal to enter the document title
        // setModalUploadImageVisible(false);

        // Show success message
        showAlertMessage(
          I18n.t('Document uploaded successfully'),
          I18n.t('Document uploaded successfully to Blockchain and IPFS!'),
        );
        // Load the user documents
        getMyDocuments(Content.idContent);
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
  const onItemPress = (document: CompliantImageModel, index: number): void => {
    loadDocument(document);
  };

  // Load the selected document from Blockchain and IPFS
  async function loadDocument(document) {
    // Show spinner
    setLoading(true);
    const postParams = {
      // idContentMedia: document.idContentMedia,
    };
    axios
      .post(AppOptions.getServerUrl() + 'contents/' + Content.idContent
        + '/download-base64/' + document.idContentMedia, postParams, {
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

  /* ALERT MESSAGE */
  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
    <KeyboardAvoidingView style= {styles.FlexGrowOne}>
      <TopNavigation
        title={
          Content ?
          abuseAlarm ? I18n.t('AbuseAlarm - Edit') : I18n.t('News&Stories - Edit') :
          abuseAlarm ? I18n.t('AbuseAlarm - New')  : I18n.t('News&Stories - New')
        }
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

        { Content && (
        <View>
        <Text
          style={styles.infoSection}>
          {I18n.t('Select the images, enter the title and description and then press the send button')
          + '.' }
        </Text>
          { remaining > 0 && (
          <MenuGridList style={styles.buttonsContainer}
            data={data}
            onItemPress={onItemUploadPhotoPress}
          />
          )}
        <Text
          style={styles.infoSection}>
          { I18n.t('Remaining:') + remaining }
        </Text>
        </View>
        ) }
        { !Content && (
        <View>
        <Text
          style={styles.infoSection}>
          {I18n.t('Enter the title and description and then press the send button')
          + '.' }
        </Text>
        </View>
        )}
        <Divider style={styles.divider} />
        <View style={styles.title}>
        <Text category='s1' style={styles.label}>{I18n.t('Insert title')}</Text>
          <Input
            placeholder={I18n.t('Title')}
            value={compliantTitle}
            onChangeText={setCompliantTitle}
            style={styles.inputTitle}
          />
        </View>
        <View  style={styles.description}>
        <Text category='s1' style={styles.label}>{I18n.t('Insert description')}</Text>
        <Input
        multiline={true}
        textStyle={{ minHeight: 64 }}
        value={compliantDescription}
        placeholder={I18n.t('Description')}
        onChangeText={setCompliantDescription}
        style={styles.inputDescription}
        />
        </View>
        <View style={styles.toggle}>
        <Toggle style={styles.label}
        checked={compliantSharePosition}
        onChange={onCheckedPositionChange}
        status='control'
        text={I18n.t('Share current position')}>
        </Toggle>
        </View>
        <View style={styles.toggle}>
        <Toggle style={styles.label}
        checked={compliantShareName}
        onChange={onCheckedNameChange}
        status='control'
        text={I18n.t('Share your full name')}
        >
        </Toggle>
        </View>
        { documents && (
        <List
          data={documents}
          renderItem={renderCompliantItem}
        />
        )}
        <Divider/>
        <Button
          style={styles.sendButton}
          size='giant'
          appearance='outline'
          onPress={onSendButtonPress}>
          { I18n.t('SEND') }
        </Button>
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
            onPress={DeleteDocument}>{I18n.t('DELETE')}</Button>
          </Layout>
        </Layout>
      </ModalUiKitten>
      </KeyboardAvoidingView>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  FlexGrowOne: {
    flexGrow : 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-4',
  },
  buttonsContainer: {
    backgroundColor: 'background-basic-color-4',
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
  },
  label: {
    color: 'color-light-100',
  },
  divider: {
    backgroundColor: 'color-primary-default',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
  sendButton: {
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
  title: {
    marginHorizontal: 16,
    marginTop: 5,
  },
  description: {
    marginHorizontal: 16,
    marginTop: 5,
    marginBottom: 10,
    color: 'color-light-100',
  },
  inputTitle: {
    backgroundColor: '#FFFFFF',
  },
  inputDescription: {
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
  },
  toggle: {
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 16,
    marginRight: 16,
    textAlign: 'left',
    flexDirection: 'row',
    color: 'color-light-100',
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
