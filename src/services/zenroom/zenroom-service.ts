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

  const jsonKeys = '{\"userChallenges\":{\"question1\":\"LAquila\",\"question2\":\"C arl\",\"question3\":\"88 ggg\",\"question4\":\"null\",\"question5\":\"null\"},\"username\":\"user\",\"key_derivation\":\"qf3skXnPGFMrE28UJS7S8BdT8g==\"}'; //JSON.stringify(keys);
  const jsonData = '{}'; //JSON.stringify(data);

  let response = '';
  let noAttempts = 0;

  console.log("prima");

  while (!response && noAttempts < 3) {
    console.log("while");
    response = await zenroom.execute(
      clientSideContractText,
      jsonKeys,
      jsonData,
    );

    noAttempts++;
    console.log(response);
    console.log('Attemp no. ' + noAttempts);
    console.log('Response: ' + response);
  }

  if (response) {
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
    console.log("verifyAnswers");
  const execution = await recoveryKeypair(
    clientSideContractText,
    answers,
    PBKDF,
  );

  if (execution) {
    return userPublicKey === execution[DEFAULT_USER].keypair.public_key;
  } else {
    return undefined;
  }
}
