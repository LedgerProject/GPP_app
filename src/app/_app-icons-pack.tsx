import React from 'react';
import { Image, ImageRequireSource } from 'react-native';

/**
 * https://akveo.github.io/react-native-ui-kitten/docs/guides/icon-packages#3rd-party-icon-packages
 */
const IconProvider = (source: ImageRequireSource) => ({
  toReactElement: ({ animation, ...style }) => (
    <Image style={style} source={source}/>
  ),
});

export const AppIconsPack = {
  name: 'app',
  icons: {
    /*'docwallet': IconProvider(require('../assets/images/icon-docwallet.png')),
    'docwallet-dark': IconProvider(require('../assets/images/icon-docwallet-dark.png')),
    'structures': IconProvider(require('../assets/images/icon-structures.png')),
    'structures-dark': IconProvider(require('../assets/images/icon-structures-dark.png')),
    'newpost': IconProvider(require('../assets/images/icon-newpost.png')),
    'newpost-dark': IconProvider(require('../assets/images/icon-newpost-dark.png')),
    'social': IconProvider(require('../assets/images/icon-social.png')),
    'social-dark': IconProvider(require('../assets/images/icon-social-dark.png')),
    'takephoto': IconProvider(require('../assets/images/icon-takephoto.png')),
    'takephoto-dark': IconProvider(require('../assets/images/icon-takephoto-dark.png')),
    'photolibrary': IconProvider(require('../assets/images/icon-photolibrary.png')),
    'photolibrary-dark': IconProvider(require('../assets/images/icon-photolibrary-dark.png')),

    'auth': IconProvider(require('../assets/images/icon-auth.png')),
    'auth-dark': IconProvider(require('../assets/images/icon-auth-dark.png')),
    'articles': IconProvider(require('../assets/images/icon-articles.png')),
    'articles-dark': IconProvider(require('../assets/images/icon-articles-dark.png')),
    'messaging': IconProvider(require('../assets/images/icon-messaging.png')),
    'messaging-dark': IconProvider(require('../assets/images/icon-messaging-dark.png')),
    'dashboards': IconProvider(require('../assets/images/icon-dashboards.png')),
    'dashboards-dark': IconProvider(require('../assets/images/icon-dashboards-dark.png')),
    'ecommerce': IconProvider(require('../assets/images/icon-ecommerce.png')),
    'ecommerce-dark': IconProvider(require('../assets/images/icon-ecommerce-dark.png')),
    'autocomplete': IconProvider(require('../assets/images/icon-autocomplete.png')),
    'autocomplete-dark': IconProvider(require('../assets/images/icon-autocomplete-dark.png')),
    'avatar': IconProvider(require('../assets/images/icon-avatar.png')),
    'avatar-dark': IconProvider(require('../assets/images/icon-avatar-dark.png')),
    'bottom-navigation': IconProvider(require('../assets/images/icon-bottom-navigation.png')),
    'bottom-navigation-dark': IconProvider(require(
      '../assets/images/icon-bottom-navigation-dark.png')),
    'button': IconProvider(require('../assets/images/icon-button.png')),
    'button-dark': IconProvider(require('../assets/images/icon-button-dark.png')),
    'button-group': IconProvider(require('../assets/images/icon-button-group.png')),
    'button-group-dark': IconProvider(require('../assets/images/icon-button-group-dark.png')),
    'calendar': IconProvider(require('../assets/images/icon-calendar.png')),
    'calendar-dark': IconProvider(require('../assets/images/icon-calendar-dark.png')),
    'check-box': IconProvider(require('../assets/images/icon-checkbox.png')),
    'check-box-dark': IconProvider(require('../assets/images/icon-checkbox-dark.png')),
    'datepicker': IconProvider(require('../assets/images/icon-datepicker.png')),
    'datepicker-dark': IconProvider(require('../assets/images/icon-datepicker-dark.png')),
    'icon': IconProvider(require('../assets/images/icon-icon.png')),
    'icon-dark': IconProvider(require('../assets/images/icon-icon-dark.png')),
    'input': IconProvider(require('../assets/images/icon-input.png')),
    'input-dark': IconProvider(require('../assets/images/icon-input-dark.png')),
    'list': IconProvider(require('../assets/images/icon-list.png')),
    'list-dark': IconProvider(require('../assets/images/icon-list-dark.png')),
    'menu': IconProvider(require('../assets/images/icon-menu.png')),
    'menu-dark': IconProvider(require('../assets/images/icon-menu-dark.png')),
    'radio': IconProvider(require('../assets/images/icon-radio.png')),
    'radio-dark': IconProvider(require('../assets/images/icon-radio-dark.png')),
    'select': IconProvider(require('../assets/images/icon-select.png')),
    'select-dark': IconProvider(require('../assets/images/icon-select-dark.png')),
    'spinner': IconProvider(require('../assets/images/icon-spinner.png')),
    'spinner-dark': IconProvider(require('../assets/images/icon-spinner-dark.png')),
    'tab-view': IconProvider(require('../assets/images/icon-tab-view.png')),
    'tab-view-dark': IconProvider(require('../assets/images/icon-tab-view-dark.png')),
    'text': IconProvider(require('../assets/images/icon-text.png')),
    'text-dark': IconProvider(require('../assets/images/icon-text-dark.png')),
    'toggle': IconProvider(require('../assets/images/icon-toggle.png')),
    'toggle-dark': IconProvider(require('../assets/images/icon-toggle-dark.png')),
    'tooltip': IconProvider(require('../assets/images/icon-tooltip.png')),
    'tooltip-dark': IconProvider(require('../assets/images/icon-tooltip-dark.png')),
    'top-navigation': IconProvider(require('../assets/images/icon-top-navigation.png')),
    'top-navigation-dark': IconProvider(require('../assets/images/icon-top-navigation-dark.png')),
    */
  },
};
