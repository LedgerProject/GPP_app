// React import
import React, { useEffect } from 'react';

// React Native import
import { ListRenderItemInfo, View } from 'react-native';

// React Navigation import
import { useIsFocused } from '@react-navigation/native';

// UIKitten import
import { Button, List, Layout, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Modal as ModalUiKitten } from '@ui-kitten/components';

// Locale import
import I18n from './../i18n/i18n';

// Component import
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { ContentItem } from '../components/content-item.component';
import { MenuIcon } from '../components/icons';

// Environment import
import { AppOptions } from '../services/app-env';

// Model import
import { Content } from '../model/content.model';
import { MenuItem } from '../model/menu-item.model';

// Axios import
import axios from 'axios';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';

export interface LayoutData extends MenuItem {
  route: string;
}

export const ContentsListScreen = (props): React.ReactElement => {
  const [contents, setContents] = React.useState([]);
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = React.useState(false);
  const [contentDelete, setContentDelete] = React.useState((): any => {});
  const [contentDeleteIndex, setContentDeleteIndex] = React.useState(0);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { abuseAlarm } = props.route.params;

  const styles = useStyleSheet(themedStyles);
  const isEntering = useIsFocused();

  // Get Token from Redux
  const token = useSelector(selectToken);

  // UseEffect
  useEffect(() => {
    if (isEntering) {
      getContents();
    }
  }, [isEntering]);

  // Get the user contents
  async function getContents() {
    // Show spinner
    setLoading(true);

    const contentType = abuseAlarm ? 'abuseAlarm' : 'newsStory';

    // Get the user contents based on the contentType (abuseAlarm or newsStory)
    axios
      .get(AppOptions.getServerUrl() + `contents?filter={
          "where": {
            "contentType": "` + contentType + `"
          },
          "fields": {
            "idContent": true,
            "idUser": false,
            "title": true,
            "description": true,
            "sharePosition": true,
            "positionLatitude": true,
            "positionLongitude": true,
            "shareName": true,
            "contentType": true,
            "insertDate": true
          },
          "order": [
            "insertDate DESC"
          ]
        }`, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);

        // Set the contents
        setContents(response.data);
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);

        // Show the error message
        showAlertMessage(I18n.t('Error getting contents'), I18n.t('Error getting contents from the server'));
      });
  }

  // Open the page to add a new content
  const addContent = (): void => {
    props.navigation && props.navigation.navigate('ContentsDetails', { item: null, abuseAlarm: abuseAlarm });
  };

  // Open the page to edit the selected content
  const editContent = (content: Content, index: number): void => {
    props.navigation && props.navigation.navigate('ContentsDetails', { item: content, abuseAlarm: abuseAlarm });
  };

  // Ask user to remove the content
  const askRemoveContent = (content: Content, index: number): void => {
    // Set the content and the index to delete
    setContentDelete(content);
    setContentDeleteIndex(index);

    // Show the modal to delete the content
    setModalDeleteVisible(true);
  };

  // Remove the content from the server
  async function removeContent() {
    // Show spinner
    setLoading(true);

    // Remove the content from the server
    axios
      .delete(AppOptions.getServerUrl() + 'contents/' + contentDelete.idContent, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);

        // Remove the content from the list
        contents.splice(contentDeleteIndex, 1);
        setContents([...contents]);

        // Hide the modal
        setModalDeleteVisible(false);
      })
      .catch(function (error) {
        // Hide spinner
        setLoading(false);

        // Show the error message
        showAlertMessage(I18n.t('Error removing content'), I18n.t('Error removing the selected content'));
      });
  }

  // Alert message
  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

  // Render top navigation menu
  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  // Render the list content item
  const renderContentItem = (info: ListRenderItemInfo<Content>): React.ReactElement => (
    <ContentItem
      style={styles.item}
      index={info.index}
      content={info.item}
      onRemove={askRemoveContent}
      onItemPress={editContent}
    />
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={abuseAlarm === true ? I18n.t('AbuseAlarm - List') : I18n.t('News&Stories - List')}
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
        { abuseAlarm === true && (
          <View>
            <Button
              status='primary'
              style={styles.addButton}
              onPress={addContent}>
              {I18n.t('New Report')}
            </Button>
            <Text
              style={styles.infoSection}>
              {I18n.t('AbuseAlarm info')}
            </Text>
          </View>
        )}
        { abuseAlarm === false && (
          <View>
            <Button
              status='primary'
              style={styles.addButton}
              onPress={addContent}>
              {I18n.t('New Story')}
            </Button>
            <Text
              style={styles.infoSection}>
              {I18n.t('News&Story info')}
            </Text>
          </View>
        )}
        <List
          style={styles.listContainer}
          data={contents}
          renderItem={renderContentItem}
        />
      </Layout>

      <ModalUiKitten
        visible={ modalAlertVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalAlertVisible(false)}>
        <Layout
          style={ styles.modal }>
          <Text
            style={ styles.modalText }
            category='h6' >
            {alertTitle}
          </Text>
          <Text
          style={ styles.modalText } >
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
            {I18n.t('Are you sure to delete the selected content?')}
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
              onPress={removeContent}>{I18n.t('DELETE')}
            </Button>
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
  listContainer: {
    marginHorizontal: 16,
    borderRadius: 4,
    padding: 5,
    marginBottom: 20,
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
  addButton: {
    margin: 10,
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
