import React from 'react';
import { Image, Platform, View , ScrollView, ListRenderItemInfo, ImageBackground } from 'react-native';
import {
  Input, Button, Divider, List, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Layout, Icon
} from '@ui-kitten/components';
import { ArrowBackIcon, MenuIcon } from '../components/icons';

export const WhereIAmDetailsScreen = (props): React.ReactElement => {

  const { item } = props.route.params;

  const styles = useStyleSheet(themedStyles);

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  );

  const onNavigatorButtonPress = (): void => {
    //props.navigation && props.navigation.navigate('WhereIAmList');
  };

  const onContactButtonPress = (): void => {
    //props.navigation && props.navigation.navigate('WhereIAmCountry');
  };  

  return (
    <Layout style={{flex: 1}}>
      <TopNavigation
        title='Details'
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>
  <Layout style={styles.header}>
  <ImageBackground
    style={styles.image}
    source={{uri: item.icon}}
  />
  <Layout
    style={styles.detailsContainer}
    level='1'>
    <Text
      category='h6'>
      {item.title}
    </Text>
    <Text
      style={styles.subtitle}
      appearance='hint'
      category='p2'>
      {item.address}
    </Text>
    <Text
      style={styles.price}
      category='h4'>
      {item.distance}
    </Text>
    <Text
      style={styles.description}
      appearance='hint'>{item.description}</Text>

    <Layout style={styles.mapContainer}>
          <Image source={require('../../src/assets/images/mappafull.jpg')} style={styles.Map}/>
    </Layout>

    <View style={styles.elementSubcontainer}>
          <Text>Latitude: <Text>{item.longitude}</Text></Text>
    </View>
    <View style={styles.elementSubcontainer}>
          <Text>Longitude: <Text>{item.longitude}</Text></Text>
    </View>
  </Layout>
  <Layout style={styles.buttonsContainer}>
         <Layout style={styles.buttonLeft} >
          <Button style={styles.button} status='basic' size='small' onPress={onNavigatorButtonPress}>Start the navigator</Button>
         </Layout>
         <Layout style={styles.buttonRight} >
          <Button style={styles.button} status='basic'
            size='small' onPress={onContactButtonPress}>Contact us</Button>
         </Layout>
  </Layout>

</Layout>  
</ScrollView>    
</Layout>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  commentList: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    marginBottom: 8,
  },
  image: {
    height: 340,
    width: '100%',
  },
  detailsContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
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
    flexDirection:'row'
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
  button: { width: '100%' },
});