import React from 'react';
import { Image, Platform, View , ScrollView, ListRenderItemInfo } from 'react-native';
import { Input, Button, Divider, List, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout, Icon } from '@ui-kitten/components';
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

  return (
    <Layout style={{flex:1}}>
      <TopNavigation
        title='Details'
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>

      <Layout level='1'>
      <View style={styles.header}>
        <Image
          style={styles.productImage}
          source={item.icon}
        />
        <View style={styles.detailsContainer}>
          <Text category='s1'>
            {item.title}
          </Text>
          <Text
            style={styles.authorLabel}
            appearance='hint'
            category='c1'>
            {`Author: ${item.address}`}
          </Text>
          <Text
            style={styles.priceLabel}
            category='s1'>
            {item.distance}
          </Text>
        </View>
      </View>
      <Layout
        style={styles.descriptionContainer}
        level='2'>
        <Text
          style={styles.aboutLabel}
          category='s1'>
          About Book
        </Text>
        <Text
          appearance='hint'>
          {item.title}
        </Text>
      </Layout>
    </Layout>


      </ScrollView>
    </Layout>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-1',
  },
  commentList: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 16,
  },
  detailsContainer: {
    marginHorizontal: 24,
  },
  productImage: {
    width: 140,
    height: 180,
  },
  authorLabel: {
    marginVertical: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
    marginHorizontal: -4,
  },
  categoryItem: {
    marginHorizontal: 4,
    borderRadius: 16,
  },
  rateBar: {
    marginHorizontal: -4,
  },
  priceLabel: {
    marginVertical: 16,
  },
  buyButton: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  aboutLabel: {
    marginBottom: 16,
  },
  commentInputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'text-basic-color',
  },
  commentInput: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 20,
  },
});
