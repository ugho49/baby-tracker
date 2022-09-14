import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth';
import { BabyService } from './baby.service';
import {
  AddBabyRelationDto,
  AddOrUpdateTimelineEntryDto,
  BabyDto,
  BabyRelationIdDto,
  BabyTimelineDto,
  BabyWithRelationsDto,
  BabyWithUserAuthorityDto,
  GetTimelineQueryDto,
  RegisterBabyDto,
  UpdateBabyDto,
  UpdateBabyRelationDto,
} from './baby.dto';
import { HasBabyAuthorities } from './baby.guard';
import { BabyAuthority } from '@baby-tracker/common-types';

@ApiTags('baby')
@Controller('baby')
export class BabyController {
  constructor(private readonly babyService: BabyService) {}

  @Get('/:babyId')
  @HasBabyAuthorities()
  @ApiOperation({ summary: 'Find baby by id' })
  async findById(@Param('babyId') babyId: string): Promise<BabyWithRelationsDto> {
    return this.babyService.findById(babyId);
  }

  @Get()
  @ApiOperation({ summary: 'Find all my babies' })
  async findAll(@AuthUser('userId') userId: string): Promise<BabyWithUserAuthorityDto[]> {
    return this.babyService.findAllByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new Baby' })
  async register(@AuthUser('userId') userId: string, @Body() dto: RegisterBabyDto): Promise<BabyDto> {
    return this.babyService.createBaby({ userId, dto });
  }

  @Post('/:babyId/relation')
  @HasBabyAuthorities([BabyAuthority.ROLE_ADMIN])
  @ApiOperation({ summary: 'Add new baby relation' })
  async addRelation(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddBabyRelationDto
  ): Promise<BabyRelationIdDto> {
    const relationId = await this.babyService.addRelation({ babyId, dto });
    return { relation_id: relationId };
  }

  @Patch('/:babyId/relation/:relationId')
  @HasBabyAuthorities([BabyAuthority.ROLE_ADMIN])
  @ApiOperation({ summary: 'Update baby relation' })
  async updateRelation(
    @Param('babyId') babyId: string,
    @Param('relationId') relationId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: UpdateBabyRelationDto
  ): Promise<void> {
    await this.babyService.updateRelation({ relationId, userId, babyId, dto });
  }

  @Delete('/:babyId/relation/:relationId')
  @HasBabyAuthorities([BabyAuthority.ROLE_ADMIN])
  @ApiOperation({ summary: 'Delete baby relation' })
  async deleteRelation(
    @Param('babyId') babyId: string,
    @Param('relationId') relationId: string,
    @AuthUser('userId') userId: string
  ): Promise<void> {
    await this.babyService.deleteRelation({ babyId, relationId, userId });
  }

  @Put('/:babyId')
  @HasBabyAuthorities([BabyAuthority.ROLE_ADMIN])
  @ApiOperation({ summary: 'Update baby' })
  async updateBaby(@Param('babyId') babyId: string, @Body() dto: UpdateBabyDto): Promise<BabyDto> {
    return this.babyService.updateBaby({ babyId, dto });
  }

  @Delete('/:babyId')
  @HasBabyAuthorities([BabyAuthority.ROLE_ADMIN])
  @ApiOperation({ summary: 'Remove baby' })
  async deleteBaby(@Param('babyId') babyId: string): Promise<void> {
    await this.babyService.deleteBaby(babyId);
  }

  @Get('/:babyId/timeline')
  @HasBabyAuthorities()
  @ApiOperation({ summary: 'Get timeline' })
  async getTimeline(
    @Param('babyId') babyId: string,
    @Query() queryParams: GetTimelineQueryDto
  ): Promise<BabyTimelineDto[]> {
    return this.babyService.getTimeline({ babyId, queryParams });
  }

  @Post('/:babyId/timeline')
  @HasBabyAuthorities([BabyAuthority.ROLE_WRITE_USER])
  @ApiOperation({ summary: 'Add new baby timeline entry' })
  async createTimelineEntry(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddOrUpdateTimelineEntryDto
  ): Promise<BabyTimelineDto> {
    return this.babyService.createTimelineEntry({ babyId, userId, dto });
  }

  @Put('/:babyId/timeline/:timelineId')
  @HasBabyAuthorities([BabyAuthority.ROLE_WRITE_USER])
  @ApiOperation({ summary: 'Update timeline entry' })
  async updateTimelineEntry(
    @Param('babyId') babyId: string,
    @Param('timelineId') timelineId: string,
    @Body() dto: AddOrUpdateTimelineEntryDto
  ): Promise<BabyTimelineDto> {
    return this.babyService.updateTimelineEntry({ timelineId, babyId, dto });
  }

  @Delete('/:babyId/timeline/:timelineId')
  @HasBabyAuthorities([BabyAuthority.ROLE_WRITE_USER])
  @ApiOperation({ summary: 'Delete timeline entry' })
  async deleteTimelineEntry(@Param('babyId') babyId: string, @Param('timelineId') timelineId: string): Promise<void> {
    await this.babyService.deleteTimelineEntry({ babyId, timelineId });
  }
}
