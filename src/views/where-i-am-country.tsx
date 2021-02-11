import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Divider, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout, Icon } from '@ui-kitten/components';
import { ArrowBackIcon, MenuIcon } from '../components/icons';
import { TopNavigationScreen } from 'src/scenes/components/top-navigation/top-navigation.component';

import { SafeAreaLayout } from '../components/safe-area-layout.component';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-options';
import I18n from './../i18n/i18n';
import Spinner from 'react-native-loading-spinner-overlay';

export const WhereIAmCountryScreen = (props): React.ReactElement => {
  const { Country } = props.route.params;
  const styles = useStyleSheet(themedStyles);
  const [countryName, setCountryName] = React.useState('');
  const [topics, setTopics] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  );

  // Init functions
  useEffect(() => {
    getCountry();
  }, []);

  async function getCountry() {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    axios
      .get(AppOptions.getServerUrl() + `countries?filter={`
        + `"where": {`
          + `"identifier": "` + Country + `"`
        + `}`
        + `,"include":[`
          + `{"relation": "countryTopic", "scope":`
              + `{"include": [`
                + `{"relation": "countryTopicLanguage",`
                  + `"scope": {"where":`
                    + `{"language": "en"}`
                  + `}`
                + `}`
              + `]}`
          + `},`
          + `{"relation": "countryLanguage", "scope":`
              + `{"where":`
                + `{"language": "en"}`
              + `}`
          + `}`
        + `]`
        + `}`, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        setLoading(false);
        const data: any = response.data[0];
        setCountryName(data.identifier);
        const topicsObj = data.countryTopic;
        const topicsArray = [];
        topicsObj.map( (elementParent) => {
          const elementArray: [] = elementParent.countryTopicLanguage;
          elementArray.map( (element: any) => {
            if (element.language === 'en') {
              const topicObj = { title: element.topic, description: element.description };
              topicsArray.push( topicObj );
            }
          });
        });
        setTopics(topicsArray);
      })
      .catch(function (error) {
        setCountryName(I18n.t('Country not found'));
        // alert(JSON.stringify(error));
        throw error;
      });
  }

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={I18n.t('Country')}
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <Spinner
          visible={loading}
          textContent={I18n.t('Loading') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
      <ScrollView>

      <Layout style={styles.mainTitleContainer}>
        <Text category='h4' style={styles.mainTitle}>{countryName}</Text>
      </Layout>

      { topics.map( (item, index) => (
      <Layout key={index} style={styles.elementContainer}>
        <Text category='s1' style={styles.elementTitle}>{item.title}</Text>
        <Text category='p2' style={styles.elementDescription}>{item.description}</Text>
        <Divider/>
      </Layout>
         ))
      }
      </ScrollView>
      </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  mainTitleContainer: {
    padding: 16, marginBottom: 10,
  },
  mainTitle: {
    textAlign: 'center',
  },
  elementContainer: {
    padding: 6, marginBottom: 10, flexDirection: 'column',
  },
  elementTitle: {
    color: '#444', fontWeight: 'bold',
  },
  elementDescription: {
    color: '#666', marginBottom: 4,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
