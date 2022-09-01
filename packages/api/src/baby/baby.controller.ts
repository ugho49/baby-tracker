import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth';
import { BabyService } from './baby.service';
import {
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

  @Get(':id')
  @ApiOperation({ summary: 'Find baby by id' })
  async findById(@Param('id') babyId: string, @AuthUser('userId') userId: string): Promise<BabyDtoWithRelations> {
    return this.babyService.findById(babyId, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Find all my babies' })
  async findAll(@AuthUser('userId') userId: string): Promise<BabyDtoWithUserAuthority[]> {
    return this.babyService.findAllByUserId(userId);
  }
}
