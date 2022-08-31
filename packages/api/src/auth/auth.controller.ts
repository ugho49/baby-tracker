import { Controller, Get } from '@nestjs/common';
import { Public } from './metadata/public.metadata';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get() // Change to post
  @Public()
  login() {
    return this.authService.login({ username: 'ugho.stephan', password: 'helloworld' });
  }
}
