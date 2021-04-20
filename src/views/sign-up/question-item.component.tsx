import React from 'react';
import { StyleSheet, View, Text as TextNative } from 'react-native';
import { ListItem, ListItemProps, Text, useStyleSheet, StyleService } from '@ui-kitten/components';

export type QuestionItemProps = ListItemProps & {
  index: number;
  item: any;
  onListviewButtonPress: (index: number, item: any) => void;
};

export const QuestionItem = (props: QuestionItemProps): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const { index, item, onListviewButtonPress, ...listItemProps } = props;

  const onButtonPress = (): void => {
    onListviewButtonPress(index, item);
  };

  return (
    <ListItem
      {...listItemProps}
      style={[styles.container]}
      onPress={onButtonPress}>
      <View style={ item.answer ? styles.questionAnsweredContainer : styles.questionContainer } >
        <Text
          category='s1'
          status='control'
          style={styles.question} >
          {item.question}
        </Text>
        <Text
          status='control'
          style={styles.answer} >
          { item.answer }
        </Text>
      </View>
    </ListItem>
  );
};

const themedStyles = StyleService.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 4,
  },
  questionContainer: {
    flex: 1,
    height: '100%',
    padding: 16,
    backgroundColor: 'color-dark-100',
    paddingTop: 10,
    paddingRight: 10,
    borderRadius: 5,
  },
  questionAnsweredContainer: {
    flex: 1,
    height: '100%',
    padding: 16,
    backgroundColor: 'color-info-transparent-300',
    paddingTop: 10,
    paddingRight: 10,
    borderRadius: 5,
  },
  question: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  answer: {
    fontSize: 13,
    display: 'none',
  },
});
