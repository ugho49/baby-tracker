import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserEntity } from './user.entity';

export class UserDto {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: Date;
  updated_at: Date;

  static fromEntity(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      firstname: entity.firstname,
      lastname: entity.lastname,
      email: entity.email,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
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
