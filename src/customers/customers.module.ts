import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerPoints } from './entities/customer-points.entity';
import { Redemptions } from '../redemptions/entities/redemption.entity';
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';

@Module({
  imports:[
    TypeOrmModule.forFeature([Customer,CustomerPoints,Redemptions])
  ],
  controllers: [CustomersController],
  providers: [CustomersService,CreateCustomerUseCase]
})
export class CustomersModule {}
