import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Button, Divider, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout, Select } from '@ui-kitten/components';
import { MenuIcon } from '../components/icons';
import { categoryOptions } from './where-i-am/data-category';

export const WhereIAmMapScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  const [filter, setFilter] = React.useState(props.selectedOption);
  const onSelectFilter = (option) => {
    setFilter(option);
  };

  const onListButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmList');
  };

  const onCountryButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmCountry');
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  return (
    <Layout style={{flex: 1}}>
      <TopNavigation
        title='Structures Map'
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>
        <Layout style={styles.filtersContainer}>
          <Text style={styles.labelWhat}>What are you searching for?</Text>
          <Select
                {...props}
                style={styles.select}
                selectedOption={filter}
                data={categoryOptions}
                placeholder='Show All'
                onSelect={onSelectFilter}
              />
        </Layout>
        <Layout style={styles.mapContainer}>
          <Image source={require('../../src/assets/images/mappafull.jpg')} style={styles.Map}/>
        </Layout>
        <Layout style={styles.buttonsContainer}>
         <Layout style={styles.buttonLeft} >
          <Button style={styles2.button} status='basic' size='small' onPress={onListButtonPress}>Show List</Button>
         </Layout>
         <Layout style={styles.buttonRight} >
          <Button style={styles2.button} status='basic'
            size='small' onPress={onCountryButtonPress}>Country Informations</Button>
         </Layout>
        </Layout>
        <Layout style={styles.downContainer}>
          <Text style={styles.downText}>Now you are on:</Text>
          <Text style={styles.downTextBold}>ITALY</Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};

const styles2 = StyleSheet.create({
  button: { width: '100%' },
});

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  labelWhat: {
    fontSize: 12,
    textAlign: 'left',
    color: 'grey',
  },
  select: {
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
  },
  topContainer: {
    padding: 6,
    paddingLeft: 12,
    paddingRight: 12,
  },
  downContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  downText: {
    textAlign: 'center',
  },
  downTextBold: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
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
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  filtersContainer: {
    marginHorizontal: 10,
  },
  mapContainer: {
    width: '100%',
  },
  Map: {
    width: '100%',
    height: 350,
    margin: 0,
  },
  button: {
    width: '100%',
  },
});
