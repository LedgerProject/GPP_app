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

  const jsonKeys = JSON.stringify(keys);

  let response = '';
  let numAttempts = 0;

  while (!response && numAttempts < 5) {
    response = await zenroom.execute(
      clientSideContractText,
      null,
      jsonKeys,
    );

    console.log(response);

    numAttempts++;
  }

  if (response && numAttempts < 5) {
    return JSON.parse(response);
  } else {
    return false;
  }
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

  if (execution) {
    return userPublicKey === execution[DEFAULT_USER].keypair.public_key;
  } else {
    return null;
  }
}
