import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastname: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;
}
