import { IsEmail, IsNotEmpty } from 'class-validator';
import { Authentication, Login } from '@baby-tracker/common-types';

export class AuthenticationDto implements Authentication {
  access_token: string;
}

export class LoginDto implements Login {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
