import React from 'react';
import { View } from 'react-native';
import {
  Button,
  Layout,
  StyleService,
  useStyleSheet,
  Select,
  TopNavigation,
  TopNavigationAction,
  Divider,
} from '@ui-kitten/components';
import { languageOptions } from './settings/data';
import { MenuIcon, GlobeIcon } from '../components/icons';
import { KeyboardAvoidingView } from '../services/3rd-party';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

export const SettingsScreen = (props): React.ReactElement => {
  const [language, setLanguage] = React.useState(props.selectedOption);

  const styles = useStyleSheet(themedStyles);

  const onSelectLanguage = (option) => {
    setLanguage(option);
  };

  const onSaveButtonPress = (): void => {
    // TODO
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  return (
    <SafeAreaLayout insets='top' style={styles.safeArea}>
      <View
        style={{flex: 1}}>
        <TopNavigation
          title='Settings'
          leftControl={renderDrawerAction()}
        />
        <Divider />
        <ScrollView>
          <KeyboardAvoidingView style={styles.container}>
            <Layout
              style={styles.formContainer}
              level='1'>
              <Select
                {...props}
                icon={GlobeIcon}
                style={styles.select}
                selectedOption={language}
                data={languageOptions}
                placeholder='Select the application language'
                onSelect={onSelectLanguage}
              />
              <Divider />
              <Button
                  style={styles.saveButton}
                  size='giant'
                  onPress={onSaveButtonPress}>
                  Save
              </Button>
            </Layout>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  container: {
    backgroundColor: 'background-basic-color-1',
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  select: {
    marginTop: 8,
    marginBottom: 12,
    width: '100%',
  },
  infoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 4,
    marginHorizontal: 16,
  },
  saveButton: {
    marginTop: 12,
    marginHorizontal: 16,
  },
});
