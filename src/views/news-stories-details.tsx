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

export const NewsStoriesDetailsScreen = (props): React.ReactElement => {

  // const { item = null } = props.route.params;
  const item = null;

  const styles = useStyleSheet(themedStyles);
  const [documents, setDocuments] = React.useState([]);
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
  const [compliantDescription, setCompliantDescription] = React.useState('');
  const [fileResponse, setFileResponse] = React.useState<ImagePickerResponse>(initialFileResponse);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const ZoomImage = (): void => {
    setmodalFileVisible(true);
  };

  const onCheckedPositionChange = (isChecked) => {
    setCompliantSharePosition(isChecked);
  };
  const onCheckedNameChange = (isChecked) => {
    setCompliantShareName(isChecked);
  };

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
    /*const token = await AsyncStorage.getItem('token');
    axios
    .delete(AppOptions.getServerUrl() + 'documents/' + documentDelete.idDocument, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {*/
      setLoading(false);
      documents.splice(documentDeleteIndex, 1);
      setDocuments([...documents]);
      setModalDeleteVisible(false);
      // alert('removed');
    /*})
    .catch(function (error) {
      setLoading(false);
      // alert(JSON.stringify(error));
      throw error;
    });*/
  }

  /*const onItemPress = (document: Document, index: number): void => {

  };*/

  const renderCompliantItem = (info: ListRenderItemInfo<CompliantImageModel>): React.ReactElement => (
    <CompliantImage
      style={styles.item}
      index={info.index}
      compliantImage={info.item}
      onRemove={onItemRemove}
    />
  );

  const onSendButtonPress = async (): Promise<void> => {
    if (!compliantTitle) {
      showAlertMessage(
        I18n.t('Title missing'),
        I18n.t('Please fill the compliant title'),
      );
    } else if (!compliantDescription) {
      showAlertMessage(
        I18n.t('Description missing'),
        I18n.t('Please fill the compliant descripton'),
      );
    } else {
      alert('Send OK');
    }
  };

  useEffect(() => {
    // console.log(item);
    getButtons();
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
    const elements: any = documents;
    // console.log(documents);
    elements.push(element);
    setDocuments(elements);
    //
    // setFileResponse(response);
    // setModalUploadImageVisible(true);
  };

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
        title={ item ? I18n.t('Edit Compliant') : I18n.t('New Compliant') }
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
        <Text
          style={styles.infoSection}>
          {I18n.t('Select the images, enter the title and description and then press the send button')
          + '.' }
        </Text>
          <MenuGridList style={styles.buttonsContainer}
            data={data}
            onItemPress={onItemUploadPhotoPress}
          />
        </View>
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
        placeholder='Description'
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
        <List
          data={documents}
          renderItem={renderCompliantItem}
        />
        <Divider/>
        <Button
          style={styles.sendButton}
          size='giant'
          appearance='outline'
          onPress={onSendButtonPress}>
          {I18n.t('SEND')}
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
          <Button status='primary' onPress={DeleteDocument}>{I18n.t('DELETE')}</Button>
          <Button status='basic' onPress={() => setModalDeleteVisible(false)}>{I18n.t('CLOSE')}</Button>
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
    flex: 1,
    flexDirection: 'row',
    color: 'color-light-100',
  },
});
