import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth';
import { BabyService } from './baby.service';
import {
  AddBabyRelationDto,
  BabyDto,
  BabyDtoWithRelations,
  BabyDtoWithUserAuthority,
  BabyRelationId,
  RegisterBabyDto,
} from '@baby-tracker/common-types';

@ApiTags('baby')
@Controller('baby')
export class BabyController {
  constructor(private readonly babyService: BabyService) {}

  @Get('/:babyId')
  @ApiOperation({ summary: 'Find baby by id' })
  async findById(@Param('babyId') babyId: string, @AuthUser('userId') userId: string): Promise<BabyDtoWithRelations> {
    return this.babyService.findById(babyId, userId);
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
  @ApiOperation({ summary: 'Add new baby relation' })
  async addRelation(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddBabyRelationDto
  ): Promise<BabyRelationId> {
    const relationId = await this.babyService.addRelation({ babyId, userId, dto });
    return { relation_id: relationId };
  }

  @Put('/:babyId/relation/:relationId')
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
  @ApiOperation({ summary: 'Delete baby relation' })
  async deleteRelation(
    @Param('babyId') babyId: string,
    @Param('relationId') relationId: string,
    @AuthUser('userId') userId: string
  ) {
    // TODO
  }

  @Put('/:babyId')
  @ApiOperation({ summary: 'Update baby' })
  async update(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddBabyRelationDto // TODO change this
  ) {
    // TODO
  }

  @Delete('/:babyId')
  @ApiOperation({ summary: 'Remove baby' })
  async remove(@Param('babyId') babyId: string, @AuthUser('userId') userId: string) {
    // TODO
  }

  @Get('/:babyId/timeline')
  @ApiOperation({ summary: 'Get timeline' })
  async getTimeline(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Query('day') day: string,
    @Query('type') type: string
  ) {
    // TODO
  }

  @Post('/:babyId/timeline')
  @ApiOperation({ summary: 'Add new baby timeline entry' })
  async createTimelineEntry(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddBabyRelationDto // TODO change this
  ) {
    // TODO
  }

  @Put('/:babyId/timeline/:timelineId')
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
  @ApiOperation({ summary: 'Delete timeline entry' })
  async deleteTimelineEntry(
    @Param('babyId') babyId: string,
    @Param('timelineId') timelineId: string,
    @AuthUser('userId') userId: string
  ) {
    // TODO
  }
}
