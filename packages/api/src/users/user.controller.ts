import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthUser, PasswordManager, Public } from '../auth';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto, UserDto } from '@baby-tracker/common-types';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getInfos(@AuthUser('userId') id: string): Promise<UserDto> {
    return this.userService.findById(id).then((entity) => entity.toDto());
  }

  @Public()
  @ApiOperation({ summary: 'Register a User' })
  @ApiOkResponse({ type: UserDto })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserDto> {
    return this.userService
      .save(
        UserEntity.create({
          email: registerDto.email,
          firstname: registerDto.firstname,
          lastname: registerDto.lastname,
          passwordEnc: await PasswordManager.hash(registerDto.password),
        })
      )
      .then((entity) => entity.toDto());
  }
}
