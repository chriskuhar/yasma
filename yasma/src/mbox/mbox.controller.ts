import {Controller, Get, Param, Post, Req} from '@nestjs/common';
import { MboxService } from "./mbox.service";

@Controller('/api/mbox')
export class MboxController {
  constructor(private readonly mboxService: MboxService) {}

  @Get('/list')
  async getMboxList(
      @Req() req: Request,
  ): Promise<string> {
    const authHeader: string = req.headers['authorization'];
    const bits: string[] = authHeader.split(' ');
    let token: string | null = null;
    if (bits.length > 1) {
      token = bits[1];
    }
    return await this.mboxService.mboxListLabels(token);
  }

  @Get('/messages/:MBOX')
  async getMboxMessages(
    @Param('MBOX') mbox: string,
    @Req() req: Request,
  ): Promise<string> {
    const authHeader: string = req.headers['authorization'];
    const bits: string[] = authHeader.split(' ');
    let token: string | null = null;
    if (bits.length > 1) {
      token = bits[1];
    }
    return await this.mboxService.mboxListMessages(token, mbox);
  }

  @Get('/message/:messageId')
  async getMboxMessage(
    @Param('messageId') messageId: string,
    @Req() req: Request,
  ): Promise<string> {
    const authHeader: string = req.headers['authorization'];
    const bits: string[] = authHeader.split(' ');
    let token: string | null = null;
    if (bits.length > 1) {
      token = bits[1];
    }
    return await this.mboxService.mboxGetMessage(token, messageId);
  }
}
