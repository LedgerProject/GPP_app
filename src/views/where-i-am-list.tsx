import React from 'react';
import { View, ScrollView, ListRenderItemInfo } from 'react-native';
import { Input, Button, Divider, List, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout } from '@ui-kitten/components';
import { MenuIcon } from '../components/icons';

export const WhereIAmListScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [filter, setFilter] = React.useState('');
  const onMapButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmMap');
  };

  const onCountryButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmCountry');
  }; 

  const onDetailsButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmDetails');
  };   

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  return (
    <Layout style={{flex:1}}>
      <TopNavigation
        title='Structures List'
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>

      <Layout style={styles.filtersContainer}>
        <Text style={styles.labelWhat}>What are you searching for?</Text>

        <Input
          placeholder='Enter a term to filter the search'          
          value={filter}
          onChangeText={setFilter}                      
       />           
      </Layout>
      <Layout>
      <Button style={styles.button} status='basic' onPress={onDetailsButtonPress}>Details</Button>
      </Layout>    
      <Layout style={styles.buttonsContainer}>
       <Layout style={styles.buttonLeft} >
        <Button style={styles.button} status='basic' onPress={onMapButtonPress}>Map</Button>
       </Layout>
       <Layout style={styles.buttonRight} >
        <Button style={styles.button} status='basic' onPress={onCountryButtonPress}>Country</Button>  
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

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  labelWhat: {
    fontSize: 12,
    textAlign: 'left',
    color: 'grey',
  },
  topContainer: {
    padding: 6, paddingLeft:12, paddingRight:12    
  },
  downContainer: {
    flexDirection:'column',marginTop:10 
  },
  downText: {
    textAlign:'center'
  },
  downTextBold: {
    textAlign:'center',fontWeight:'bold',fontSize:16
  },
  buttonRight: {
    width:'50%', height:'auto', flex: 1, marginLeft:5, marginRight:10, alignItems:'center'    
  },
  buttonLeft: {
    width:'50%', height:'auto', flex: 1, marginLeft:10, marginRight:5, alignItems:'center'
  },
  buttonsContainer: {
    flexDirection:'row',marginTop:10 
  },
  filtersContainer: {
    marginHorizontal:10
  },
  button: { width:'100%' } 
});
