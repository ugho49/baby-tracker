import { Controller, Get, Post } from '@nestjs/common';
import { Public } from './metadata/public.metadata';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  login() {
    return this.authService.login({ email: 'test@test.fr', password: 'helloworld' });
  }
}
