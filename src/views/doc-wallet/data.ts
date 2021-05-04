import React from 'react';
 import { ImageStyle, ImageSourcePropType } from 'react-native';
 import { ThemedIcon } from '../../components/themed-icon.component';
 import {
  AssetTakePhotoDarkIcon,
  AssetTakePhotoIcon,
  AssetPhotoLibraryDarkIcon,
  AssetPhotoLibraryIcon,
} from '../../components/icons';
import { MenuItem } from '../../model/menu-item.model';
import I18n from './../../i18n/i18n';

export interface LayoutData extends MenuItem {
  route: string;
}

export const data: LayoutData[] = [
  {
    title: I18n.t('Take Photo'), // 'Take Photo',
    route: 'TakePhoto',
    icon: (style: ImageStyle) => {
      return React.createElement(
        ThemedIcon,
        { ...style, light: AssetTakePhotoIcon, dark: AssetTakePhotoDarkIcon },
      );
    },
  },
  {
    title: I18n.t('From Library'), // 'From Library',
    route: 'LibraryPhoto',
    icon: (style: ImageStyle) => {
      return React.createElement(
        ThemedIcon,
        { ...style, light: AssetPhotoLibraryIcon, dark: AssetPhotoLibraryDarkIcon },
      );
    },
  },
];
