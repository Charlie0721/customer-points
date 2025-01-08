import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCustomerPointsTable1677881234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla customers
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'nit', type: 'varchar', isUnique: true },
          { name: 'name', type: 'varchar' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    // Crear tabla customer_points
    await queryRunner.createTable(
      new Table({
        name: 'customer_points',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'customer_id', type: 'int' },
          { name: 'points', type: 'int' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          {
            columnNames: ['customer_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'customers',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // Crear tabla redemptions
    await queryRunner.createTable(
      new Table({
        name: 'redemptions',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'customer_id', type: 'int' },
          { name: 'points', type: 'int' },
          { name: 'redeemed_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          {
            columnNames: ['customer_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'customers',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('redemptions');
    await queryRunner.dropTable('customer_points');
    await queryRunner.dropTable('customers');
  }
}
