import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddVerfiyEmailAttribute1748327634698 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
          'users',
          new TableColumn({
            name: 'isVerified',
            type: 'boolean',
            isNullable: false,
            default: false,
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'isVerified');
      }

}