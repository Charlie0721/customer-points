import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redemptions } from './entities/redemption.entity';
import { Repository } from 'typeorm';
import { ServiceInterface } from '../commons/service-interface.commons';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class RedemptionsService {
  public constructor(
    @InjectRepository(Redemptions)
    private readonly redemptionRepository: Repository<Redemptions>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}
  /**
   * @description Metodo encargado de insertar en la tabla redemption la data de los puntos cambiados
   * @param customerId
   * @param pointsToRedeem
   * @returns error o data
   */
  public async create(
    customerId: number,
    pointsToRedeem: number,
  ): Promise<ServiceInterface> {
    try {
      const newRedemption = this.redemptionRepository.create({
        customer_id: customerId,
        points: pointsToRedeem,
      });

      const _redeemed = await this.redemptionRepository.save(newRedemption);
      return {
        data: {
          redeemed: _redeemed,
        },
      };
    } catch (error) {
      return {
        error: true,
        data: error.message,
      };
    }
  }

  public async findTransactionsByCustomer(
    nit: string,
  ): Promise<ServiceInterface> {
    try {
      const _transactions = await this.customerRepository
        .createQueryBuilder('customer')
        .innerJoinAndSelect('customer.redemptions', 'redemption')
        .innerJoinAndSelect('customer.customerPoints', 'customerPoints')
        .select([
          'redemption.points',
          'redemption.redeemed_at',
          'customerPoints.points',
        ])
        .where('customer.nit = :nit', { nit })
        .orderBy('redemption.redeemed_at', 'ASC')
        .getRawMany();

      const transactionsWithLocalTime = _transactions.map((transaction) => {
        const utcDate = new Date(transaction.redemption_redeemed_at);

        const colombiaTimeOffset = -5 * 60;

        const localDate = new Date(
          utcDate.getTime() + colombiaTimeOffset * 60 * 1000,
        );

        const localDateString = localDate.toISOString(); 

        return {
          ...transaction,
          redemption_redeemed_at: localDateString, 
        };
      });

      return {
        data: {
          transactions: transactionsWithLocalTime,
        },
      };
    } catch (error) {
      return {
        error: true,
        data: error.message,
      };
    }
  }
}
