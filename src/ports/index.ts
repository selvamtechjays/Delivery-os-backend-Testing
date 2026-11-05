import type { Clock } from './clock';
import type { Mailer } from './mailer';
import type { OAuthVerifier } from './oauth-verifier';
import type { Storage } from './storage';

export type { Clock } from './clock';
export type { MailMessage, Mailer } from './mailer';
export type { OAuthIdentity, OAuthVerifier } from './oauth-verifier';
export type { Storage } from './storage';

/** External dependencies the app talks to. All optional until adapters exist. */
export interface AppDeps {
  mailer?: Mailer;
  clock?: Clock;
  oauthVerifier?: OAuthVerifier;
  storage?: Storage;
}
