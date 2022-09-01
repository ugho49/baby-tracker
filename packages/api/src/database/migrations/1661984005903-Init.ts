import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1661984005903 implements MigrationInterface {
  public async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE "user"
      (
          id                  UUID,
          email               VARCHAR(200)   NOT NULL,
          firstname           VARCHAR(50)    NOT NULL,
          lastname            VARCHAR(50)    NOT NULL,
          password_enc        VARCHAR(500)   NOT NULL,
          is_active           BOOLEAN        NOT NULL DEFAULT TRUE,
          created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
          updated_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
          PRIMARY KEY (id)
      );

      CREATE UNIQUE INDEX user_email_unique_idx on "user" (LOWER(email));
    `);

    await runner.query(`
      CREATE TYPE baby_gender AS ENUM ('GIRL', 'BOY');

      CREATE TABLE baby
      (
          id                  UUID,
          first_name          VARCHAR(50)                       NOT NULL,
          last_name           VARCHAR(50)                       NOT NULL,
          birth_date          TIMESTAMP  WITHOUT TIME ZONE      NOT NULL DEFAULT NOW(),
          birth_place         VARCHAR(100),
          gender              baby_gender,
          created_at          TIMESTAMPTZ                       NOT NULL DEFAULT NOW(),
          updated_at          TIMESTAMPTZ                       NOT NULL DEFAULT NOW(),
          PRIMARY KEY (id)
      );
    `);

    await runner.query(`
      CREATE TABLE user_baby
      (
          user_id             UUID,
          baby_id             UUID,
          authorities         VARCHAR(100)[] NOT NULL DEFAULT ARRAY ['ROLE_USER'],
          created_at          TIMESTAMPTZ                       NOT NULL DEFAULT NOW(),
          updated_at          TIMESTAMPTZ                       NOT NULL DEFAULT NOW(),
          PRIMARY KEY (user_id, baby_id)
      )
    `);

    await runner.query(`
      CREATE TABLE baby_timeline
      (
          id                  UUID,
          baby_id             UUID                  NOT NULL,
          type                VARCHAR(100)          NOT NULL,
          details             JSONB,
          occurred_at         TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
          created_at          TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
          updated_at          TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
          PRIMARY KEY (id)
      );

      CREATE UNIQUE INDEX baby_timeline_baby_id_idx ON baby_timeline (baby_id);
    `);
  }

  public async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP TABLE baby_timeline`);
    await runner.query(`DROP TABLE user_baby`);
    await runner.query(`DROP TABLE baby`);
    await runner.query(`DROP TYPE baby_gender CASCADE`);
    await runner.query(`DROP TABLE "user"`);
  }
}
