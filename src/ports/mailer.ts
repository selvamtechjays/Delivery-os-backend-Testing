export interface MailMessage {
  to: string;
  subject: string;
  body: string;
}

/** Outbound email. The provider is undecided; only the port exists. */
export interface Mailer {
  send(message: MailMessage): Promise<void>;
}
