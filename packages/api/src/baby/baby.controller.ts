import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../auth';
import { BabyService } from './baby.service';
import { BabyAuthority, BabyDto, RegisterBabyDto } from '@baby-tracker/common-types';
import { BabyEntity } from './baby.entity';

@ApiTags('baby')
@Controller('baby')
export class BabyController {
  constructor(private readonly babyService: BabyService) {}

  @ApiOperation({ summary: 'Register a new Baby' })
  @Post()
  async register(@AuthUser('userId') userId: string, @Body() registerBabyDto: RegisterBabyDto): Promise<BabyDto> {
    const authority = BabyAuthority.ROLE_ADMIN;
    const babyEntity = BabyEntity.create({
      firstname: registerBabyDto.firstname,
      lastname: registerBabyDto.lastname,
      gender: registerBabyDto.gender,
      birthDate: registerBabyDto.birth_date,
      birthPlace: registerBabyDto.birth_place,
    });

    await this.babyService.create({ babyEntity, authority, userId });

    return babyEntity.toDto();
  }
}
