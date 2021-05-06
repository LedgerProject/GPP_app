// React Native import
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment import
import { AppOptions } from '../services/app-env';

// Locale import
import I18n from './../i18n/i18n';

// Axios
import axios from 'axios';

export interface Category {
  index: number;
  idCategory: string;
  alias: string;
  text: string;
}

export const getCategories = async (token: string): Promise<Category[]> => {
  let x = 0;
  const categoriesArray: Category[] = [];

  let lang = await AsyncStorage.getItem('lang');
  lang = lang.substring(0, 2);

  // Define relations
  const relations = `"include":[`
      + `{"relation": "categoryLanguage", "scope": {`
        + `"where": {"language": "` + lang + `"}`
      + `}}`
    + `]`;

  await axios
    .get(AppOptions.getServerUrl() + 'categories/?filter={' + relations + '}', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      const data: any = response.data;

      categoriesArray.push({
        index: x,
        idCategory: '',
        alias: '',
        text: I18n.t('Show All'),
      });

      data.map((category) => {
        x++;

        categoriesArray.push({
          index: x,
          idCategory: category.idCategory,
          alias: category.categoryLanguage[0].alias,
          text: category.categoryLanguage[0].category,
        });
      });
    })
    .catch(function () {});

  return categoriesArray;
};
