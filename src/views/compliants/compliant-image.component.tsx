import React from 'react';
import { Image, StyleSheet, View, ImageSourcePropType, Text as TextNative } from 'react-native';
import { Button, ListItem, ListItemProps, Text } from '@ui-kitten/components';
import { CloseIcon, MinusIcon, PlusIcon } from '../../components/icons';

export class CompliantImageModel {

  constructor(readonly id: string,
              readonly name: string,
              readonly mimeType: string,
              readonly size: number,
              ) {
  }

}

export type CompliantImageProps = ListItemProps & {
  index: number;
  compliantImage: CompliantImageModel;
  onItemPress: (compliantImage: CompliantImageModel, index: number) => void;
  onRemove: (compliantImage: CompliantImageModel, index: number) => void;
};

export const CompliantImage = (props: CompliantImageProps): React.ReactElement => {

  const { style, compliantImage, index, onItemPress, onRemove, ...listItemProps } = props;

  const onRemoveButtonPress = (): void => {
    onRemove(compliantImage, index);
  };

  // Select item event
  const onButtonPress = (): void => {
     onItemPress(compliantImage, index);
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

  // Document format image
  const formatFileImage = (mimeType: string): ImageSourcePropType => {
    let icon: ImageSourcePropType;

    if (mimeType === 'image/jpeg' || mimeType === 'image/png') {
      icon = require('../../assets/images/file-icon-image.png');
    } else {
      icon = require('../../assets/images/file-icon-pdf.png');
    }

    return icon;
  };

  return (
    <ListItem
      {...listItemProps}
      style={[styles.container, style]}
      onPress={onButtonPress}
      >
      <Image
        style={styles.image}
        source={formatFileImage(compliantImage.mimeType)}
      />
      <View style={styles.detailsContainer}>
        <TextNative style={styles.itemTitle} numberOfLines={1} ellipsizeMode={'tail'} >FILE {index + 1}
          {/* compliantImage.name */}
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
