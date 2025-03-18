"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomerPointsTable1677881234568 = void 0;
const typeorm_1 = require("typeorm");
class CreateCustomerPointsTable1677881234568 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'customers',
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'nit', type: 'varchar', isUnique: true },
                { name: 'name', type: 'varchar' },
                { name: 'created_at', type: 'timestamp', default: 'now()' },
                { name: 'updated_at', type: 'timestamp', default: 'now()' },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'customer_points',
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'customer_id', type: 'int' },
                { name: 'points', type: 'int' },
                { name: 'expiration_date', type: 'date', isNullable: false },
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
        }));
        await queryRunner.createTable(new typeorm_1.Table({
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
        }));
        await queryRunner.createTable(new typeorm_1.Table({
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
        }));
        await queryRunner.createForeignKey('customer_points_kardex', new typeorm_1.TableForeignKey({
            columnNames: ['customer_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'customers',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('customer_points_kardex');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('customer_id') !== -1);
        await queryRunner.dropForeignKey('customer_points_kardex', foreignKey);
        await queryRunner.dropTable('customer_points_kardex');
        await queryRunner.dropTable('redemptions');
        await queryRunner.dropTable('customer_points');
        await queryRunner.dropTable('customers');
    }
}
exports.CreateCustomerPointsTable1677881234568 = CreateCustomerPointsTable1677881234568;
//# sourceMappingURL=12345678.migrations.js.map