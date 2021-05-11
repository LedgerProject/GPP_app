// React import
import React, { useEffect } from 'react';

// React Native import
import { ScrollView } from 'react-native';

// UIKitten import
import { Divider, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout } from '@ui-kitten/components';

// Environment import
import { AppOptions } from '../services/app-env';

// Locale import
import I18n from './../i18n/i18n';

// Component import
import { ArrowBackIcon, MenuIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

// Axios import
import axios from 'axios';

// AsyncStorage import
import AsyncStorage from '@react-native-async-storage/async-storage';

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';

export const AroundMeCountryScreen = (props): React.ReactElement => {
  const [countryName, setCountryName] = React.useState('');
  const [topics, setTopics] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { Country } = props.route.params;
  const styles = useStyleSheet(themedStyles);

  // Get Token from Redux
  const token = useSelector(selectToken);

  // Back to the previous page
  const navigateBack = () => {
    props.navigation.goBack();
  };

  // Use effect
  useEffect(() => {
    getCountry();
  }, []);

  // Get country information
  async function getCountry() {
    // Show spinner
    setLoading(true);

    // Get current language
    let lang = await AsyncStorage.getItem('lang');
    lang = lang.substring(0, 2);

    // Set the filters
    const filters = `?filter={`
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
      + `}`;

    axios
      .get(AppOptions.getServerUrl() + 'countries' + filters, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // Hide spinner
        setLoading(false);

        const data: any = response.data[0];
        setCountryName(data.countryLanguage[0].country);

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
        // Hide spinner
        setLoading(false);

        setCountryName(I18n.t('Country not found'));
      });
  }

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowBackIcon}
      onPress={navigateBack}
    />
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={I18n.t('AroundMe - Country')}
        titleStyle={styles.topBarTitle}
        leftControl={renderDrawerAction() }
        style={styles.topBar}
      />
      <Spinner
          visible={loading}
          textContent={I18n.t('Please wait') + '...'}
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
              <Divider style={styles.divider} />
            </Layout>
          ))}
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
    padding: 6,
    marginBottom: 10,
    flexDirection: 'column',
    backgroundColor: 'background-basic-color-4',
  },
  elementTitle: {
    color: 'color-light-100',
    fontWeight: 'bold',
  },
  elementDescription: {
    color: 'color-light-100',
    marginBottom: 4,
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
  divider: {
    marginTop: 20,
  },
});
