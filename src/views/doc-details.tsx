import React, { useEffect } from 'react';
import { View , ScrollView, Modal, Image, Dimensions } from 'react-native';
import {
  Input, Button, Divider, List, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Layout, Icon,
} from '@ui-kitten/components';
import { ArrowBackIcon, MenuIcon } from '../components/icons';
import {FlatListSlider} from 'react-native-flatlist-slider';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AppOptions } from '../services/app-options';
import I18n from './../i18n/i18n';
// import {Buffer} from 'buffer';
import AutoHeightImage from 'react-native-auto-height-image';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import {
  manageToken,
  selectToken,
} from '../app/tokenSlice';

export const DocDetailsScreen = (props): React.ReactElement => {

  const { item, image } = props.route.params;
  const [modalVisible, setmodalVisible] = React.useState(false);
  const styles = useStyleSheet(themedStyles);
  const { height, width } = Dimensions.get( 'window' );

  // Get Token from REDUX
  const token = useSelector(selectToken);

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

/*  useEffect(() => {
    console.log(image);
  }, []);*/

   const zoom_images = [
    {
     url: image,
     props: {},
    },
   ];

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={I18n.t('Document Details')}
        titleStyle={styles.topBarTitle}
        leftControl={renderDrawerAction() }
        style={styles.topBar}
      />
      <Divider/>
      <ScrollView>
  <Layout style={styles.header}>
  <Layout
    style={styles.detailsContainer}
    level='1'>
    <Text
      category='h6' style={styles.documentTitle}>
      {item.title}
    </Text>
      { image && (
      <AutoHeightImage width={width - 30} source={{ uri: image }} />
      ) }
    <Button style={styles.zoomButton} onPress={ZoomImage}>{I18n.t('Zoom')}</Button>
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
  zoomButton: { marginTop: 6 },
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
