import React, { useEffect } from 'react';
import { Image, View, ListRenderItemInfo } from 'react-native';
import { Button, Divider, List, Layout, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Modal as ModalUiKitten, Input, Icon } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { CompliantItem } from './compliants/compliant-item.component';
import { ArrowBackIcon, MenuIcon } from '../components/icons';
import { Compliant } from './compliants/data';
import data_compliants from './compliants/data';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-env';
import I18n from './../i18n/i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import { MenuItem } from '../model/menu-item.model';

export interface LayoutData extends MenuItem {
  route: string;
}

export const NewsStoriesListScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [compliants, setCompliants] = React.useState([]);
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = React.useState(false);
  const [compliantDelete, setCompliantDelete] = React.useState((): any => {});
  const [compliantDeleteIndex, setCompliantDeleteIndex] = React.useState(0);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onItemRemove = (compliant: Compliant, index: number): void => {
    // DeleteDocument(document,index);
    setCompliantDelete(compliant);
    setCompliantDeleteIndex(index);
    setModalDeleteVisible(true);

  };

  async function DeleteCompliant() {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    /*axios
    .delete(AppOptions.getServerUrl() + 'documents/' + documentDelete.idDocument, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {*/
      setLoading(false);
      compliants.splice(compliantDeleteIndex, 1);
      setCompliants([...compliants]);
      setModalDeleteVisible(false);
      // alert('removed');
    /*})
    .catch(function (error) {
      setLoading(false);
      // alert(JSON.stringify(error));
      throw error;
    });*/
  }

  const onItemPress = (compliant: Compliant, index: number): void => {
    props.navigation && props.navigation.navigate('CompliantEdit', { item: compliant });
  };

  const renderCompliantItem = (info: ListRenderItemInfo<Compliant>): React.ReactElement => (
    <CompliantItem
      style={styles.item}
      index={info.index}
      compliant={info.item}
      onRemove={onItemRemove}
      onItemPress={onItemPress}
    />
  );

  async function getMyCompliants() {
    setLoading(true);
    /*const token = await AsyncStorage.getItem('token');
    axios
    .get(AppOptions.getServerUrl() + 'documents', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {*/
      setLoading(false);
      // setCompliants(response.data);
      setCompliants(data_compliants);

      // alert(JSON.stringify(response));
    /*})
    .catch(function (error) {
      setLoading(false);
      // alert(JSON.stringify(error));
      throw error;
    });*/
  }

  useEffect(() => {
    getMyCompliants();
  }, []);



  /* ALERT MESSAGE */
  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

  const navigateBack = () => {
    props.navigation.goBack();
  };

  // <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  const renderDrawerAction = (): React.ReactElement => (
      <TopNavigationAction
        icon={MenuIcon}
        onPress={props.navigation.toggleDrawer}
      />
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={I18n.t('Compliants')}
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
        <Text
          style={styles.infoSection}>
          {I18n.t('Tap on compliant for the preview') + '. '
          + I18n.t('Swipe left on compliant to delete it') + '.' }
        </Text>
        <List style={styles.container}
          data={compliants}
          renderItem={renderCompliantItem}
        />
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
            {I18n.t('Are you sure to delete the selected compliant?')}
          </Text>
          <Button status='primary' onPress={DeleteCompliant}>{I18n.t('DELETE')}</Button>
          <Button status='basic' onPress={() => setModalDeleteVisible(false)}>{I18n.t('CLOSE')}</Button>
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
