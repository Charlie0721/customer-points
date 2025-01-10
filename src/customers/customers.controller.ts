import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';
import { FindCustomerUseCase } from './use-cases/find-customer.use-case';
import { UpdatePointsUseCase } from './use-cases/update-customer-points.use-case';
@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerUseCase: FindCustomerUseCase,
    private readonly updatePointsUseCase: UpdatePointsUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear clientes y/o actualizar puntos si ya existe',
  })
  @ApiBody({
    description: 'Crear clientes, puntaje inicial o actualizar puntaje ',
    type: CreateCustomerDto,
  })
  public async create(
    @Res() response: Response,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    const { nit, name, points } = createCustomerDto;
    const normalizedNit = nit.trim();
    const {
      data: customer,
      message: customer_message,
      errors: errors1,
      success: success1,
    } = await this.findCustomerUseCase.main(normalizedNit);
    if (customer_message === 'Cliente encontrado exitosamente') {
      const { success, data, message, errors } =
        await this.updatePointsUseCase.main(customer.id, points);
      if (success) {
        return response.status(HttpStatus.OK).send({ success, data, message });
      } else {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .send({ success, message, errors });
      }
    }
    if (customer === null) {
      const { success, data, message, errors } =
        await this.createCustomerUseCase.main(nit, name, points);
      if (success) {
        return response
          .status(HttpStatus.CREATED)
          .send({ success, data, message });
      } else {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .send({ success, message, errors });
      }
    }
  }

  @Get()
  findAll() {
    //return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //return this.customersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    //return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    //return this.customersService.remove(+id);
  }
}
