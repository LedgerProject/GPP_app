const REGULAR_EXPRESSION = /\W/gi;
const EMPTY_STRING = '';
const DEFAULT_USER = 'user';
import zenroom from './zenroom-client';
/*
  This function is using zenroom to encrypt a given string with the password
*/
export function sanitizeAnswers(answers: any) {
  for (const key in answers) {
    if (answers[key]) {
      answers[key] = answers[key]
        .replace(REGULAR_EXPRESSION, EMPTY_STRING)
        .toLowerCase();
    }
  }
  return answers;
}

export async function recoveryKeypair(
  clientSideContractText: string,
  answers: any,
  PBKDF: string,
) {
  const keys = {
    userChallenges: answers,
    username: DEFAULT_USER,
    key_derivation: PBKDF,
  };

  const data = {};

  const jsonKeys = JSON.stringify(keys);
  const jsonData = JSON.stringify(data);

  let response = '';
    while (!response) {
      response = await zenroom.execute(
        clientSideContractText,
        jsonKeys,
        jsonData,
      );
    }
    return response;
}

export async function verifyAnswers(
  clientSideContractText: string,
  answers: any,
  PBKDF: string,
  userPublicKey: string,
) {
  const execution = await recoveryKeypair(
    clientSideContractText,
    answers,
    PBKDF,
  );
  return userPublicKey === execution[DEFAULT_USER].keypair.public_key;
}
