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
      const _transactios = await this.customerRepository
        .createQueryBuilder('customer')
        .innerJoinAndSelect('customer.redemptions', 'redemption')
        .where('customer.nit = :nit', { nit })
        .getRawMany();
      return {
        data: {
          transactions: _transactios,
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
