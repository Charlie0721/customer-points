import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';
import { FindCustomerUseCase } from './use-cases/find-customer.use-case';
import { UpdatePointsUseCase } from './use-cases/update-customer-points.use-case';
import { FindPointByCustomerUseCase } from './use-cases/find-points-by-customer.use-case';
@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerUseCase: FindCustomerUseCase,
    private readonly updatePointsUseCase: UpdatePointsUseCase,
    private readonly findPointByCustomerUseCase: FindPointByCustomerUseCase,
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

  @Get(':nit')
  @ApiOperation({
    summary: 'Consultar el total de puntos por cliente',
  })
  @ApiParam({
    name: 'nit',
    description: 'Nit del cliente',
    required: true,
  })
  public async findTotalPointsByCustomer(
    @Res() res: Response,
    @Param('nit') nit: string,
  ) {
    const { success, data, message, errors } =
      await this.findPointByCustomerUseCase.main(nit);
    if (message === 'Cliente encontrado exitosamente') {
      if (success) {
        return res.status(HttpStatus.OK).send({ success, data, message });
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ success, message, errors });
      }
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ success, message, errors });
    }
  }
}
