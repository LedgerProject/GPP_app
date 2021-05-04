import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Divider, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout, Icon } from '@ui-kitten/components';
import { ArrowBackIcon, MenuIcon } from '../components/icons';
// import { TopNavigationScreen } from 'src/scenes/components/top-navigation/top-navigation.component';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-env';
import I18n from './../i18n/i18n';
import Spinner from 'react-native-loading-spinner-overlay';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import {
  manageToken,
  selectToken,
} from '../redux/tokenSlice';

export const AroundMeCountryScreen = (props): React.ReactElement => {
  const { Country } = props.route.params;
  const styles = useStyleSheet(themedStyles);
  const [countryName, setCountryName] = React.useState('');
  const [topics, setTopics] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Get Token from REDUX
  const token = useSelector(selectToken);

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
    // const token = await AsyncStorage.getItem('token');
    let lang = await AsyncStorage.getItem('lang');
    lang = lang.substring(0, 2);
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
                    + `{"language": "` + lang + `"}`
                  + `}`
                + `}`
              + `]}`
          + `},`
          + `{"relation": "countryLanguage", "scope":`
              + `{"where":`
                + `{"language": "` + lang + `"}`
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
        setLoading(false);
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
        titleStyle={styles.topBarTitle}
        leftControl={renderDrawerAction() }
        style={styles.topBar}
      />
      <Spinner
          visible={loading}
          textContent={I18n.t('Loading') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
      <ScrollView>
      <Layout style={styles.container}>
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
      </Layout>
      </ScrollView>
      </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  container: {
    backgroundColor: 'background-basic-color-4',
  },
  mainTitleContainer: {
    padding: 16, paddingBottom: 10,
    backgroundColor: 'background-basic-color-4',
  },
  mainTitle: {
    textAlign: 'center',
    color: 'color-light-100',
  },
  elementContainer: {
    padding: 6, marginBottom: 10, flexDirection: 'column',
    backgroundColor: 'background-basic-color-4',
  },
  elementTitle: {
    color: 'color-light-100', fontWeight: 'bold',
  },
  elementDescription: {
    color: 'color-light-100', marginBottom: 4,
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