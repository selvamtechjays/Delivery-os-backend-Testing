import type { MailMessage, Mailer } from '../../ports';

/** Records sent mail; can be told to fail the next N sends. */
export class FakeMailer implements Mailer {
  readonly sent: MailMessage[] = [];
  private failuresRemaining = 0;

  failNext(times: number): void {
    this.failuresRemaining = times;
  }

  send(message: MailMessage): Promise<void> {
    if (this.failuresRemaining > 0) {
      this.failuresRemaining -= 1;
      return Promise.reject(new Error('FakeMailer: simulated send failure'));
    }
    this.sent.push(message);
    return Promise.resolve();
  }
}
