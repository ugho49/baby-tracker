import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth';
import { BabyService } from './baby.service';
import {
  AddBabyRelationDto,
  BabyAuthority,
  BabyDto,
  BabyDtoWithRelations,
  BabyDtoWithUserAuthority,
  RegisterBabyDto,
} from '@baby-tracker/common-types';
import { BabyEntity } from './baby.entity';

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
  async register(@AuthUser('userId') userId: string, @Body() registerBabyDto: RegisterBabyDto): Promise<BabyDto> {
    const authority = BabyAuthority.ROLE_ADMIN;
    const babyEntity = BabyEntity.create({
      firstname: registerBabyDto.firstname,
      lastname: registerBabyDto.lastname,
      gender: registerBabyDto.gender,
      birthDate: registerBabyDto.birth_date,
      birthPlace: registerBabyDto.birth_place,
    });

    await this.babyService.create({ babyEntity, authority, userId, role: registerBabyDto.relation_role });

    return babyEntity.toDto();
  }

  @Post('/:babyId/relation')
  @ApiOperation({ summary: 'Add new baby relation' })
  async addRelation(
    @Param('babyId') babyId: string,
    @AuthUser('userId') userId: string,
    @Body() dto: AddBabyRelationDto
  ) {
    await this.babyService.addRelation({ babyId, userId, dto });
  }

  @Delete('/:babyId/relation/:userId')
  @ApiOperation({ summary: 'Delete baby relation' })
  async deleteRelation(@Param('babyId') babyId: string, @Param('userId') userId: string) {
    // TODO
  }

  @Put('/:babyId')
  @ApiOperation({ summary: 'Update baby' })
  async update(@Param('babyId') babyId: string, @AuthUser('userId') userId: string) {
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
    @Query('day') day?: string,
    @Query('type') type?: string
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
