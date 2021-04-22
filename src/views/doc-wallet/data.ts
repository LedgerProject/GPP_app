import React from "react";
import { ImageStyle, ImageSourcePropType } from "react-native";
import { ThemedIcon } from "../../components/themed-icon.component";
import {
  AssetTakePhotoDarkIcon,
  AssetTakePhotoIcon,
  AssetPhotoLibraryDarkIcon,
  AssetPhotoLibraryIcon,
} from "../../components/icons";
import { MenuItem } from "../../model/menu-item.model";
import I18n from "./../../i18n/i18n";

export interface LayoutData extends MenuItem {
  route: string;
}

export const data: LayoutData[] = [
  {
    title: I18n.t("Take Photo"), // 'Take Photo',
    route: "TakePhoto",
    icon: (style: ImageStyle) => {
      return React.createElement(ThemedIcon, {
        ...style,
        light: AssetTakePhotoIcon,
        dark: AssetTakePhotoDarkIcon,
      });
    },
  },
  {
    title: I18n.t("From Library"), // 'From Library',
    route: "LibraryPhoto",
    icon: (style: ImageStyle) => {
      return React.createElement(ThemedIcon, {
        ...style,
        light: AssetPhotoLibraryIcon,
        dark: AssetPhotoLibraryDarkIcon,
      });
    },
  },
];

export class Document {
  constructor(
    readonly idDocument: string,
    readonly title: string,
    readonly size: string,
    readonly mimeType: string,
    public isChecked: boolean
  ) {}
  // readonly image: ImageSourcePropType


  /*get formattedSize(): string {
    return `$${this.size}`;
  }*/

  /*  static passportDocument(): Document {
    return new Document(
      1,
      'Passport',
      '1.7 Mbytes',
      require('../../assets/images/icon-pdf.png'),
    );
  }

  static idDocument(): Document {
    return new Document(
      2,
      'Document ID',
      '0.6 Mbytes',
      require('../../assets/images/icon-image.png'),
    );
  }

  static vaccinationPage1(): Document {
    return new Document(
      3,
      'Vaccination Page 1',
      '0.7 Mbytes',
      require('../../assets/images/icon-image.png'),
    );
  }

  static vaccinationPage2(): Document {
    return new Document(
      4,
      'Vaccination Page 2',
      '0.7 Mbytes',
      require('../../assets/images/icon-image.png'),
    );
  }

  static testDoc1(): Document {
    return new Document(
      5,
      'Test Doc 1',
      '0.9 Mbytes',
      require('../../assets/images/icon-pdf.png'),
    );
  }

  static testDoc2(): Document {
    return new Document(
      6,
      'Test Doc 2',
      '1.2 Mbytes',
      require('../../assets/images/icon-pdf.png'),
    );
  }*/
}
