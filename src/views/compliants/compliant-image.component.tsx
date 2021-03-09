import React from 'react';
import { Image, StyleSheet, View, ImageSourcePropType, Text as TextNative } from 'react-native';
import { Button, ListItem, ListItemProps, Text } from '@ui-kitten/components';
import { CloseIcon, MinusIcon, PlusIcon } from '../../components/icons';

export class CompliantImageModel {

  constructor(readonly id: string,
              readonly name: string,
              readonly uri: string,
              readonly size: number,
              ) {
  }

}

export type CompliantImageProps = ListItemProps & {
  index: number;
  compliantImage: CompliantImageModel;
  onRemove: (compliantImage: CompliantImageModel, index: number) => void;
};

export const CompliantImage = (props: CompliantImageProps): React.ReactElement => {

  const { style, compliantImage, index, onRemove, ...listItemProps } = props;

  const onRemoveButtonPress = (): void => {
    onRemove(compliantImage, index);
  };

  const formatSize = (size): string => {
    if (size === 0) { return '0'; }
    const decimals = 2;
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <ListItem
      {...listItemProps}
      style={[styles.container, style]}
      >
      <Image
        style={styles.image}
        source={{uri: compliantImage.uri }}
      />
      <View style={styles.detailsContainer}>
        <TextNative style={styles.itemTitle} numberOfLines={1} ellipsizeMode={'tail'} >
          {compliantImage.name}
        </TextNative>
        <Text style={styles.itemSize}
          appearance='hint'
          category='p2'>
          {formatSize(compliantImage.size)}
        </Text>
      </View>
      <Button
        style={[styles.iconButton, styles.removeButton]}
        appearance='ghost'
        status='basic'
        icon={CloseIcon}
        onPress={onRemoveButtonPress}
      />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  image: {
    width: 64,
    height: 64,
    marginTop: 12,
    marginLeft: 16,
    marginBottom: 12,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    padding: 16,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  itemTitle: {
    fontWeight: 'bold',
    paddingRight: 20,
    marginBottom: 12,
  },
  itemSize: {

  },
});
