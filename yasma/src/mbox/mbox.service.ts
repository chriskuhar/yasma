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

interface messagesOptions {
  userId: string;
  maxResults: number;
  labelIds: [string];
  pageToken?: string;
}

@Injectable()
export class MboxService {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Lists the labels in the user's account.
   *
   */
  async mboxListLabels(token: string, email: string): Promise<string | null> {
    try {
      // access_token = auth.credentials.access_token
      const auth: OAuth2Client =
        await this.authService.loadSavedCredentialsIfExist(token, email);

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
  async mboxListMessages(token: string, mbox: string, pageToken: string): Promise<string | null> {
    try {
      const auth: OAuth2Client =
        await this.authService.loadSavedCredentialsIfExist(token);
      const gmail = google.gmail('v1');
      google.options({ auth });
      const messageOptions: messagesOptions = {
        userId: 'me',
        maxResults: 15,
        labelIds: [mbox],
      };
      if(pageToken) {
        messageOptions.pageToken = pageToken;
      }
      const res = await gmail.users.messages.list(messageOptions);
      const messages = res.data?.messages;
      const nextPageToken = res.data?.nextPageToken;
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
        const readLabel = res.data?.labelIds.find(e => e === 'UNREAD') ? false : true;
        const headers = res?.data?.payload?.headers;
        let metaData = {};
        if (headers && headers.length > 0) {
          metaData = {};
          metaData['Read'] = readLabel;
          metaData['MessageID'] = message.id;
          for (const header of headers) {
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
      const payload = {
        messages: result,
        nextPageToken: nextPageToken,
      };
      return JSON.stringify(payload);
    } catch (error) {
      const message: string =
        error?.message || 'Unknown error listing messages';
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
      // mark message read
      await this.mboxMessageMarkRead(token, messageID);
      // return message
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
      const result = await this.sendMessage(auth, assembledMessage);
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
          process.stdout.write(`${error.message} ${new Error().stack}`);
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
      const { messageText, decodedMessage } = this.extractTextFromMessage(message.message);

      const mail = new MailComposer({
        from: loggedInUserEmail,
        sender: loggedInUserEmail,
        reply: loggedInUserEmail,
        to: message.recipient,
        subject: message.subject,
        text: messageText,
        html: decodedMessage,
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
    let decodedMessage: string = '';
    if(!messageB64) {
      return null;
    }
    try {
      decodedMessage = Buffer.from(messageB64, 'base64').toString('utf-8');
      messageText = new JSDOM(
        decodedMessage,
      ).window.document.body.textContent.trim();
      messageTextLen =
        messageText && messageText.length ? messageText.length : 0;
    } catch (error) {
      process.stdout.write(`${JSON.stringify(error)} ${new Error().stack}`);
    }
    return { messageText, messageTextLen, decodedMessage };
  }

  getNowDateRFC2822() {
    const now = new Date();
    return format(now, "EEE, dd MMM yyyy HH:mm:ss xxxx");
  }

  async mboxMessageMarkRead(token: string, messageID: string): Promise<ResultApi> {
    try {
      const auth: OAuth2Client =
        await this.authService.loadSavedCredentialsIfExist(token);
      const gmail = google.gmail('v1');
      google.options({ auth });
      const res = await gmail.users.messages.modify({
        userId: 'me',
        id: messageID,
        requestBody: {
          removeLabelIds: ['UNREAD'],
        },
      });
      const response: ResultApi = {};
      if (res.status === 200) {
        response.message = `Message marked read successfully.`;
      } else {
        response.error = `Error marking message read.`;
      }
      return response;
    } catch (error) {
      // TODO need to deal with error cases
      const message: string =
        error.response?.data?.error_description ||
        'Unknown error marking message read';
      process.stdout.write(`${message} ${new Error().stack}`);
      throw new UnauthorizedException(message);
    }
  }

  async mboxMessageDelete(token: string, messageID: string): Promise<ResultApi> {
    try {
      const auth: OAuth2Client =
        await this.authService.loadSavedCredentialsIfExist(token);
      const gmail = google.gmail('v1');
      google.options({ auth });
      const res = await gmail.users.messages.delete({
        userId: 'me',
        id: messageID,
      });
      const response: ResultApi = {};
      if (res.status === 204) {
        response.message = `Message deleted successfully.`;
      } else {
        response.error = `Error deleting Message.`;
      }
      return response;
    } catch (error) {
      // TODO need to deal with error cases
      const message: string =
        error.response?.data?.error_description ||
        'Unknown error deleting message';
      process.stdout.write(`${message} ${new Error().stack}`);
      throw new UnauthorizedException(message);
    }
  }
}
