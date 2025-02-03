import {BadRequestException, HttpException, Injectable, Req, UnauthorizedException} from '@nestjs/common';
import { google } from 'googleapis';
import { AuthService } from '../auth/auth.service';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class MboxService {
  constructor(private readonly authService: AuthService) {}

  /**
   * Lists the labels in the user's account.
   *
   */
  async mboxListLabels(token: string): Promise<string | null> {
    try {
      const auth: OAuth2Client =
        await this.authService.loadSavedCredentialsIfExist(token);
      const gmail = google.gmail({ version: 'v1', auth });
      const res = await gmail.users.labels.list({
        userId: 'me',
      });
      const labels = res.data.labels;
      if (!labels || labels.length === 0) {
        console.log('No labels found.');
        return;
      }
      return JSON.stringify(labels);
    } catch (err) {
      const message: string = err.response?.data?.error_description || 'Unknown error listing mailbox';
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
      const gmail = google.gmail({ version: 'v1', auth });
      const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
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
          for (let header of headers) {
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
    } catch (err) {
      const message: string = err.response?.data?.error_description || 'Unknown error listing messages';
      throw new UnauthorizedException(message);
    }
  }

  /**
   * Get mailbox message
   *
   */
  async mboxGetMessage(token: string, messageID: string): Promise<string | null> {
    try {
      const auth: OAuth2Client =
        await this.authService.loadSavedCredentialsIfExist(token);
      const gmail = google.gmail({ version: 'v1', auth });
      const res = await gmail.users.messages.get({
        userId: 'me',
        id: messageID,
        format: 'full',
      });
      const payload = res?.data?.payload;
      return JSON.stringify(payload);
    } catch (err) {
      const message: string = err.response?.data?.error_description || 'Unknown error listing mailbox';
      throw new UnauthorizedException(message);
    }
  }
}
