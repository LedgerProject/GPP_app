// Zenroom import
import zenroom from './zenroom-client';

const REGULAR_EXPRESSION = /\W/gi;
const EMPTY_STRING = '';
const DEFAULT_USER = 'user';

/*
  This function is using zenroom to encrypt a given string with the password
*/

// Sanitize answers
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

// Return Private Key and Public Key
export async function recoveryKeypair(clientSideContractText: string,  answers: any, PBKDF: string) {
  const keys = {
    userChallenges: answers,
    username: DEFAULT_USER,
    key_derivation: PBKDF,
  };

  const data = {};

  const jsonKeys = JSON.stringify(keys);
  const jsonData = JSON.stringify(data);

  let response = '';
let count = 0;
  while (!response) {  
    count++;
    console.log("start");
    response = await zenroom.execute(
      clientSideContractText,
      jsonKeys,
      jsonData
    );
    console.log(response);
    console.log("end");
  }

  return JSON.parse(response);
}

// Verify that the answers are correct
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
