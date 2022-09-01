import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TimestampEntity, uuid } from '../database';
import { UserDto } from '@baby-tracker/common-types';

@Entity('user')
export class UserEntity extends TimestampEntity {
  @PrimaryColumn()
  id: string = uuid();

  @Column()
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  passwordEnc: string;

  @Column()
  isActive: boolean = true;

  public static create(props: { email: string; firstname: string; lastname: string; passwordEnc: string }): UserEntity {
    const entity = new UserEntity();
    entity.email = props.email;
    entity.firstname = props.firstname;
    entity.lastname = props.lastname;
    entity.passwordEnc = props.passwordEnc;
    return entity;
  }

  public toDto(): UserDto {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
