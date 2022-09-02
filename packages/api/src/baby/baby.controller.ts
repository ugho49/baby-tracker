import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth';
import { BabyService } from './baby.service';
import {
  AddBabyRelationDto,
  BabyAuthority,
  BabyDto,
  BabyDtoWithRelations,
  BabyDtoWithUserAuthority,
  BabyRelationId,
  GetTimelineQueryDto,
  RegisterBabyDto,
} from '@baby-tracker/common-types';
import { HasBabyAuthorities } from './baby.guard';
import { REQUEST } from '@nestjs/core';

@ApiTags('baby')
@Controller('baby')
export class BabyController {
  constructor(private readonly babyService: BabyService, @Inject(REQUEST) private request: Request) {}

  @Get('/:babyId')
  @HasBabyAuthorities()
  @ApiOperation({ summary: 'Find baby by id' })
  async findById(@Param('babyId') babyId: string): Promise<BabyDtoWithRelations> {
    return this.babyService.findById(babyId);
  }

  @Get()
  @ApiOperation({ summary: 'Find all my babies' })
  async findAll(@AuthUser('userId') userId: string): Promise<BabyDtoWithUserAuthority[]> {
    return this.babyService.findAllByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new Baby' })
  async register(@AuthUser('userId') userId: string, @Body() dto: RegisterBabyDto): Promise<BabyDto> {
    return this.babyService.createBaby({ userId, dto }).then((entity) => entity.toDto());
  }

  @Post('/:babyId/relation')
  @HasBabyAuthorities([BabyAuthority.ROLE_ADMIN])
  @ApiOperation({ summary: 'Add new baby relation' })
  async addRelation(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddBabyRelationDto,
    @Req() request: any
  ): Promise<BabyRelationId> {
    const relationId = await this.babyService.addRelation({ babyId, dto });
    return { relation_id: relationId };
  }

  @Put('/:babyId/relation/:relationId')
  @HasBabyAuthorities([BabyAuthority.ROLE_ADMIN])
  @ApiOperation({ summary: 'Update baby relation' })
  async updateRelation(
    @Param('babyId') babyId: string,
    @Param('relationId') relationId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddBabyRelationDto // TODO change this
  ) {
    // TODO
  }

  @Delete('/:babyId/relation/:relationId')
  @HasBabyAuthorities([BabyAuthority.ROLE_ADMIN])
  @ApiOperation({ summary: 'Delete baby relation' })
  async deleteRelation(
    @Param('babyId') babyId: string,
    @Param('relationId') relationId: string,
    @AuthUser('userId') userId: string
  ) {
    // TODO
  }

  @Put('/:babyId')
  @HasBabyAuthorities([BabyAuthority.ROLE_ADMIN])
  @ApiOperation({ summary: 'Update baby' })
  async update(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddBabyRelationDto // TODO change this
  ) {
    // TODO
  }

  @Delete('/:babyId')
  @HasBabyAuthorities([BabyAuthority.ROLE_ADMIN])
  @ApiOperation({ summary: 'Remove baby' })
  async remove(@Param('babyId') babyId: string, @AuthUser('userId') userId: string) {
    // TODO
  }

  @Get('/:babyId/timeline')
  @HasBabyAuthorities()
  @ApiOperation({ summary: 'Get timeline' })
  async getTimeline(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Query() queryParams: GetTimelineQueryDto
  ) {
    // TODO
  }

  @Post('/:babyId/timeline')
  @HasBabyAuthorities([BabyAuthority.ROLE_WRITE_USER])
  @ApiOperation({ summary: 'Add new baby timeline entry' })
  async createTimelineEntry(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddBabyRelationDto // TODO change this
  ) {
    // TODO
  }

  @Put('/:babyId/timeline/:timelineId')
  @HasBabyAuthorities([BabyAuthority.ROLE_WRITE_USER])
  @ApiOperation({ summary: 'Update timeline entry' })
  async updateTimelineEntry(
    @Param('babyId') babyId: string,
    @Param('timelineId') timelineId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddBabyRelationDto // TODO change this
  ) {
    // TODO
  }

  @Delete('/:babyId/timeline/:timelineId')
  @HasBabyAuthorities([BabyAuthority.ROLE_WRITE_USER])
  @ApiOperation({ summary: 'Delete timeline entry' })
  async deleteTimelineEntry(
    @Param('babyId') babyId: string,
    @Param('timelineId') timelineId: string,
    @AuthUser('userId') userId: string
  ) {
    // TODO
  }
}
