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

  /*let topics = 
    [
      {'title': 'Topic 1','description':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
      {'title': 'Topic 2','description':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
      {'title': 'Topic 3','description':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
      {'title': 'Topic 4','description':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
    ];*/ 

  return (
    <Layout style={{flex:1}}>
      <TopNavigation
        title='Country'
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>

      <Layout style={styles.mainTitleContainer}>
        <Text category='h4' style={styles.mainTitle}>Italy</Text>
      </Layout>

      { topics.map( (item,index) =>(
      <Layout key={index} style={styles.elementContainer}>
        <Text category='s1' style={styles.elementTitle}>{item.title}</Text>
        <Text category='p2' style={styles.elementDescription}>{item.description}</Text>       
        <Divider/>
      </Layout>      
         ))
      }

      {/*<Layout style={styles.elementContainer}>
        <Text category='s1' style={styles.elementTitle}>Topic 1</Text>
        <Text category='p2' style={styles.elementDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</Text> 
        
      </Layout>
      <Layout style={styles.elementContainer}>
        <Text category='s1' style={styles.elementTitle}>Topic 2</Text>
        <Text category='p2' style={styles.elementDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</Text> 
      </Layout>
      <Layout style={styles.elementContainer}>
        <Text category='s1' style={styles.elementTitle}>Topic 3</Text>
        <Text category='p2' style={styles.elementDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</Text> 
      </Layout>
      <Layout style={styles.elementContainer}>
        <Text category='s1' style={styles.elementTitle}>Topic 4</Text>
        <Text category='p2' style={styles.elementDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</Text> 
      </Layout>*/ } 
         

      </ScrollView>
    </Layout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  mainTitleContainer: {
    padding: 16, marginBottom:10
  },
  mainTitle: {
    textAlign: 'center',
  },
  elementContainer: {
    padding: 6, marginBottom:10, flexDirection:'column'    
  },
  elementTitle: {
    color: '#444',fontWeight:'bold'
  },
  elementDescription: {
    color:'#666', marginBottom:4
  }  
});
