import React from 'react';
import { View, ScrollView, ListRenderItemInfo, Alert } from 'react-native';
import {
  Input, Button, Divider, List, ListItem, StyleService, Text,
  TopNavigation, TopNavigationAction, useStyleSheet, Layout, Select,
} from '@ui-kitten/components';
import { ArrowBackIcon, MenuIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { categoryOptions } from './where-i-am/data-category';

import structures from './where-i-am/data-structures';
import { StructureItem } from './where-i-am/structure-item.component';
/*import { Structure } from './where-i-am/structure-item'
import { StructureItem } from './where-i-am/structure-item.component';

const initialStructures: Structure[] = [
  Structure.Structure_001(),
  Structure.Structure_002(),
  Structure.Structure_003(),
  Structure.Structure_004()
];*/

export const WhereIAmListScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  const [filter, setFilter] = React.useState(props.selectedOption);
  const [searchterm, setSearchterm] = React.useState('');
  const onSelectFilter = (option) => {
    setFilter(option);
  };
  const onMapButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmMap');
  };

  const onCountryButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmCountry');
  };

  const onDetailsButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmDetails');
  };

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  );

  const onPressItem = (item: any, index: number): void => {
    props.navigation && props.navigation.navigate('WhereIAmDetails', { item: item });
  };

    const renderStructureItem = ({ item, index }) => (
    <StructureItem
      index={index}
      item={item}
      onListviewButtonPress={onPressItem}
      />
  );

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <TopNavigation
        title='Structures List'
        leftControl={renderDrawerAction()}
      />
      <Divider/>

      <Layout style={styles.safeArea}>
        <View style={styles.filtersContainer}>
          <Text style={styles.labelWhat}>What are you searching for?</Text>
          <Select
            {...props}
            style={styles.select}
            selectedOption={filter}
            data={categoryOptions}
            placeholder='Show All'
            onSelect={onSelectFilter}
            />
          <Input autoCapitalize='none' placeholder='Enter the term to filter the search'
            value={searchterm} onChangeText={setSearchterm} />
        </View>
        <List data={structures} renderItem={renderStructureItem} />
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonLeft} >
            <Button style={styles.button} status='basic' size='small' onPress={onMapButtonPress}>Show Map</Button>
          </View>
          <View style={styles.buttonRight} >
            <Button style={styles.button} status='basic'
              size='small' onPress={onCountryButtonPress}>Country Informations</Button>
          </View>
        </View>
        <Layout style={styles.downContainer}>
          <Text style={styles.downText}>Now you are on:</Text>
          <Text style={styles.downTextBold}>ITALY</Text>
        </Layout>
      </Layout>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  labelWhat: {
    textAlign: 'left',
    color: 'grey',
    marginTop: 4,
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
    width: '50%', height: 'auto', flex: 1, marginLeft: 5, marginRight: 10, alignItems: 'center',
  },
  buttonLeft: {
    width: '50%', height: 'auto', flex: 1, marginLeft: 10, marginRight: 5, alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row', marginTop: 10,
  },
  filtersContainer: {
    marginHorizontal: 10, marginBottom: 4,
  },
  button: { width: '100%' },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
});
