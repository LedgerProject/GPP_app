import React from 'react';
import { Image } from 'react-native';

const IconProvider = (source) => ({
  toReactElement: ({ animation, ...props }) => (
    <Image {...props} source={source}/>
  ),
});

export const CustomIconsPack = {
  name: 'assets',
  icons: {
    'custom-doc-wallet': IconProvider(require('../assets/images/icons8-documenti-del-prodotto-96.png')),
    'custom-where-i-am': IconProvider(require('../assets/images/icons8-geo-recinto-96.png')),
    'custom-take-photo': IconProvider(require('../assets/images/icons8-aggiungere-la-macchina-fotografica-96.png')),
    'custom-from-library': IconProvider(require('../assets/images/icons8-galleria-di-immagini-96.png')),
    'custom-new-compliant': IconProvider(require('../assets/images/icons8-aggiungi-proprietà-96.png')),
    'custom-compliants': IconProvider(require('../assets/images/icons8-documenti-del-prodotto-96.png')),
    // ...
  },
};
