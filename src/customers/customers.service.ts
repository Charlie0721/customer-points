import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ServiceInterface } from 'src/commons/service-interface.commons';
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

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
