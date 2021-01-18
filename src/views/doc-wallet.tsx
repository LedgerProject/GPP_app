import React from 'react';
import { View, ScrollView, ListRenderItemInfo } from 'react-native';
import { Button, Divider, List, Layout, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { MenuGridList } from '../components/menu-grid-list.component';
import { DocumentItem } from './doc-wallet/document-item.component';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { MenuIcon } from '../components/icons';
import { data, Document } from './doc-wallet/data';

const initialDocuments: Document[] = [
  Document.passportDocument(),
  Document.idDocument(),
  Document.vaccinationPage1(),
  Document.vaccinationPage2(),
  Document.testDoc1(),
  Document.testDoc2(),
];

export const DocWalletScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [documents, setDocuments] = React.useState<Document[]>(initialDocuments);

  const onItemPress = (index: number): void => {
    props.navigation.navigate(data[index].route);
  };

  const onItemRemove = (document: Document, index: number): void => {
    documents.splice(index, 1);
    setDocuments([...documents]);
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  const renderDocumentItem = (info: ListRenderItemInfo<Document>): React.ReactElement => (
    <DocumentItem
      style={styles.item}
      index={info.index}
      document={info.item}
      onRemove={onItemRemove}
    />
  );

  const onGenerateTokenButtonPress = (): void => {
    props.navigation && props.navigation.navigate('Homepage');
  };

  return (
    <SafeAreaLayout
      style={styles.container}
      insets='top'>
      <TopNavigation
        title='DocWallet'
        leftControl={renderDrawerAction()}
      />
      <Layout
      style={styles.container}
      level='2'>
        <View>
          <MenuGridList
            data={data}
            onItemPress={onItemPress}
          />
        </View>
        <Divider/>
        <Text
          style={styles.infoSection}>
          Tap on document for the preview. Swipe left on document to delete it.
        </Text>
        <List
          data={documents}
          renderItem={renderDocumentItem}
        />
        <Divider/>
        <Text
          style={styles.infoSection}>
          Generate a 30-minute token to be communicated to the operator to allow him to check your documens.
        </Text>
        <Button
          style={styles.generateTokenButton}
          size='giant'
          appearance='outline'
          onPress={onGenerateTokenButtonPress}>
          GENERATE A 30-MINUTE TOKEN
        </Button>
      </Layout>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  infoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginHorizontal: 16,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
  generateTokenButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
});
