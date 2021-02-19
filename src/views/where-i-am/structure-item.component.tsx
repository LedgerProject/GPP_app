import React from 'react';
import { Image, StyleSheet, View, Alert, Text as TextNative } from 'react-native';
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
        <TextNative numberOfLines={1} ellipsizeMode={'tail'}
          style={styles.structureName} >
          {item.structurename}
        </TextNative>
        <TextNative numberOfLines={1} ellipsizeMode={'tail'}
          style={styles.structureCity} >
          { /*item.structureAddress*/ item.city}
        </TextNative>
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
    paddingTop: 10,
    paddingRight: 90,
  },
  alignRight: {
    position: 'absolute', top: 20,
    right: 16,
    width: 75,
    textAlign: 'right',
    fontSize: 14,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  structureName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  structureCity: {
    fontSize: 13,
  },
});
