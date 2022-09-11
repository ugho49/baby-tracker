import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthUser, Public } from '../auth';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto, UserDto } from '@baby-tracker/common-types';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user infos' })
  async getInfos(@AuthUser('userId') id: string): Promise<UserDto> {
    return this.userService.findById(id);
  }

  @Public()
  @ApiOperation({ summary: 'Register a User' })
  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<UserDto> {
    return this.userService.save(dto);
  }
}
