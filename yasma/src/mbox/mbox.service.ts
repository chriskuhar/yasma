import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import { google } from 'googleapis';
import { AuthService } from '../auth/auth.service';
import { OAuth2Client, GlobalOptions } from 'googleapis-common';
import {Header, Message, MessageAsciiText, MimePart} from '../types/message';
import {MessageSendApi, ResultApi} from '../types/mbox';
import { JSDOM } from 'jsdom';
import { format } from 'date-fns';
import { RedisService } from '../redis/redis.service';
//import MailComposer from 'nodemailer/lib/mail-composer';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const MailComposer = require('nodemailer/lib/mail-composer');

@Injectable()
export class MboxService {
  constructor(private readonly authService: AuthService, private readonly redisService: RedisService) {}

  /**
   * Lists the labels in the user's account.
   *
   */
  async mboxListLabels(token: string): Promise<string | null> {
    try {
      // access_token = auth.credentials.access_token
      const auth: OAuth2Client =
        await this.authService.loadSavedCredentialsIfExist(token);

      const gmail = google.gmail('v1');
      google.options({ auth });
      const res = await gmail.users.labels.list({
        userId: 'me',
      });
      const labels = res.data.labels;
      if (!labels || labels.length === 0) {
        console.log('No labels found.');
        return;
      }
      return JSON.stringify(labels);
    } catch (error) {
      const message: string = error.message || 'Unknown error listing mailbox';
      process.stdout.write(`${message} ${new Error().stack}`);
      process.stdout.write(`Library Stack: ${error.stack}`);
      throw new UnauthorizedException(message);
    }
  }

  /**
   * Lists the messages in the user's mailbox.
   *
   */
  async mboxListMessages(token: string, mbox: string): Promise<string | null> {
    try {
      const auth: OAuth2Client =
        await this.authService.loadSavedCredentialsIfExist(token);
      const gmail = google.gmail('v1');
      google.options({ auth });
      const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 15,
        labelIds: [mbox],
      });
      const messages = res.data.messages;
      if (!messages || messages.length === 0) {
        console.log('No messages found.');
        return;
      }
      const result = [];
      for (const message of messages) {
        const res = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'metadata',
        });
        const headers = res?.data?.payload?.headers;
        let metaData = {};
        if (headers && headers.length > 0) {
          metaData = {};
          metaData['MessageID'] = message.id;
          for (const header of headers) {
            console.log(header.name);
            switch (header.name) {
              case 'Subject':
                metaData['Subject'] = header.value;
                break;
              case 'To':
                metaData['To'] = header.value;
                break;
              case 'From':
                metaData['From'] = header.value;
                break;
              case 'Date':
                metaData['DateTime'] = header.value;
                break;
              case 'Reply-To':
                metaData['ReplyTo'] = header.value;
                break;
            }
          }
        }
        result.push(metaData);
      }
      return JSON.stringify(result);
    } catch (error) {
      const message: string = error?.message || 'Unknown error listing messages';
      process.stdout.write(`${message} ${new Error().stack}`);
      process.stdout.write(`Library Stack: ${error.stack}`);
      throw new UnauthorizedException(message);
    }
  }

  /**
   * Get mailbox message
   *
   */
  async mboxGetMessage(token: string, messageID: string): Promise<Message | null> {
    try {
      const auth: OAuth2Client =
        await this.authService.loadSavedCredentialsIfExist(token);
      const gmail = google.gmail('v1');
      google.options({ auth });
      const res = await gmail.users.messages.get({
        userId: 'me',
        id: messageID,
        format: 'full',
      });
      return res?.data?.payload as Message;
    } catch (error) {
      // TODO need to deal with error cases
      const message: string =
        error.response?.data?.error_description ||
        'Unknown error listing mailbox';
      process.stdout.write(`${message} ${new Error().stack}`);
      throw new UnauthorizedException(message);
    }
  }

  /**
   * Send new message
   *
   */
  async mboxNewMessage(
    token: string,
    message: MessageSendApi,
  ): Promise<ResultApi> {
    try {
      const auth: OAuth2Client =
        await this.authService.loadSavedCredentialsIfExist(token);

      const assembledMessage = await this.assembleSendMessage(token, message);
      const result = this.sendMessage(auth, assembledMessage);
      if(result) {
        return {
          message: 'Success',
        };
      } else {
        return {
          error: 'Problem sending message',
        };
      }
    } catch (error) {
      const message: string =
        error.response?.data?.error_description ||
        'Unknown error listing mailbox';
      process.stdout.write(`${message} ${new Error().stack}`);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async sendMessage(auth: OAuth2Client, assembledMessage: string) {
    return new Promise(async (resolve, reject) => {
      const encodedAssembledMessage =
        Buffer.from(assembledMessage).toString('base64');
      const gmail = google.gmail('v1');
      google.options({ auth });
      gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: encodedAssembledMessage,
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          process.stdout.write(`${error} ${new Error().stack}`);
          reject(error);
        });
    });
  }

  async assembleSendMessage(token: string, message: MessageSendApi): Promise<string> {
    let assembledMessage: string = '';
    try {
      // get email address from session
      const loggedInUserEmail = await this.redisService.getLoggedInUserEmail(token);
      if (!loggedInUserEmail) {
        throw new HttpException('email required', HttpStatus.BAD_REQUEST);
      }
      //const headers: Header[] = this.assembleHeaders(message);
      const { messageText } = this.extractTextFromMessage(message.message);

      const mail = new MailComposer({
        from: loggedInUserEmail,
        sender: loggedInUserEmail,
        reply: loggedInUserEmail,
        to: message.recipient,
        subject: message.subject,
        text: messageText,
        html: message.message,
        headers: this.assembleHeaders(),
      });
      assembledMessage = await mail.compile().build();
      process.stdout.write(assembledMessage);
    } catch (error) {
      process.stdout.write(`${error.message} ${new Error().stack}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return assembledMessage;
  }

  assembleHeaders(): Header[] {
    return [
      {
        key: 'X-YASMA',
        value: '1234-werwe-234234-werwer',
      },
    ];
  }

  extractTextFromMessage(messageB64: string): MessageAsciiText | null {
    let messageText: string = '';
    let messageTextLen: number = 0;
    if(!messageB64) {
      return null;
    }
    try {
      const decodedString: string = Buffer.from(messageB64, 'base64').toString('utf-8');
      messageText = new JSDOM(
        decodedString,
      ).window.document.body.textContent.trim();
      messageTextLen =
        messageText && messageText.length ? messageText.length : 0;
    } catch (error) {
      process.stdout.write(`${JSON.stringify(error)} ${new Error().stack}`);
    }
    return { messageText, messageTextLen };
  }

  getNowDateRFC2822() {
    const now = new Date();
    return format(now, "EEE, dd MMM yyyy HH:mm:ss xxxx");
  }
}
