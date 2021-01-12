import React from 'react';
import { ImageStyle } from 'react-native';
import { ThemedIcon } from '../../components/themed-icon.component';
import {
  AssetDocWalletDarkIcon,
  AssetDocWalletIcon,
  AssetStructuresDarkIcon,
  AssetStructuresIcon,
  AssetSocialDarkIcon,
  AssetSocialIcon,
  AssetNewPostIcon,
  AssetNewPostDarkIcon,
} from '../../components/icons';
import { MenuItem } from '../../model/menu-item.model';

export interface LayoutData extends MenuItem {
  route: string;
}

export const data: LayoutData[] = [
  {
    title: 'DocWallet',
    route: 'DocWallet',
    icon: (style: ImageStyle) => {
      return React.createElement(
        ThemedIcon,
        { ...style, light: AssetDocWalletIcon, dark: AssetDocWalletDarkIcon },
      );
    },
  },
  {
    title: 'Where I Am',
    route: 'Structures',
    icon: (style: ImageStyle) => {
      return React.createElement(
        ThemedIcon,
        { ...style, light: AssetStructuresIcon, dark: AssetStructuresDarkIcon },
      );
    },
  },
  {
    title: 'Social',
    route: 'Social',
    icon: (style: ImageStyle) => {
      return React.createElement(
        ThemedIcon,
        { ...style, light: AssetSocialIcon, dark: AssetSocialDarkIcon },
      );
    },
  },
  {
    title: 'New Post',
    route: 'NewPost',
    icon: (style: ImageStyle) => {
      return React.createElement(
        ThemedIcon,
        { ...style, light: AssetNewPostIcon, dark: AssetNewPostDarkIcon },
      );
    },
  },
];
