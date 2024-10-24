import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

// Uncomment these lines to use environment variables for User Pool ID and Client ID
const userPoolId = import.meta.env.VITE_COGNITO_USERPOOL_ID as string;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string;

// Check if User Pool ID and Client ID are defined
if (!userPoolId || !clientId) {
  throw new Error(
    "User Pool ID or Client ID is not defined in the environment variables."
  );
}

const poolData = {
  UserPoolId: userPoolId,
  ClientId: clientId,
};

const userPool = new CognitoUserPool(poolData);
let currentUser: CognitoUser | null = userPool.getCurrentUser();

export function getCurrentUser(): CognitoUser | null {
  return currentUser;
}

function getCognitoUser(username: string): CognitoUser {
  const userData = {
    Username: username,
    Pool: userPool,
  };
  return new CognitoUser(userData);
}

export async function getSession(): Promise<any> {
  if (!currentUser) {
    currentUser = userPool.getCurrentUser();
  }

  return new Promise((resolve, reject) => {
    currentUser?.getSession((err: Error, session: any) => {
      if (err) {
        reject(new Error(`Failed to get session: ${err.message}`));
      } else {
        resolve(session);
      }
    });
  });
}

export async function signUpUserWithEmail(
  email: string,
  password: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
    ];

    userPool.signUp(email, password, attributeList, [], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export async function verifyCode(username: string, code: string) {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUser(username);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(new Error(`Failed to confirm registration: ${err.message}`));
      } else {
        resolve(result);
      }
    });
  });
}

export async function signInWithEmail(
  username: string,
  password: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    currentUser = getCognitoUser(username);

    currentUser.authenticateUser(authenticationDetails, {
      onSuccess: (res) => {
        resolve(res);
      },
      onFailure: (err) => {
        reject(new Error(`Failed to sign in: ${err.message}`));
      },
    });
  });
}

export function signOut(): void {
  if (currentUser) {
    currentUser.signOut();
    currentUser = null; // Clear the current user reference
  }
}

export async function getAttributes(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    currentUser?.getUserAttributes((err, attributes) => {
      if (err) {
        reject(new Error(`Failed to get user attributes: ${err.message}`));
      } else {
        if (attributes) {
          resolve(attributes);
        }
      }
    });
  });
}

export async function setAttribute(attribute: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const attributeList = [new CognitoUserAttribute(attribute)];

    currentUser?.updateAttributes(attributeList, (err, res) => {
      if (err) {
        reject(new Error(`Failed to update attribute: ${err.message}`));
      } else {
        resolve(res);
      }
    });
  });
}

export async function sendCode(username: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUser(username);

    if (!cognitoUser) {
      reject(new Error(`Could not find user: ${username}`));
      return;
    }

    cognitoUser.forgotPassword({
      onSuccess: (res) => {
        resolve(res);
      },
      onFailure: (err) => {
        reject(new Error(`Failed to send code: ${err.message}`));
      },
    });
  });
}

export async function forgotPassword(
  username: string,
  code: string,
  password: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUser(username);

    if (!cognitoUser) {
      reject(new Error(`Could not find user: ${username}`));
      return;
    }

    cognitoUser.confirmPassword(code, password, {
      onSuccess: () => {
        resolve("Password updated");
      },
      onFailure: (err) => {
        reject(new Error(`Failed to confirm password: ${err.message}`));
      },
    });
  });
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    currentUser?.changePassword(oldPassword, newPassword, (err, res) => {
      if (err) {
        reject(new Error(`Failed to change password: ${err.message}`));
      } else {
        resolve(res);
      }
    });
  });
}
