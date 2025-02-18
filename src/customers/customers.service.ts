import { Injectable } from '@nestjs/common';
import { ServiceInterface } from '../commons/service-interface.commons';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CustomerPoints } from './entities/customer-points.entity';
import { CustomerPointsKardex } from './entities/customer-points-kardex';

@Injectable()
export class CustomersService {
  private queryRunner: QueryRunner;
  public constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerPoints)
    private readonly customerPointsRepository: Repository<CustomerPoints>,
    @InjectRepository(CustomerPointsKardex)
    private readonly customerPointsKardexRepository: Repository<CustomerPointsKardex>,
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
    expirationDays: number,
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
        expirationDays,
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
  /**
   * @description Metodo privado encargado de guardar los puntos por clientes
   * @param queryRunner
   * @param customerId
   * @param points
   * @returns {CustomerPoints}
   */
  private async saveCustomerPoints(
    queryRunner: QueryRunner,
    customerId: number,
    points: number,
    expirationDays: number,
  ): Promise<CustomerPoints> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    
    const newCustomerPoints = queryRunner.manager.create(CustomerPoints, {
      customer_id: customerId,
      points: points,
      expiration_date: expirationDate,
    });

    const savedCustomerPoints = await queryRunner.manager.save(
      newCustomerPoints,
    );

    return savedCustomerPoints;
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
  /**
   * @description Metodo que busca los puntos por id
   * @param customerId
   * @returns error o data
   */
  public async findPointsByCustomerId(
    customerId: number,
  ): Promise<ServiceInterface> {
    try {
      const customerPoints = await this.customerPointsRepository.findOne({
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
  /**
   * @description Metodo encargado de actualizar los puntos por cliente
   * @param id
   * @param totalPoints
   * @returns errro o data
   */
  public async updatePoints(
    id: number,
    totalPoints: number,
    expirationDate: Date,
  ): Promise<ServiceInterface> {
    try {
      const customerPoints = await this.customerPointsRepository.update(id, {
        points: totalPoints,
        expiration_date: expirationDate,
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
  /**
   * @description Metodo encargado de buscar por nit de cliente, la cantidad de puntos que posee
   * @param nit
   * @returns error o data
   */
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
  /**
   * @description Metodo encargado de insetar datos en la tabla de kardex cuando se crea o actualiza cliente
   * @param kardexEntry
   * @returns
   */
  public async createKardex(
    kardexEntry: Partial<CustomerPointsKardex>,
  ): Promise<CustomerPointsKardex> {
    const newKardexEntry =
      this.customerPointsKardexRepository.create(kardexEntry);
    return this.customerPointsKardexRepository.save(newKardexEntry);
  }
 
}
