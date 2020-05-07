import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from 'typeorm';

export default class CreateTransactions1588795827122
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'numeric',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'category_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
    // KF Categories
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'FK_TRAXCAT',
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL', // RESTRICT, SET NULL, CASCADE
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'FK_TRAXCAT');
    await queryRunner.dropTable('transactions');
  }
}
