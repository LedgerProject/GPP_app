// React import
import React from 'react';

// React Native import
import { ImageStyle } from 'react-native';

// UIKitten import
import { IconElement, IconProps } from '@ui-kitten/components';

// Theme import
import { ThemeContextValue, Theming } from '../services/theme.service';

export interface ThemedIconProps extends Omit<IconProps, 'name'> {
  light: (style: ImageStyle) => IconElement;
  dark: (style: ImageStyle) => IconElement;
}

export const ThemedIcon = (props: ThemedIconProps): React.ReactElement => {
  const themeContext: ThemeContextValue = React.useContext(Theming.ThemeContext);
  const { light, dark, ...iconProps } = props;

  return themeContext.isDarkMode() ? dark(iconProps) : light(iconProps);
};
