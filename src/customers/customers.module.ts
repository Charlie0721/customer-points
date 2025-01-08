import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerPoints } from './entities/customer-points.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Customer,CustomerPoints])
  ],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule {}
