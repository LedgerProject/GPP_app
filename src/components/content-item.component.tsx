// React import
import React from 'react';

// React native import
import { StyleSheet, View } from 'react-native';

// UIKitten import
import { Button, ListItem, ListItemProps, Text } from '@ui-kitten/components';

// Models import
import { Content } from '../model/content.model';

// Components import
import { CloseIcon } from './icons';

export type ContentItemProps = ListItemProps & {
  index: number;
  content: Content;
  onRemove: (content: Content, index: number) => void;
  onItemPress: (content: Content, index: number) => void;
};

export const ContentItem = (props: ContentItemProps): React.ReactElement => {
  const { style, content, index, onRemove, onItemPress, ...listItemProps } = props;

  const onRemoveButtonPress = (): void => {
    onRemove(content, index);
  };

  const onButtonPress = (): void => {
    onItemPress(content, index);
  };

  const substrDate = (date: any): any => {
    const shortDate = date.substr(0, 10);
    return shortDate;
  };

  return (
    <ListItem
      {...listItemProps}
      style={[styles.container, style]}
      onPress={onButtonPress}>
      <View style={styles.detailsContainer}>
        <Text
          category='s1'>
          {content.title}
        </Text>
        <Text
          appearance='hint'
          category='p2'>
          {substrDate(content.insertDate)}
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
});
