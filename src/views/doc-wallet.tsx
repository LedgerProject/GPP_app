import React from 'react';
import { Image, View, ScrollView, ListRenderItemInfo, Platform, PermissionsAndroid } from 'react-native';
import { Button, Divider, List, Layout, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Modal, Input } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuGridList } from '../components/menu-grid-list.component';
import { DocumentItem } from './doc-wallet/document-item.component';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { MenuIcon } from '../components/icons';
import { data, Document } from './doc-wallet/data';
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-options';
import I18n from './../i18n/i18n';
import FormData from 'form-data';

const initialDocuments: Document[] = [
  Document.passportDocument(),
  Document.idDocument(),
  Document.vaccinationPage1(),
  Document.vaccinationPage2(),
  Document.testDoc1(),
  Document.testDoc2(),
];

const apiInstanceToken = axios.create();

apiInstanceToken.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token');
        // console.log(token)
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

const apiInstanceIpfs = axios.create();

apiInstanceIpfs.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token');
        // console.log(token);
        if (token) {
          const headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data' };
          config.headers = headers;
          /*config.headers = {
            //'Authorization': 'Bearer ' + token,
            "Content-Type": "multipart/form-data",
          }*/
          // config.headers.Authorization = 'Bearer ' + token;
        }
        // console.log(config);
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

