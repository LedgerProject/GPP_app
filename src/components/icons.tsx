// React import
import React from 'react';

// React Native import
import { ImageStyle } from 'react-native';

// UIKitten import
import { Icon, IconElement } from '@ui-kitten/components';

/*** CUSTOM ICONS ***/

// DocWallet icon
export const CustomDocWalletIcon = (props) => (
  <Icon {...props} name='custom-doc-wallet' pack='assets' />
);

// AroundMe icon
export const CustomAroundMeIcon = (props) => (
  <Icon {...props} name='custom-around-me' pack='assets' />
);

// AbuseAlarm icon
export const CustomAbuseAlarmIcon = (props) => (
  <Icon {...props} name='custom-abuse-alarm' pack='assets' />
);

// News&Stories icon
export const CustomNewsStoriesIcon = (props) => (
  <Icon {...props} name='custom-news-stories' pack='assets' />
);

// Take Photo icon
export const CustomTakePhotoIcon = (props) => (
  <Icon {...props} name='custom-take-photo' pack='assets' />
);

// From Library icon
export const CustomFromLibraryIcon = (props) => (
  <Icon {...props} name='custom-from-library' pack='assets' />
);

/*** ASSETS ICONS ***/

export const AssetDocWalletIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='doc-wallet'/>
);

export const AssetDocWalletDarkIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='doc-wallet-dark'/>
);

export const AssetAroundMeIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='around-me'/>
);

export const AssetAroundMeDarkIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='around-me-dark'/>
);

export const AssetAbuseAlarmIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='abuse-alarm'/>
);

export const AssetAbuseAlarmDarkIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='abuse-alarm-dark'/>
);

export const AssetNewsStoriesIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='news-stories'/>
);

export const AssetNewsStoriesDarkIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='news-stories-dark'/>
);

export const AssetTakePhotoIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='takephoto'/>
);

export const AssetTakePhotoDarkIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='takephoto-dark'/>
);

export const AssetPhotoLibraryIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='photolibrary'/>
);

export const AssetPhotoLibraryDarkIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} pack='app' name='photolibrary-dark'/>
);

/*** EVA ICONS ***/
export const MinusIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='minus'/>
);

export const PlusIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='plus'/>
);

export const EyeIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='eye'/>
);

export const EyeOffIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='eye-off'/>
);

export const EmailIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='email'/>
);

export const HomeIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='home'/>
);

export const BookOpenIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='book-open'/>
);

export const LockIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='lock'/>
);

export const LogoutIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='log-out'/>
);

export const MapIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='map'/>
);

export const PersonIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='person'/>
);

export const Settings2Icon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='settings-2'/>
);

export const GlobeIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='globe'/>
);

export const PinIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='pin'/>
);

export const BellIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='bell'/>
);

export const BookIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='book'/>
);

export const StopCircleIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='stop-circle'/>
);

export const CalendarIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='calendar'/>
);

export const ArrowBackIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='arrow-back-outline' fill='#FFFFFF' />
);

export const MenuIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='menu' fill='#FFFFFF'/>
);

export const ListIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='list'/>
);

export const CloseIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='close'/>
);
