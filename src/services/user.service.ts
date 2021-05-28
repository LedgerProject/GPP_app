// Axios import
import axios from 'axios';

// Locale import
import I18n from '../i18n/i18n';

// Environment import
import { AppOptions } from './app-env';

interface PBKBFPublicKeyResponse {
  code: string;
  message: string;
  pbkdf: string;
  publicKey: string;
}

// Given the user e-mail, return the PBKDF and Public Key from the database
export const getPBKDFPublicKey = async (email: string): Promise<PBKBFPublicKeyResponse> => {
  const postParams = {
    email: email,
  };

  let userPBKDFPublicKeyResponse: PBKBFPublicKeyResponse = {
    code: '0',
    message: '',
    pbkdf: '',
    publicKey: '',
  };

  await axios
    .post<PBKBFPublicKeyResponse>(AppOptions.getServerUrl() + 'users/get-pbkdf-publickey', postParams, { timeout: 30000 })
    .then(function (response) {
      userPBKDFPublicKeyResponse = response.data.pbkdfPublicKeyResponse;
    })
    .catch(function (err) {
      userPBKDFPublicKeyResponse = {
        code: '10',
        message: I18n.t('An error has occurred, please try again'),
        pbkdf: '',
        publicKey: '',
      };
    });

  return userPBKDFPublicKeyResponse;
};
