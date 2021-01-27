import React from 'react';
import { Image, StyleSheet, View, ImageSourcePropType } from 'react-native';
import { Button, ListItem, ListItemProps, Text } from '@ui-kitten/components';
import { CloseIcon, MinusIcon, PlusIcon } from '../../components/icons';
import { Document } from './data';

export type DocumentItemProps = ListItemProps & {
  index: number;
  document: Document;
  onRemove: (document: Document, index: number) => void;
};

export const DocumentItem = (props: DocumentItemProps): React.ReactElement => {

  const { style, document, index, onRemove, ...listItemProps } = props;

  const onRemoveButtonPress = (): void => {
    onRemove(document, index);
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

  const formatFileImage = (mimeType: string): ImageSourcePropType => {
    let icon: ImageSourcePropType;
    if (mimeType === 'image/jpeg' || mimeType === 'image/png') {
      icon = require('../../assets/images/icon-image.png');
    } else {
      icon = require('../../assets/images/icon-pdf.png');
    }
    return icon;
  };

  return (
    <ListItem
      {...listItemProps}
      style={[styles.container, style]}>
      <Image
        style={styles.image}
        source={formatFileImage(document.mimeType)}
      />
      <View style={styles.detailsContainer}>
        <Text
          category='s1'>
          {document.title}
        </Text>
        <Text
          appearance='hint'
          category='p2'>
          {formatSize(document.size)}
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
});
