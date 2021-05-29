import React from 'react';
import { MenuItem } from '../../model/menu-item.model';

export interface LayoutData extends MenuItem {
  route: string;
}

export class Compliant {

  constructor(readonly idContent: string,
              readonly contentType: string,
              readonly title: string,
              readonly description: string,
              readonly insertDate: string,
              readonly sharePosition: boolean,
              readonly positionLatitude: number,
              readonly positionLongitude: number,
              readonly shareName: boolean,
              ) {
  }

}
