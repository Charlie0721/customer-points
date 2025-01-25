import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
          { name: 'expiration_date', type: 'date', isNullable: true }, // Nuevo campo para vigencia
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

    // Crear tabla customer_points_kardex
    await queryRunner.createTable(
      new Table({
        name: 'customer_points_kardex',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'customer_id', type: 'int' },
          { name: 'previous_points', type: 'int' },  
          { name: 'new_points', type: 'int' },        
          { name: 'difference', type: 'int' },        
          { name: 'reason', type: 'varchar', length: '255' }, 
          { name: 'transaction_type', type: 'enum', enum: ['acquisition', 'redemption'] }, 
          { name: 'expiration_date', type: 'date', isNullable: true }, 
          { name: 'created_at', type: 'timestamp', default: 'now()' }, 
        ],
      }),
    );

    // Agregar clave foránea para customer_id en customer_points_kardex
    await queryRunner.createForeignKey(
      'customer_points_kardex',
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la tabla customer_points_kardex
    const table = await queryRunner.getTable('customer_points_kardex');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('customer_id') !== -1);
    await queryRunner.dropForeignKey('customer_points_kardex', foreignKey);

    await queryRunner.dropTable('customer_points_kardex');
    await queryRunner.dropTable('redemptions');
    await queryRunner.dropTable('customer_points');
    await queryRunner.dropTable('customers');
  }
}
