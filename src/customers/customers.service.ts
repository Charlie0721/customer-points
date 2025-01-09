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

   private queryRunner: QueryRunner
  public constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerPoints)
    private readonly customerPointsrepository: Repository<CustomerPoints>,
  ) {}
  public async create(
    nit: string,
    name: string,
    points: number,
  ): Promise<ServiceInterface> {
    try {
      
      return {
        data: {
          nit,
          name,
          points,
        },
      };
    } catch (error) {
      return {
        data: error.message,
        error: true,
      };
    }
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
