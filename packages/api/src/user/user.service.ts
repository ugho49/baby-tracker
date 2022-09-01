import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  findById(id: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }

  findByIds(ids: string[]): Promise<UserEntity[]> {
    return this.userRepository.findBy({ id: In(ids) });
  }

  findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ email });
  }

  async save(user: UserEntity): Promise<UserEntity> {
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
