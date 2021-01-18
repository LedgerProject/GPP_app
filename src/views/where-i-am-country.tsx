import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Divider, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout, Icon } from '@ui-kitten/components';
import { MenuIcon } from '../components/icons';

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

export const WhereIAmCountryScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
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
        <Text style={styles.mainTitle}>Italy</Text>
      </Layout>

      <Layout style={styles.elementContainer}>
        <Text style={styles.elementTitle}>Topic 1</Text>
        <Text style={styles.elementDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        <Text style={styles.elementDescription}>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur.
        </Text>
      </Layout>
      <Layout style={styles.elementContainer}>
        <Text style={styles.elementTitle}>Topic 2</Text>
        <Text style={styles.elementDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        <Text style={styles.elementDescription}>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit
          esse cillum dolore eu fugiat nulla pariatur.
        </Text>
      </Layout>
      <Layout style={styles.elementContainer}>
        <Text style={styles.elementTitle}>Topic 3</Text>
        <Text style={styles.elementDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        <Text style={styles.elementDescription}>
          Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur.
        </Text>
      </Layout>
      <Layout style={styles.elementContainer}>
        <Text style={styles.elementTitle}>Topic 4</Text>
        <Text style={styles.elementDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        <Text style={styles.elementDescription}>
          Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur.
        </Text>
      </Layout>
      <Button
        status='basic'
        onPress={navigateBack}>
        Back
      </Button>
        <Divider/>
      </ScrollView>
    </Layout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  mainTitleContainer: {
    padding: 16,
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  elementContainer: {
    padding: 6,
    marginBottom: 10,
    flexDirection: 'column',
  },
  elementTitle: {
    fontSize: 13,
    color: '#444',
    fontWeight: 'bold',
  },
  elementDescription: {
    color: '#666',
    fontSize: 11,
    marginBottom: 4,
  },
});
