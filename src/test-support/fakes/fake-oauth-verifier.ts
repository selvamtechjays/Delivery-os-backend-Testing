import type { OAuthIdentity, OAuthVerifier } from '../../ports';

/** Scripted verifier: only tokens registered with accept() verify. */
export class FakeOAuthVerifier implements OAuthVerifier {
  private readonly identities = new Map<string, OAuthIdentity>();

  accept(token: string, identity: OAuthIdentity): void {
    this.identities.set(token, identity);
  }

  verify(token: string): Promise<OAuthIdentity> {
    const identity = this.identities.get(token);
    return identity
      ? Promise.resolve(identity)
      : Promise.reject(new Error('FakeOAuthVerifier: invalid token'));
  }
}
