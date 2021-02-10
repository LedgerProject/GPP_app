import React, { useEffect } from 'react';
import { View , ScrollView, Modal, Image } from 'react-native';
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
import {Buffer} from 'buffer';

export const DocDetailsScreen = (props): React.ReactElement => {

  const { item } = props.route.params;
  const [modalVisible, setmodalVisible] = React.useState(false);
  const styles = useStyleSheet(themedStyles);
  const [fileExample, setfileExample] = React.useState( (): any => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==');

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  );

  const ZoomImage = (): void => {
    // alert(JSON.stringify(item));
    // props.navigation && props.navigation.navigate('Homepage');
    setmodalVisible(true);
  };

   const zoom_images = [
    {
     url: 'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
     props: {},
    },
   ];

   async function getMyDocument() {

    const token = await AsyncStorage.getItem('token');

    const config = { responseType: 'blob' };
    axios.get(AppOptions.getServerUrl() + 'documents/' + item.idDocument, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'responseType': 'blob',
      },
    }).then(response => {
        const example = new File([response.data], 'test.jpg');
        setfileExample('test.jpg');
        // console.log(example);
    });

    /*axios
    .get(AppOptions.getServerUrl() + 'documents/' + item.idDocument, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'responseType': 'blob'
      },
    })
    .then(function (response) {

      // alert(JSON.stringify(response));
      //const buff = Buffer.from(response., 'binary').toString('base64');
      //console.log(buff);
      //const filename = response.headers['content-disposition'].split('filename=')[1];
      //alert(filename);

      //const blob = new Blob(response, { type: type});
      /*response.blob().then(blob => {
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = filename;
      // a.click();
      });

    .catch(function (error) {
      // alert(JSON.stringify(error));
      throw error;
    });*/
  }

   useEffect(() => {
    getMyDocument();
  }, []);

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={I18n.t('Document Details')}
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>
  <Layout style={styles.header}>
  <Layout
    style={styles.detailsContainer}
    level='1'>
      <Image source={{ uri: fileExample }} />
    <Text
      category='h6' style={styles.documentTitle}>
      {item.title}
    </Text>
    <Button onPress={ZoomImage}>{I18n.t('Zoom')}</Button>
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
  documentTitle: { textAlign: 'center' },
});
