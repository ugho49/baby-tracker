import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticationDto {
  access_token: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
