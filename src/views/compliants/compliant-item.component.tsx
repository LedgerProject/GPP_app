import React from 'react';
import { Image, StyleSheet, View, ImageSourcePropType } from 'react-native';
import { Button, ListItem, ListItemProps, Text } from '@ui-kitten/components';
import { CloseIcon, MinusIcon, PlusIcon } from '../../components/icons';
import { Compliant } from './data';

export type CompliantItemProps = ListItemProps & {
  index: number;
  compliant: Compliant;
  onRemove: (compliant: Compliant, index: number) => void;
  onItemPress: (compliant: Compliant, index: number) => void;
};

export const CompliantItem = (props: CompliantItemProps): React.ReactElement => {

  const { style, compliant, index, onRemove, onItemPress, ...listItemProps } = props;

  const onRemoveButtonPress = (): void => {
    onRemove(compliant, index);
  };

  const onButtonPress = (): void => {
    onItemPress(compliant, index);
  };

  const substrDate = (date: any): any => {
    const shortDate = date.substr(0, 10);
    return shortDate;
  };

  return (
    <ListItem
      {...listItemProps}
      style={[styles.container, style]}
      onPress={onButtonPress}
      >
      <View style={styles.detailsContainer}>
        <Text
          category='s1'>
          {compliant.title}
        </Text>
        <Text
          appearance='hint'
          category='p2'>
          {substrDate(compliant.date)}
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
