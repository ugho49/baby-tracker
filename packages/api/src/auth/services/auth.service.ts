import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../users/user.entity';
import { PasswordManager } from '../password-manager';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async login(user: { email: string; password: string }) {
    const userEntity = await this.validateUser(user.email, user.password);
    const payload = { email: user.email, sub: userEntity.id }; // add roles
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