export const DocWalletScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [documents, setDocuments] = React.useState<Document[]>(initialDocuments);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [generated_token, setGenerated_token ] = React.useState('');
  const [modalImageVisible, setmodalImageVisible] = React.useState(false);
  const [DocumentTitle, setDocumentTitle] = React.useState('');
  const [DocumentError, setDocumentError] = React.useState('');
  const [filePath, setFilePath] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [fileType, setFileType] = React.useState('');
  const onItemPress = (index: number): void => {
    // props.navigation.navigate(data[index].route);
    if (index === 0) {
      captureImage('photo');
    } else if (index === 1) {
      chooseFile('photo');
    }
  };

  const onItemRemove = (document: Document, index: number): void => {
    documents.splice(index, 1);
    setDocuments([...documents]);
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
    />
  );

  const onGenerateTokenButtonPress = (): void => {
    // props.navigation && props.navigation.navigate('Homepage');

      apiInstanceToken
      .post( AppOptions.getServerUrl() + 'users-token')
      .then(function (response) {
        // handle success
        setGenerated_token(response.data.token);
        setmodalVisible(true);
      })
      .catch(function (error) {
        alert(error.message);
      });
  };

  const handleUpload = () => {
    if (!DocumentTitle) {
      alert(I18n.t('Please fill Document Name'));
      return;
    } else {
      setDocumentError('');
      // console.log(AppOptions.getServerUrl() + 'documents/TTTT');
      const dataupload = new FormData();
      dataupload.append('file', {uri: filePath, type: fileType, name: fileName});
      // apiInstanceIpfs
      axios
      .post(AppOptions.getServerUrl() + 'documents/' + DocumentTitle, dataupload, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGdsb2JhbHBhc3Nwb3J0cHJvamVjdC5tZSIsImlkVXNlciI6IjU3OTRlZTU5LTdhNzMtNDIzMi1hODJkLTJjZTdiMmNkZDliMSIsInBlcm1pc3Npb25zIjpbIkRvY1dhbGxldE1hbmFnZW1lbnQiLCJTdHJ1Y3R1cmVzTGlzdCIsIkF1dGhGZWF0dXJlcyIsIlByb2ZpbGVFZGl0Il0sInVzZXJUeXBlIjoidXNlciIsImlhdCI6MTYxMTY1OTM0NiwiZXhwIjoxNjExNjg0NTQ2fQ.IZfV06p3uA-5IfKswwoLGhOTx1tlOqgjGjlTBCNH57s',
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(function(response) {
        // console.log(response);
        setmodalImageVisible(false);
        alert('Document uploaded successfully!');
      })
      .catch(function (error) {
        // throw error;
        alert(JSON.stringify(error));
        // console.log(error);
      });
    }
  };

  // IMAGE PICKER

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
            buttonPositive: 'Accept',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
            buttonPositive: 'Accept',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err' + err);
      }
      return false;
    } else {
      return true;
    }
  };

  const captureImage = async (type) => {
    const options = {
      mediaType: type,
      // maxWidth: 300,
      // maxHeight: 550,
      PhotoQuality: 1,
      // videoQuality: 'low',
      // durationLimit: 30, // Video max duration in seconds
      saveToPhotos: true,
    };
    const isCameraPermitted = await requestCameraPermission();
    const isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        // console.log('Response = ' + response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode === 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode === 'permission') {
          alert('Permission not satisfied');
          return;
        /* } else { // if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return; */
        }
        /* console.log('base64 -> ', response.base64);
        console.log('uri -> ', response.uri);
        console.log('width -> ', response.width);
        console.log('height -> ', response.height);
        console.log('fileSize -> ', response.fileSize);
        console.log('type -> ', response.type);
        console.log('fileName -> ', response.fileName); */
        setFilePath(response.uri);
        setFileName(response.fileName);
        setFileType(response.type);
        setmodalImageVisible(true);
      });
    }
  };

  const chooseFile = (type) => {
    const options = {
      mediaType: type,
      // maxWidth: 300,
      // maxHeight: 550,
      PhotoQuality: 1,
    };
    launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode === 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode === 'permission') {
        alert('Permission not satisfied');
        return;
      /* } else { // } if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return; */
      }
      /* console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName); */
      setFilePath(response.uri);
      setFileName(response.fileName);
      setFileType(response.type);
      setmodalImageVisible(true);
    });
  };

  // FINE

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title='DocWallet'
        leftControl={renderDrawerAction()}
      />
      <Layout
      style={styles.container}
      level='2'>
        <View>
          <MenuGridList
            data={data}
            onItemPress={onItemPress}
          />
        </View>
        <Divider/>
        <Text
          style={styles.infoSection}>
          {I18n.t('Tap on document')}
        </Text>
        <List
          data={documents}
          renderItem={renderDocumentItem}
        />
        <Divider/>
        <Text
          style={styles.infoSection}>
          {I18n.t('Generate a 30-minute token to')}
        </Text>
        <Button
          style={styles.generateTokenButton}
          size='giant'
          appearance='outline'
          onPress={onGenerateTokenButtonPress}>
          {I18n.t('GENERATE A 30-MINUTE TOKEN')}
        </Button>
      </Layout>


      <Modal
      visible={ modalImageVisible }
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setmodalImageVisible(false)}
      >
      <Layout style={ styles.modal } >
      <Text style={styles.modalTitle} category='s1'>{I18n.t('Please specify a title for your document')}</Text>
      <Input
              placeholder={I18n.t('Enter Document Name')}
              value={DocumentTitle}
              onChangeText={setDocumentTitle}
      />
      <Text status='danger' style={styles.errorText}>{DocumentError}</Text>
      <Layout style={styles.imageContainer}>
      <Image
          source={{uri: filePath}}
          style={styles.imageStyle}
        />
      </Layout>
        <Button onPress={handleUpload}>{I18n.t('UPLOAD TO IPFS')}</Button>
        <Button status='basic' onPress={() => setmodalImageVisible(false)}>CLOSE</Button>
      </Layout>
      </Modal>

      <Modal
      visible={ modalVisible }
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setmodalVisible(false)}
      >
      <Layout style={ styles.modal } >
          <Text style={ styles.modalText } >{I18n.t('30-Minutes Token Generated')}</Text>
          <Text style={ styles.modalText } category='h3' >{generated_token}</Text>
          <Text style={ styles.modalText } >{I18n.t('Communicate this token only')}</Text>
          <Button status='basic' onPress={() => setmodalVisible(false)}>CLOSE</Button>
      </Layout>
      </Modal>
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
});
