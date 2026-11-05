export interface OAuthIdentity {
  subject: string;
  email: string;
}

/** Verifies a third-party identity token. Rejects when the token is invalid. */
export interface OAuthVerifier {
  verify(token: string): Promise<OAuthIdentity>;
}
