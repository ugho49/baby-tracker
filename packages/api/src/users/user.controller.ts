import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthUser, PasswordManager, Public } from '../auth';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { RegisterDto, UserDto } from './user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getInfos(@AuthUser('userId') id: string) {
    return UserDto.fromEntity(await this.userService.findById(id));
  }

  @Public()
  @ApiOperation({ summary: 'Register a User' })
  @ApiOkResponse({ type: UserDto })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserDto> {
    const entity = await this.userService.save(
      UserEntity.create({
        email: registerDto.email,
        firstname: registerDto.firstname,
        lastname: registerDto.lastname,
        passwordEnc: await PasswordManager.hash(registerDto.password),
      })
    );

    return UserDto.fromEntity(entity);
  }
}
