import { Body, Controller, Post } from '@nestjs/common';
import { Public } from './metadata/public.metadata';
import { AuthService } from './service/auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationDto, LoginDto } from '@baby-tracker/common-types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Get a access token' })
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthenticationDto> {
    return this.authService.login(dto);
  }
}
