// React import
import React, { useEffect } from 'react';

// React Native import
import { View, Image, TouchableOpacity } from 'react-native';
import { ImagePickerResponse } from 'react-native-image-picker';

// Model import
import { MenuItem } from '../model/menu-item.model';

// UIKitten import
import { Button, Divider, Layout, Select, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

// Locale import
import I18n from './../i18n/i18n';

// Component import
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { ArrowBackIcon } from '../components/icons';
import { GlobeIcon } from '../components/icons';

// Model import
import tampepLanguageOptions from '../model/tampep-language.model';

// Other imports
import { KeyboardAvoidingView } from '../services/3rd-party';
import { WebBrowserService } from '../services/web-browser.service';

// LayoutData interface
export interface LayoutData extends MenuItem {
  route: string;
}

export const TampepPage = (props): React.ReactElement => {
  const [language, setLanguage] = React.useState({'lang': 'en', 'text': 'English'});

  const styles = useStyleSheet(themedStyles);

  // Navigate previous page
  const navigateBack = () => {
    props.navigation.goBack();
  };

  // Render top navigation menu
  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowBackIcon}
      onPress={navigateBack}
    />
  );

  const openTampep = () => {
    WebBrowserService.openBrowserAsync('https://www.tampep.eu');
  };

  const openServicesSexWorkers = () => {
    WebBrowserService.openBrowserAsync('https://www.services4sexworkers.eu');
  };

  const openTampepBooklet = () => {
    WebBrowserService.openBrowserAsync('https://tampep.eu/wp-content/uploads/2021/12/Booklet_FINAL.pdf');
  };

  const showVideo = () => {
    WebBrowserService.openBrowserAsync('https://www.youtube.com/watch?v=9xV-aSeXlN4');
  };

  // On selecting language event
  const onSelectLanguage = (option) => {
    setLanguage(option);
  };

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <KeyboardAvoidingView style= {styles.FlexGrowOne}>
        <TopNavigation
          title={I18n.t('Tampep')}
          titleStyle={styles.topBarTitle}
          leftControl={renderDrawerAction()}
          style={styles.topBar}
        />
        <Layout
          style={styles.container}
          level='2'>
          <Select
            {...props}
            icon={GlobeIcon}
            style={styles.select}
            selectedOption={language}
            data={tampepLanguageOptions}
            placeholder={I18n.t('Select the language')}
            onSelect={onSelectLanguage}
          />
          <View
            style={styles.title}>
            <Image
              source={require('../assets/images/tampep.jpg')}
              style={styles.imageStyle}
            />
            <Text
              category='s1'
              style={styles.heading}>
              { language.lang === 'en' && I18n.t('TampepDescriptionEng1') }
              { language.lang === 'es' && I18n.t('TampepDescriptionEsp1') }
              { language.lang === 'pt' && I18n.t('TampepDescriptionPor1') }
            </Text>
            <Text
              category='s1'
              style={styles.subtitle}>
              { language.lang === 'en' && I18n.t('TampepDescriptionEng2') }
              { language.lang === 'es' && I18n.t('TampepDescriptionEsp2') }
              { language.lang === 'pt' && I18n.t('TampepDescriptionPor2') }
            </Text>
            <Text
              category='s1'
              style={styles.paragraph}>
              { language.lang === 'en' && I18n.t('TampepDescriptionEng3') }
              { language.lang === 'es' && I18n.t('TampepDescriptionEsp3') }
              { language.lang === 'pt' && I18n.t('TampepDescriptionPor3') }
            </Text>
            <Text
              category='s1'
              style={styles.paragraph}>
              { language.lang === 'en' && I18n.t('TampepDescriptionEng4') }
              { language.lang === 'es' && I18n.t('TampepDescriptionEsp4') }
              { language.lang === 'pt' && I18n.t('TampepDescriptionPor4') }
            </Text>
            <Text
              category='s1'
              style={styles.paragraphBold}>
              { language.lang === 'en' && I18n.t('TampepDescriptionEng5') }
              { language.lang === 'es' && I18n.t('TampepDescriptionEsp5') }
              { language.lang === 'pt' && I18n.t('TampepDescriptionPor5') }
            </Text>
            <Text
              category='s1'
              style={styles.paragraph}>
              { language.lang === 'en' && I18n.t('TampepDescriptionEng6') }
              { language.lang === 'es' && I18n.t('TampepDescriptionEsp6') }
              { language.lang === 'pt' && I18n.t('TampepDescriptionPor6') }
            </Text>
            <Text
              category='s1'
              style={styles.paragraphBoldRed}>
              { language.lang === 'en' && I18n.t('TampepDescriptionEng7') }
              { language.lang === 'es' && I18n.t('TampepDescriptionEsp7') }
              { language.lang === 'pt' && I18n.t('TampepDescriptionPor7') }
            </Text>
            <Text
              category='s1'
              style={styles.paragraph}>
              { language.lang === 'en' && I18n.t('TampepDescriptionEng8') }
              { language.lang === 'es' && I18n.t('TampepDescriptionEsp8') }
              { language.lang === 'pt' && I18n.t('TampepDescriptionPor8') }
            </Text>
            <TouchableOpacity activeOpacity = { .5 } onPress={showVideo}>
              <Image
                source={require('../assets/images/tampep-video-play.jpg')}
                style={styles.videoImage}
              />
            </TouchableOpacity>
          </View>
          <Button
            style={styles.sendButton}
            size='giant'
            appearance='outline'
            onPress={openTampep}
          >
            { I18n.t('Visit tampep') }
          </Button>
          <Button
            style={styles.sendButton}
            size='giant'
            appearance='outline'
            onPress={openServicesSexWorkers}
          >
            { I18n.t('Visit services4sexworkers') }
          </Button>
          <Button
            style={styles.sendButton}
            size='giant'
            appearance='outline'
            onPress={openTampepBooklet}
          >
            { I18n.t('Tampep Booklet') }
          </Button>
          <Divider/>
        </Layout>
      </KeyboardAvoidingView>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  FlexGrowOne: {
    flexGrow : 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-4',
  },
  buttonsContainer: {
    backgroundColor: 'background-basic-color-4',
  },
  safeArea: {
    flex: 1,
  },
  listContainer: {
    marginHorizontal: 16,
    borderRadius: 4,
    padding: 5,
    marginBottom: 20,
  },
  infoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginHorizontal: 16,
    color: 'color-light-100',
    textAlign: 'center',
  },
  label: {
    color: 'color-light-100',
  },
  divider: {
    backgroundColor: 'color-primary-default',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
  sendButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop_black: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  modal: {
    textAlign: 'center',
    margin: 12,
    padding: 12,
  },
  modalText: {
    marginBottom: 4,
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: 4,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 4,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageStyle: {
    width: '100%',
    height: 300,
  },
  videoImage: {
    marginTop: 20,
    width: '100%',
    height: 200,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  topBar: {
    backgroundColor: 'color-primary-default',
  },
  topBarTitle: {
    color: '#FFFFFF',
  },
  topBarIcon: {
    color: '#FFFFFF',
    tintColor: '#FFFFFF',
  },
  title: {
    marginHorizontal: 16,
    marginTop: 5,
  },
  description: {
    marginHorizontal: 16,
    marginTop: 5,
    marginBottom: 10,
    color: 'color-light-100',
  },
  inputTitle: {
    backgroundColor: '#FFFFFF',
  },
  inputDescription: {
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
  },
  toggle: {
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 16,
    marginRight: 16,
    textAlign: 'left',
    flexDirection: 'row',
    color: 'color-light-100',
  },
  modalButtonRight: {
    width: '100%',
    height: 'auto',
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  modalButtonLeft: {
    width: '100%',
    height: 'auto',
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  heading: {
    color: '#F00',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'justify',
    marginTop: 10,
  },
  subtitle: {
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'justify',
    color: '#FFF',
  },
  paragraph: {
    marginTop: 5,
    textAlign: 'justify',
    color: '#FFF',
  },
  paragraphBold: {
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'justify',
    color: '#FFF',
  },
  paragraphBoldRed: {
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'justify',
    color: '#F00',
  },
  select: {
    marginTop: 8,
    marginBottom: 12,
    width: '100%',
  },
});
