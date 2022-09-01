import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../user/user.entity';
import { PasswordManager } from '../util/password-manager';
import { AuthenticationDto } from '@baby-tracker/common-types';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async login(user: { email: string; password: string }): Promise<AuthenticationDto> {
    const userEntity = await this.validateUser(user.email, user.password);
    const payload = { email: user.email, sub: userEntity.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await PasswordManager.verify(user.passwordEnc, password))) {
      return user;
    }
    throw new UnauthorizedException('Incorrect login');
  }
}
