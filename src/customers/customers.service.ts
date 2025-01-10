import { Injectable } from '@nestjs/common';
import { ServiceInterface } from '../commons/service-interface.commons';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CustomerPoints } from './entities/customer-points.entity';

@Injectable()
export class CustomersService {
  private queryRunner: QueryRunner;
  public constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerPoints)
    private readonly customerPointsrepository: Repository<CustomerPoints>,
  ) {}
  /**
   * @description Metodo encargado de guardar la información de los clientes junto con su puntaje inicial
   * @param nit
   * @param name
   * @param points
   * @returns error o data
   */
  public async create(
    nit: string,
    name: string,
    points: number,
  ): Promise<ServiceInterface> {
    this.queryRunner =
      this.customerRepository.manager.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const newCustomer = this.queryRunner.manager.create(Customer, {
        nit,
        name,
      });

      const savedCustomer = await this.queryRunner.manager.save(newCustomer);
      const savedCustomerPoints = await this.saveCustomerPoints(
        this.queryRunner,
        savedCustomer.id,
        points,
      );
      await this.queryRunner.commitTransaction();
      return {
        data: {
          savedCustomer,
          savedCustomerPoints,
        },
      };
    } catch (error) {
      if (this.queryRunner.isTransactionActive) {
        await this.queryRunner.rollbackTransaction();
      }
      return {
        data: error.message,
        error: true,
      };
    } finally {
      await this.queryRunner.release();
    }
  }

  private async saveCustomerPoints(
    queryRunner: QueryRunner,
    customerId: number,
    points: number,
  ): Promise<CustomerPoints> {
    const newCustomerPoints = queryRunner.manager.create(CustomerPoints, {
      customer_id: customerId,
      points: points,
    });

    const savedCustomerPoints = await queryRunner.manager.save(
      newCustomerPoints,
    );

    return savedCustomerPoints;
  }

  findAll() {
    return `This action returns all customers`;
  }
  /**
   * @description Metodo encargado de buscar cliente por el nit proporcionado
   * @param nit
   * @returns data, error o null
   */
  public async findOne(nit: string): Promise<ServiceInterface> {
    try {
      const customerFound = await this.customerRepository.findOne({
        where: { nit },
      });

      return {
        data: customerFound,
      };
    } catch (error) {
      return {
        error: true,
        data: error.message,
      };
    }
  }

  public async findPointsByCustomerId(
    customerId: number,
  ): Promise<ServiceInterface> {
    try {
      const customerPoints = await this.customerPointsrepository.findOne({
        where: { customer_id: customerId },
      });

      return {
        data: customerPoints,
      };
    } catch (error) {
      return {
        error: true,
        data: error.message,
      };
    }
  }

  public async updatePoints(
    id: number,
    totalPoints: number,
  ): Promise<ServiceInterface> {
    try {
      const customerPoints = await this.customerPointsrepository.update(id, {
        points: totalPoints,
      });
      return {
        data: {
          customerPoints,
          id,
          totalPoints,
        },
      };
    } catch (error) {
      return {
        error: true,
        data: error.message,
      };
    }
  }

  public async findPointsByCustomer(nit: string): Promise<ServiceInterface> {
    try {
      const _pointsByCustomer = await this.customerRepository
        .createQueryBuilder('customer')
        .leftJoinAndSelect('customer.customerPoints', 'customerPoints')
        .select([
          'customer.id as id',
          'customer.name as name',
          'customer.nit as nit',
          'customerPoints.points as total_points',
        ])
        .where('customer.nit = :nit', { nit })
        .getRawOne();
      return {
        data: _pointsByCustomer,
      };
    } catch (error) {
      return {
        error: true,
        data: error.message,
      };
    }
  }
}
