import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Divider, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout, Icon } from '@ui-kitten/components';
import { ArrowBackIcon, MenuIcon } from '../components/icons';
import { TopNavigationScreen } from 'src/scenes/components/top-navigation/top-navigation.component';
import topics from './where-i-am/data-topics';

export const WhereIAmCountryScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  );

  return (
    <Layout style={{flex: 1}}>
      <TopNavigation
        title='Country'
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>

      <Layout style={styles.mainTitleContainer}>
        <Text category='h4' style={styles.mainTitle}>Italy</Text>
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
    </Layout>
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
});
