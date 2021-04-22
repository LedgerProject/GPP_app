const REGULAR_EXPRESSION = /\W/gi;
const EMPTY_STRING = "";
const DEFAULT_USER = "user";
import zenroom from "../api/zenroom-client";
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
  PBKDF: string
) {
  const keys = {
    userChallenges: answers,
    username: DEFAULT_USER,
    key_derivation: PBKDF,
  };

  const data = {};

  try {
    const response = await zenroom.execute(
      clientSideContractText,
      JSON.stringify(keys),
      JSON.stringify(data)
    );
    return JSON.parse(response);
  } catch (e) {
    console.error(e);
  }
}

export async function verifyAnswers(
  clientSideContractText: string,
  answers: any,
  PBKDF: string,
  userPublicKey: string
) {
  const execution = await recoveryKeypair(
    clientSideContractText,
    answers,
    PBKDF
  );
  return userPublicKey === execution[DEFAULT_USER].keypair.public_key;
}
