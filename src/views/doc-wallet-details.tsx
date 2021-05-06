// React import
import React from 'react';

// React Native import
import { ScrollView, Modal, Dimensions } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import AutoHeightImage from 'react-native-auto-height-image';

// UIKitten import
import { Button, StyleService, Text, TopNavigation, TopNavigationAction,
  useStyleSheet, Layout } from '@ui-kitten/components';

// Component import
import { ArrowBackIcon, MenuIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

// Locale import
import I18n from './../i18n/i18n';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';

export const DocWalletDetailsScreen = (props): React.ReactElement => {
  const [modalVisible, setmodalVisible] = React.useState(false);

  const { item, image } = props.route.params;
  const styles = useStyleSheet(themedStyles);
  const { width } = Dimensions.get( 'window' );

  const zoomImages = [{
     url: image,
     props: {},
    },
  ];

  // Get Token from Redux
  const token = useSelector(selectToken);

  // Navigate back event
  const navigateBack = () => {
    props.navigation.goBack();
  };

  // Zoom image
  const zoomImage = (): void => {
    setmodalVisible(true);
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  );

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
      <ScrollView>
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
          <Button
            style={styles.zoomButton}
            onPress={zoomImage}>
              {I18n.t('Zoom')}
            </Button>
        </Layout>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={ () => setmodalVisible(false) }>
        <ImageViewer
          imageUrls={zoomImages}
          enableSwipeDown={true}
          onSwipeDown={ () => setmodalVisible(false) }/>
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
  },
  commentList: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  image: {
    height: 340,
    width: '100%',
  },
  detailsContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'background-basic-color-4',
    paddingBottom: 8,
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
  button: {
    width: '100%',
  },
  backdrop: {
    /* backgroundColor: 'rgba(0, 0, 0, 0.5)', */
  },
  documentTitle: {
    textAlign: 'center',
    color: 'color-light-100',
  },
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
