import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MboxService } from "./mbox.service";
import { Message } from '../types/message';
import { SendMessageDto } from './mbox.dto';
import { ResultApi } from '../types/mbox';
import { JwtService } from '@nestjs/jwt';

@Controller('/api/mbox')
export class MboxController {
  constructor(
    private readonly mboxService: MboxService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/list')
  async getMboxList(
      @Req() req: Request,
  ): Promise<string> {
    const authHeader: string = req.headers['authorization'];
    const bits: string[] = authHeader.split(' ');
    let jwt: string | null = null;
    if (bits.length > 1) {
      jwt = bits[1];
    }
    const jwtDecoded = this.jwtService.decode(jwt);
    const uuid = jwtDecoded.uuid;
    return await this.mboxService.mboxListLabels(uuid);
  }

  @Get('/messages/:MBOX')
  async getMboxMessages(
    @Param('MBOX') mbox: string,
    @Req() req: Request,
  ): Promise<string> {
    const authHeader: string = req.headers['authorization'];
    const bits: string[] = authHeader.split(' ');
    let jwt: string | null = null;
    if (bits.length > 1) {
      jwt = bits[1];
    }
    const jwtDecoded = this.jwtService.decode(jwt);
    const uuid = jwtDecoded.uuid;
    return await this.mboxService.mboxListMessages(uuid, mbox);
  }

  @Post('/message')
  async newMboxMessages(
    @Body() sendMessageDto: SendMessageDto,
    @Req() req: Request,
  ): Promise<ResultApi> {
    const authHeader: string = req.headers['authorization'];
    const bits: string[] = authHeader.split(' ');
    let jwt: string | null = null;
    if (bits.length > 1) {
      jwt = bits[1];
    }
    const jwtDecoded = this.jwtService.decode(jwt);
    const uuid = jwtDecoded.uuid;
    return await this.mboxService.mboxNewMessage(uuid, sendMessageDto);
  }

  @Get('/message/:messageId')
  async getMboxMessage(
    @Param('messageId') messageId: string,
    @Req() req: Request,
  ): Promise<Message> {
    const authHeader: string = req.headers['authorization'];
    const bits: string[] = authHeader.split(' ');
    let jwt: string | null = null;
    if (bits.length > 1) {
      jwt = bits[1];
    }
    const jwtDecoded = this.jwtService.decode(jwt);
    const uuid = jwtDecoded.uuid;
    return await this.mboxService.mboxGetMessage(uuid, messageId);
  }
}
