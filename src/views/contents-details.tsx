// React import
import React, { useEffect } from 'react';

// React Native import
import { View, ListRenderItemInfo, ImageStyle } from 'react-native';
import { ImagePickerResponse, MediaType, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import GetLocation from 'react-native-get-location';

// Environment import
import { AppOptions } from '../services/app-env';

// Model import
import { MenuItem } from '../model/menu-item.model';

// UIKitten import
import { Button, Divider, List, Layout, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Modal as ModalUiKitten, Input, Icon, Toggle } from '@ui-kitten/components';

// Locale import
import I18n from './../i18n/i18n';

// Component import
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuGridList } from '../components/menu-grid-list.component';
import { ContentImage, ContentImageModel } from '../components/content-image.component';
import { ThemedIcon } from '../components/themed-icon.component';
import { ArrowBackIcon, CustomTakePhotoIcon, CustomFromLibraryIcon } from '../components/icons';

// Axios import
import axios from 'axios';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';

// Other imports
import FormData from 'form-data';
import { requestCameraPermission, requestExternalWritePermission } from '../services/image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAvoidingView } from '../services/3rd-party';

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

export const ContentsDetailsScreen = (props): React.ReactElement => {
  const [documents, setDocuments] = React.useState((): any => {});
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = React.useState(false);
  const [mediaDelete, setMediaDelete] = React.useState((): any => {});
  const [mediaDeleteIndex, setMediaDeleteIndex] = React.useState(0);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [contentTitle, setContentTitle] = React.useState('');
  const [contentSharePosition, setContentSharePosition] = React.useState(false);
  const [contentShareName, setContentShareName] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState((): any => {});
  const [contentDescription, setContentDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [Content, setContent] = React.useState((): any => {});
  const [remaining, setRemaining] = React.useState(5);

  const token = useSelector(selectToken);
  const styles = useStyleSheet(themedStyles);
  const { item, abuseAlarm } = props.route.params;

  // useEffect
  useEffect(() => {
    // Set the buttons menu (take photo and from library)
    setButtons();

    // If selected item from previous list, load the data
    if (item) {
      // Set the content media from the server
      setContentMedia(item.idContent);

      // Set the content from the server
      setContent(item);

      // Set the content title
      setContentTitle(item.title);

      // Set the content share name
      setContentShareName(item.shareName);

      // Set the content share position
      setContentSharePosition(item.sharePosition);

      // Set the content description
      setContentDescription(item.description);
    }

    // Get the current location
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
    });
  }, []);

  // Set the menu buttons (take photo and from library buttons)
  async function setButtons() {
    const buttonsArray = [];

    // Take photo button
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

    // From library button
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

  // Get the user media from the server
  async function setContentMedia(idContent) {
    // Show spinner
    setLoading(true);

    // Get the content media from the server
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

        // Set the content media
        setDocuments(response.data);

        // Set the remaining media available
        setRemaining(5 - response.data.length);
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);

        // Set the remaining media to 0
        setRemaining(0);

        // Show the error message
        showAlertMessage(
          I18n.t('Error loading content media'),
          I18n.t('An error has occurred, please try again'),
        );
      });
  }

  // Checkbox share position click
  const checkboxPositionChange = (isChecked) => {
    setContentSharePosition(isChecked);
  };

  // Checkbox share name click
  const checkboxNameChange = (isChecked) => {
    setContentShareName(isChecked);
  };

  // Save the content
  const saveContent = async (): Promise<void> => {
    // Check if title is filled
    if (!contentTitle) {
      showAlertMessage(
        I18n.t('Title missing'),
        I18n.t('Please fill the title'),
      );
      return;
    }

    // Check if description is filled
    if (!contentDescription) {
      showAlertMessage(
        I18n.t('Description missing'),
        I18n.t('Please fill the descripton'),
      );
      return;
    }

    // Check if updating or inserting the content
    let newContent = true;
    if (Content) {
      newContent = false;
    }

    // Show spinner
    setLoading(true);

    // Set the post params
    const postParams = {
      title: contentTitle,
      description: contentDescription,
      sharePosition: contentSharePosition,
      shareName: contentShareName,
    };

    let key = '';

    // If a new content, set other params
    if (newContent) {
      key = 'idUser';
      postParams[key] = '000000000000000'; // The param is overridden by the server

      key = 'contentType';
      postParams[key] = abuseAlarm ? 'abuseAlarm' : 'newsStory';

      key = 'insertDate';
      postParams[key] = '2021-05-25T00:00:00.000Z'; // The param is overridden by the server
    }
  
    // If shared position, send the latitude and longitude
    if (currentPosition.latitude && currentPosition.longitude && contentSharePosition) {
      key = 'positionLatitude';
      postParams[key] = currentPosition.latitude;

      key = 'positionLongitude';
      postParams[key] = currentPosition.longitude;
    } else {
      key = 'positionLatitude';
      postParams[key] = 0;

      key = 'positionLongitude';
      postParams[key] = 0;
    }

    if (newContent) {
      // Save new content
      axios
        .post(AppOptions.getServerUrl() + 'contents', postParams , {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          // Hide spinner
          setLoading(false);

          // Set the current content
          setContent(response.data);

          // Show the save completed message
          showAlertMessage(
            I18n.t('Save completed'),
            I18n.t('Content saved successfully, now you can upload images'),
          );
        })
        .catch(function () {
          // Hide spinner
          setLoading(false);

          // Show the error message
          showAlertMessage(
            I18n.t('Error saving content'),
            I18n.t('An error has occurred, please try again'),
          );
        });
    } else {
      // Update the content
      axios
        .patch( AppOptions.getServerUrl() + 'contents/' + Content.idContent, postParams, {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          // Hide spinner
          setLoading(false);

          // Show the save completed message
          showAlertMessage(
            I18n.t('Save completed'),
            I18n.t('Content saved successfully'),
          );
        })
        .catch(function () {
          // Hide spinner
          setLoading(false);

          // Show the error message
          showAlertMessage(
            I18n.t('Error saving content'),
            I18n.t('An error has occurred, please try again'),
          );
        });
    }
  };

  // Take photo or select from library click button
  const selectPhoto = (index: number): void => {
    if (index === 0) {
      getPhoto('camera');
    } else if (index === 1) {
      getPhoto('library');
    }
  };

  // Get photo from device (from camera or library)
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

  // Try saving photo
  const managePhoto = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
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

    // Add to documents
    const element: any = {
      'id': response.fileName,
      'name': response.fileName,
      'uri': response.uri,
      'size': response.fileSize,
    };

    uploadPhoto(response);
  };

  // Photo upload
  const uploadPhoto = async (fileResponse) => {
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

        // Show success message
        showAlertMessage(
          I18n.t('Document uploaded successfully'),
          I18n.t('Document uploaded successfully to Blockchain and IPFS!'),
        );

        // Load the user documents
        setContentMedia(Content.idContent);
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

  // Ask user to remove the photo
  const askRemovePhoto = (contentImage: ContentImageModel, index: number): void => {
    // Set the photo and the index to delete
    setMediaDelete(contentImage);
    setMediaDeleteIndex(index);

    // Show the modal to delete the photo
    setModalDeleteVisible(true);
  };

  // Delete the photo info from the server
  async function deleteMedia() {
    // Show spinner
    setLoading(true);

    // Delete the photo info from the server
    axios
      .delete(AppOptions.getServerUrl() + 'contents/' + Content.idContent + '/delete/' + mediaDelete.idContentMedia, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);

        // Remove item photo from the list
        documents.splice(mediaDeleteIndex, 1);
        setDocuments([...documents]);

        setRemaining(5 - documents.length);

        // Hide the modal
        setModalDeleteVisible(false);
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);

        // Show the error message
        showAlertMessage(
          I18n.t('Error removing file'),
          error.message,
        );

        // alert(JSON.stringify(error));
        throw error;
      });
  }

  // On photo press event (from the list)
  const selectMedia = (document: ContentImageModel, index: number): void => {
    loadMedia(document);
  };

  // Load the selected photo from Blockchain and IPFS
  async function loadMedia(document) {
    // Show spinner
    setLoading(true);

    // Load the photo from Blockchain and IPFS
    axios
      .post(AppOptions.getServerUrl() + 'contents/' + Content.idContent
        + '/download-base64/' + document.idContentMedia, {}, {
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
        console.log(error);
        // Hide spinner
        setLoading(false);

        // Show the error message
        showAlertMessage(
          I18n.t('Error loading document'),
          I18n.t('An error has occurred, please try again'),
        );
      });
  }

  // Alert message
  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

  // Navigate previous page
  const navigateBack = () => {
    props.navigation.goBack();
  };

  // Render top navigation menu
  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowBackIcon}
      onPress={navigateBack}
    />
  );

  // Render the photo list item
  const renderContentItem = (info: ListRenderItemInfo<ContentImageModel>): React.ReactElement => (
    <ContentImage
      style={styles.item}
      index={info.index}
      contentImage={info.item}
      onItemPress={selectMedia}
      onRemove={askRemovePhoto}
    />
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
          leftControl={renderDrawerAction()}
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
                {I18n.t('Edit content detail info')
                + '.' }
              </Text>
            </View>
          ) }
          { !Content && (
            <View>
              <Text
                style={styles.infoSection}>
                {I18n.t('New content detail info')}
              </Text>
            </View>
          )}
          <Divider style={styles.divider} />
          <View
            style={styles.title}>
            <Text
              category='s1'
              style={styles.label}>
              {I18n.t('Insert title')}
            </Text>
            <Input
              placeholder={I18n.t('Title')}
              value={contentTitle}
              onChangeText={setContentTitle}
              style={styles.inputTitle}
            />
          </View>
          <View
            style={styles.description}>
            <Text
              category='s1'
              style={styles.label}>
              {I18n.t('Insert description')}
            </Text>
            <Input
              multiline={true}
              textStyle={{ minHeight: 64 }}
              value={contentDescription}
              placeholder={I18n.t('Description')}
              onChangeText={setContentDescription}
              style={styles.inputDescription}
            />
          </View>
          <View 
            style={styles.toggle}>
            <Toggle 
              style={styles.label}
              checked={contentSharePosition}
              onChange={checkboxPositionChange}
              status='control'
              text={I18n.t('Share current position')}
            />
          </View>
          <View 
            style={styles.toggle}>
            <Toggle
              style={styles.label}
              checked={contentShareName}
              onChange={checkboxNameChange}
              status='control'
              text={I18n.t('Share your full name')}
            />
          </View>
          <Button
            style={styles.sendButton}
            size='giant'
            appearance='outline'
            onPress={saveContent}>
            { I18n.t('Save') }
          </Button>
          <Divider/>
          { Content && (
            <View>
              { remaining > 0 && (
                <MenuGridList
                  style={styles.buttonsContainer}
                  data={data}
                  onItemPress={selectPhoto}
                />
              )}
              <Text
                style={styles.infoSection}>
                { I18n.t('Remaining media:') + ' ' + remaining }
              </Text>
            </View>
          ) }
          { documents && (
            <List
              style={styles.listContainer}
              data={documents}
              renderItem={renderContentItem}
            />
          )}
        </Layout>

        <ModalUiKitten
          visible={ modalAlertVisible }
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setModalAlertVisible(false)}>
          <Layout 
            style={ styles.modal }>
            <Text 
              style={ styles.modalText } 
              category='h6' >{alertTitle}
            </Text>
            <Text
              style={ styles.modalText }>
              {alertMessage}
            </Text>
            <Button
              status='basic'
              onPress={() => setModalAlertVisible(false)}>
              {I18n.t('CLOSE')}
            </Button>
          </Layout>
        </ModalUiKitten>

        <ModalUiKitten
          visible={ modalDeleteVisible }
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setModalDeleteVisible(false)}>
          <Layout
            style={ styles.modal }>
            <Text
              style={ styles.modalText }
              category='h6'>
              {I18n.t('Are you sure to delete the selected document?')}
            </Text>
            <Layout
              style={styles.modalButtonsContainer}>
              <Button
                style={styles.modalButtonLeft}
                status='basic'
                onPress={() => setModalDeleteVisible(false)}>
                {I18n.t('CLOSE')}
              </Button>
              <Button
                style={styles.modalButtonRight}
                status='primary'
                onPress={deleteMedia}>
                {I18n.t('DELETE')}
              </Button>
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
  listContainer: {
    marginHorizontal: 16,
    borderRadius: 4,
    padding: 5,
    marginBottom: 20,
  },
  infoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginHorizontal: 16,
    color: 'color-light-100',
    textAlign: 'center',
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  backdrop_black: {
    backgroundColor: 'rgba(0, 0, 0, 1)' 
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
