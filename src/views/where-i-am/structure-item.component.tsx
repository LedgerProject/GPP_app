import React from 'react';
import { Image, StyleSheet, View, Alert } from 'react-native';
import { ListItem, ListItemProps, Text } from '@ui-kitten/components';
//import { Structure } from './structure-item';
//import { Structure } from './structure-item';

/*export type StructureItemProps = ListItemProps & {
  index: number;
  structure: Structure;
  onPressitem: (structure: Structure, index: number) => void;
};*/

/*export const StructureItem = (props: StructureItemProps): React.ReactElement => {

  const { style, structure, index, onPressitem, ...listItemProps } = props;

  const onPressitemButtonPress = (): void => {
    onPressitem(structure, index);
  };
*/

export type StructureItemProps = ListItemProps & {
  index: number;
  item: any;
  onListviewButtonPress: (item: any, index: number) => void;
};

export const StructureItem = (props: StructureItemProps): React.ReactElement => {

  const { index, item, onListviewButtonPress, ...listItemProps } = props;

  const onButtonPress = (): void => {
    onListviewButtonPress(item,index);
  };  

  return (
    <ListItem
      {...listItemProps}
      style={[styles.container]}
      onPress={onButtonPress}>
      <Image
        style={styles.image}
        source={{uri: item.icon}} //https://reactjs.org/logo-og.png
      />
      <View style={styles.detailsContainer}>
        <Text
          category='s1'>
          {item.title}
        </Text>
        <Text
          appearance='hint'
          category='p2'>
          {item.address}
        </Text>
      </View>
      <Text style={[styles.alignRight]}>{item.distance}</Text>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom:4
  },
  image: {
    width: 64,
    height: 64,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    padding: 16, backgroundColor:'#EEE'
  },
  alignRight: {
    position: 'absolute', top:20,
    right: 12,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});