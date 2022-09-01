import { Controller, Post } from '@nestjs/common';
import { PasswordManager, Public } from '../auth';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @Public()
  async register() {
    // TODO
    return this.userService.save(
      UserEntity.create({
        email: 'test@test.fr',
        firstname: 'Test',
        lastname: 'TEST',
        passwordEnc: await PasswordManager.hash('helloworld'),
      })
    );
  }
}
