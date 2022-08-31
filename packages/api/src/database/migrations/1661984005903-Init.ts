import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1661984005903 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user"
      (
          id                  UUID,
          email               VARCHAR(200)   NOT NULL,
          first_name          VARCHAR(50)    NOT NULL,
          last_name           VARCHAR(50)    NOT NULL,
          password_enc        VARCHAR(500),
          is_enabled          BOOLEAN        NOT NULL DEFAULT TRUE,
          authorities         VARCHAR(100)[] NOT NULL DEFAULT ARRAY ['ROLE_USER'],
          created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
          updated_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
          PRIMARY KEY (id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
