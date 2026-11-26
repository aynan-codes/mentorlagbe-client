import { authClient } from "@/lib/auth-client";

export type UserRole = "student" | "tutor";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  division: string;
}

interface GoogleSignInOptions {
  role?: UserRole;
  division?: string;
}

// Email Sign In
export const signInWithEmail = async ({
  email,
  password,
}: SignInPayload) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Failed to sign in.");
  }

  return data;
};

// Email Sign Up
export const signUpWithEmail = async ({
  name,
  email,
  password,
  role,
  division,
}: SignUpPayload) => {
  const { data, error } = await authClient.signUp.email({
    name,
    email,
    password,
    accountType: role,
    division,
  } as Parameters<typeof authClient.signUp.email>[0]);

  if (error) {
    throw new Error(error.message || "Failed to create account.");
  }

  return data;
};

// Google Sign In / Sign Up
export const signInWithGoogle = async (
  _options?: GoogleSignInOptions
) => {
  const frontendURL = window.location.origin;
  const completeProfileURL = `${frontendURL}/complete-profile`;

  const { data, error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: completeProfileURL,
    newUserCallbackURL: completeProfileURL,
    errorCallbackURL: completeProfileURL,
  });

  if (error) {
    throw new Error(error.message || "Google sign in failed.");
  }

  return data;
};

// Sign Out
export const signOutUser = async () => {
  const { error } = await authClient.signOut();

  if (error) {
    throw new Error(error.message || "Failed to sign out.");
  }
};