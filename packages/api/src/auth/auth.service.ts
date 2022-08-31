import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async login(user: { username: string; password: string }) {
    await this.validateUser(user.username, user.password);
    const payload = { username: user.username, sub: 'id1', roles: ['USER'] };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(username: string, password: string): Promise<any> {
    // TODO type to userEntity
    // const user = await this.usersService.findOne(username);
    // if (user && user.password === password) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    return null;
    // TODO Throw if null
  }
}
