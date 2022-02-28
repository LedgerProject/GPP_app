// React import
import React from 'react';

// React Native import
import { Image } from 'react-native';

const IconProvider = (source) => ({
  toReactElement: ({ animation, ...props }) => (
    <Image {...props} source={source}/>
  ),
});

export const CustomIconsPack = {
  name: 'assets',
  icons: {
    'custom-doc-wallet': IconProvider(require('../assets/images/icon-doc-wallet-96.png')),
    'custom-around-me': IconProvider(require('../assets/images/icon-around-me-96.png')),
    'custom-abuse-alarm': IconProvider(require('../assets/images/icon-abuse-alarm-96.png')),
    'custom-news-stories': IconProvider(require('../assets/images/icon-news-stories-96.png')),
    'custom-tampep': IconProvider(require('../assets/images/icon-tampep-96.png')),
    'custom-my-profile': IconProvider(require('../assets/images/icon-profile-96.png')),
    'custom-settings': IconProvider(require('../assets/images/icon-settings-96.png')),
    'custom-take-photo': IconProvider(require('../assets/images/icon-take-photo-96.png')),
    'custom-from-library': IconProvider(require('../assets/images/icon-from-library-96.png')),
  },
};
