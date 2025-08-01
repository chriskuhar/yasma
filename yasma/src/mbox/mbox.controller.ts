import {Body, Controller, Get, Param, Post, Req, Query, UnauthorizedException, Patch, Delete} from '@nestjs/common';
import { MboxService } from "./mbox.service";
import { Message } from '../types/message';
import { SendMessageDto } from './mbox.dto';
import {GetAttachment, ResultApi} from '../types/mbox';
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

  @Get('/messages')
  async getMboxMessages(
    @Query('mbox') mbox: string,
    @Query('nextPageToken') nextPageToken: string,
    @Req() req: Request,
  ): Promise<string> {
    if (!req['userContext'] || !req['userContext']['uuid']) {
      throw new UnauthorizedException();
    }
    const uuid = req['userContext']['uuid'];
    return await this.mboxService.mboxListMessages(uuid, mbox, nextPageToken);
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

  @Get('/message/:messageId/:attachmentId')
  async getMboxMessageAttachment(
    @Param('messageId') messageId: string,
    @Param('attachmentId') attachmentId: string,
    @Req() req: Request,
  ): Promise<GetAttachment> {
    if (!req['userContext'] || !req['userContext']['uuid']) {
      throw new UnauthorizedException();
    }
    const uuid = req['userContext']['uuid'];
    return await this.mboxService.mboxGetMessageAttachment(
      uuid,
      messageId,
      attachmentId,
    );
  }

  @Patch('/message/:messageId')
  async patchMboxMessageRead(
    @Param('messageId') messageId: string,
    @Req() req: Request,
  ): Promise<ResultApi> {
    if (!req['userContext'] || !req['userContext']['uuid']) {
      throw new UnauthorizedException();
    }
    const uuid = req['userContext']['uuid'];
    return await this.mboxService.mboxMessageMarkRead(uuid, messageId);
  }

  @Delete('/message/:messageId')
  async deleteMboxMessageDelete(
    @Param('messageId') messageId: string,
    @Req() req: Request,
  ): Promise<ResultApi> {
    if (!req['userContext'] || !req['userContext']['uuid']) {
      throw new UnauthorizedException();
    }
    const uuid = req['userContext']['uuid'];
    return await this.mboxService.mboxMessageDelete(uuid, messageId);
  }
}
