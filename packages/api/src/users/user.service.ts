import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  findById(id: string): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ email });
  }

  async save(user: UserEntity): Promise<UserEntity> {
    try {
      return await this.usersRepository.save(user);
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
