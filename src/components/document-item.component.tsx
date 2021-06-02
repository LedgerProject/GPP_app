// React import
import React from 'react';

// React native import
import { Image, StyleSheet, View, ImageSourcePropType } from 'react-native';

// UIKitten import
import { Button, ListItem, ListItemProps, Text, CheckBox } from '@ui-kitten/components';

// Components import
import { CloseIcon } from '../components/icons';

export type DocumentItemProps = ListItemProps & {
  index: number;
  document: Document;
  onRemove: (document: Document, index: number) => void;
  onItemPress: (document: Document, index: number) => void;
  onCheckboxPress: (value: boolean, document: Document, index: number) => void;
};

export class Document {
  constructor(
    readonly idDocument: string,
    readonly title: string,
    readonly size: string,
    readonly mimeType: string,
    public isChecked: boolean,
  ) {}
}

export const DocumentItem = (props: DocumentItemProps): React.ReactElement => {
  const { style, document, index, onRemove, onItemPress, onCheckboxPress, ...listItemProps } = props;
  const [checked, setChecked] = React.useState(false);

  // Remove document button press event
  const onRemoveButtonPress = (): void => {
    onRemove(document, index);
  };

  // Select item event
  const onButtonPress = (): void => {
    onItemPress(document, index);
  };

  // Checkbox change event
  const onCheckboxChange = (value): void => {
    setChecked(value);
    document.isChecked = value;
    onCheckboxPress(value, document, index);
  };

  // Document format size
  const formatSize = (size): string => {
    if (size === 0) {
      return '0';
    }

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
      icon = require('../assets/images/file-icon-image.png');
    } else {
      icon = require('../assets/images/file-icon-pdf.png');
    }

    return icon;
  };

  return (
    <ListItem
      {...listItemProps}
      style={[styles.container, style]}
      onPress={onButtonPress}
      >
      <View>
        <CheckBox
          style={styles.checkbox}
          checked={checked}
          onChange={nextChecked => onCheckboxChange(nextChecked)}>
        </CheckBox>
      </View>
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
    top: 15,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  checkbox: {
    top: 25,
    left: 10,
    marginRight: 10,
  },
});
