import React from 'react';
import { View, ScrollView, ListRenderItemInfo } from 'react-native';
import { Button, Divider, List, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout, Icon } from '@ui-kitten/components';
import { MenuIcon } from '../components/icons';

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

export const WhereIAmDetailsScreen = (props): React.ReactElement => {
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
    <Layout style={{flex:1}}>
      <TopNavigation
        title='WhereIAmDetails'
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>

        <Divider/>
        <Text>
          Structures Details
        </Text>
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
  }
});
