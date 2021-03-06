// React import
import React from 'react';

// React Native import
import { Dimensions, ListRenderItemInfo, StyleSheet, View, ImageBackground } from 'react-native';

// UIKitten import
import { Card, List, ListElement, ListItemElement, ListProps, Text } from '@ui-kitten/components';

// Model import
import { MenuItem } from '../model/menu-item.model';

export interface MenuGridListProps extends Omit<ListProps, 'renderItem'> {
  data: MenuItem[];
  onItemPress: (index: number, var_name: string, var_value: boolean) => void;
  footerComponent?: any;
}


export const MenuGridList = (props: MenuGridListProps): ListElement => {
  const { contentContainerStyle, onItemPress, footerComponent, ...listProps } = props;

  const renderItem = (info: ListRenderItemInfo<MenuItem>): ListItemElement => (
    <Card
      style={styles.item}
      onPress={() => props.onItemPress(info.index, info.item.var_name, info.item.var_value)}>
      {info.item.icon({ width: 64, height: 64, alignSelf: 'center' })}
      <Text
        style={styles.itemTitle}
        category='s2'>
        {info.item.title}
      </Text>
    </Card>
  );

  return (
    <List
      {...listProps}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      numColumns={2}
      renderItem={renderItem}
      ListFooterComponent={footerComponent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    aspectRatio: 1.0,
    margin: 8,
    maxWidth: Dimensions.get('window').width / 2 - 24,
  },
  itemImage: {
    alignSelf: 'center',
    width: 64,
    height: 64,
  },
  itemTitle: {
    alignSelf: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
});
