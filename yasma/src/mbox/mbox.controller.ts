import {Body, Controller, Get, Param, Post, Req, UnauthorizedException} from '@nestjs/common';
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
    if (!req['userContext'] || !req['userContext']['uuid']) {
      throw new UnauthorizedException();
    }
    const uuid = req['userContext']['uuid'];
    const email = req['userContext']['email'];
    return await this.mboxService.mboxListLabels(uuid, email);
  }

  @Get('/messages/:MBOX')
  async getMboxMessages(
    @Param('MBOX') mbox: string,
    @Req() req: Request,
  ): Promise<string> {
    if (!req['userContext'] || !req['userContext']['uuid']) {
      throw new UnauthorizedException();
    }
    const uuid = req['userContext']['uuid'];
    return await this.mboxService.mboxListMessages(uuid, mbox);
  }

  @Post('/message')
  async newMboxMessages(
    @Body() sendMessageDto: SendMessageDto,
    @Req() req: Request,
  ): Promise<ResultApi> {
    if (!req['userContext'] || !req['userContext']['uuid']) {
      throw new UnauthorizedException();
    }
    const uuid = req['userContext']['uuid'];
    return await this.mboxService.mboxNewMessage(uuid, sendMessageDto);
  }

  @Get('/message/:messageId')
  async getMboxMessage(
    @Param('messageId') messageId: string,
    @Req() req: Request,
  ): Promise<Message> {
    if (!req['userContext'] || !req['userContext']['uuid']) {
      throw new UnauthorizedException();
    }
    const uuid = req['userContext']['uuid'];
    return await this.mboxService.mboxGetMessage(uuid, messageId);
  }
}
