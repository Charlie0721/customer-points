import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { CreatePointsRedemptionUseCase } from './use-cases/create-redemptions.use-case';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FindCustomerUseCase } from '../customers/use-cases/find-customer.use-case';
import { TransactionsHistoryUseCase } from './use-cases/get-transactions-history.use-case';
@ApiTags('Redemptions')
@Controller('redemptions')
export class RedemptionsController {
  public constructor(
    private readonly createPointsRedemptionUseCase: CreatePointsRedemptionUseCase,
    private readonly findCustomerUseCase: FindCustomerUseCase,
    private readonly transactionsHistoryUseCase: TransactionsHistoryUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Endpoint encargado de redimir los puntos por cliente',
  })
  @ApiBody({
    description: 'Endpoint encargado de redimir los puntos por cliente',
    type: CreateRedemptionDto,
  })
  public async create(
    @Res() res: Response,
    @Body() createRedemptionDto: CreateRedemptionDto,
  ) {
    const { nit, pointsToRedeem } = createRedemptionDto;
    const normalizedNit = nit.trim();
    const {
      data: customer,
      message: customer_message,
      errors: errors1,
      success: success1,
    } = await this.findCustomerUseCase.main(normalizedNit);

    if (customer === null && customer_message === 'Cliente no encontrado') {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ success1, customer, customer_message });
    }

    if (customer_message === 'Cliente encontrado exitosamente') {
      const { success, data, message, errors } =
        await this.createPointsRedemptionUseCase.main(
          customer.id,
          pointsToRedeem,
        );
      if (success) {
        return res.status(HttpStatus.CREATED).send({ success, data, message });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ success, message, errors });
      }
    }
  }
  @Get('transactions/:nit')
  @ApiOperation({
    summary: 'Consultar el historico de transacciones por cliente',
  })
  @ApiParam({
    name: 'nit',
    description: 'Nit del cliente',
    required: true,
  })
  public async transactionsHistory(
    @Res() res: Response,
    @Param('nit') nit: string,
  ) {
    const normalizedNit = nit.trim();
    const { data, message, errors, success } =
      await this.transactionsHistoryUseCase.main(normalizedNit);

    if (message === 'No se encontro información del cliente !') {
      return res.status(HttpStatus.NOT_FOUND).send({ success, data, message });
    }
    if (message === 'Datos encontrados !') {
      if (success) {
        return res.status(HttpStatus.OK).send({ success, data, message });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ success, message, errors });
      }
    }
  }
}
