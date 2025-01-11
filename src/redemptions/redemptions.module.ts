import { Module } from '@nestjs/common';
import { RedemptionsService } from './redemptions.service';
import { RedemptionsController } from './redemptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { Redemptions } from './entities/redemption.entity';
import { CreatePointsRedemptionUseCase } from './use-cases/create-redemptions.use-case';
import { FindCustomerUseCase } from '../customers/use-cases/find-customer.use-case';
import { CustomersModule } from '../customers/customers.module';
import { TransactionsHistoryUseCase } from './use-cases/get-transactions-history.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Redemptions]), CustomersModule],
  controllers: [RedemptionsController],
  providers: [
    RedemptionsService,
    CreatePointsRedemptionUseCase,
    FindCustomerUseCase,
    TransactionsHistoryUseCase,
  ],
})
export class RedemptionsModule {}
