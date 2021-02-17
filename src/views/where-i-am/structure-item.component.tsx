import React from 'react';
import { Image, StyleSheet, View, Alert } from 'react-native';
import { ListItem, ListItemProps, Text } from '@ui-kitten/components';

export type StructureItemProps = ListItemProps & {
  index: number;
  item: any;
  onListviewButtonPress: (idStructure: string, index: number, distance: number) => void;
};

export const StructureItem = (props: StructureItemProps): React.ReactElement => {

  const { index, item, onListviewButtonPress, ...listItemProps } = props;

  const onButtonPress = (): void => {
    let distance = null;
    if (item.distance) {
      distance = item.distance;
    }
    onListviewButtonPress(item.idStructure, index, distance);
  };

  return (
    <ListItem
      {...listItemProps}
      style={[styles.container]}
      onPress={onButtonPress}>
      <Image
        style={styles.image}
        source={{uri: 'data:image/png;base64,' + item.iconimage }}
      />
      <View style={styles.detailsContainer}>
        <Text
          category='s1'>
          {item.structurename}
        </Text>
        <Text
          appearance='hint'
          category='p2'>
          { /*item.structureAddress*/ item.city}
        </Text>
      </View>
      { item.distance && (
      <Text style={[styles.alignRight]}>{parseFloat(item.distance).toFixed(1)} km</Text>
      )}
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 4,
  },
  image: {
    width: 64,
    height: 64,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    padding: 16, backgroundColor: '#EEE',
  },
  alignRight: {
    position: 'absolute', top: 20,
    right: 12,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});
