import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';
@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Crear clientes y puntos' })
  @ApiBody({
    description: 'Crear clientes y puntaje inicial',
    type: CreateCustomerDto,
  })
  public async create(
    @Res() response: Response,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    const { name, nit, points } = createCustomerDto;
    const { success, data, message, errors } =
      await this.createCustomerUseCase.main(name, nit, points);
    if (success) {
      response.status(201).send({ success, data, message });
    } else {
      response.status(400).send({ success, message, errors });
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
