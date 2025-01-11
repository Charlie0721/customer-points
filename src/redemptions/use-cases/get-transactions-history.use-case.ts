import { Injectable } from '@nestjs/common';
import { ApiResponse } from '../../commons/response-api.commons';
import { RedemptionsService } from '../redemptions.service';
import { TResponseTransaction } from '../types/transactions.type';

@Injectable()
export class TransactionsHistoryUseCase {
  public constructor(private readonly redemptionsService: RedemptionsService) {}
  public async main(nit: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } =
        await this.redemptionsService.findTransactionsByCustomer(nit);

      if (data.transactions.length === 0) {
        return new ApiResponse(
          false,
          data,
          'No se encontro información del cliente !',
        );
      }
      const { responseTransaction } = this.parseData(data);
      return new ApiResponse(true, responseTransaction, 'Datos encontrados !');
    } catch (error) {
      return new ApiResponse(
        false,
        null,
        'Error al consultar la información de las transacciones !',
        [error.message],
      );
    }
  }
  private parseData(data: any): { responseTransaction: TResponseTransaction } {
    let responseTransaction: TResponseTransaction = {
      transactions: [],
      totalPointsReeedemed: 0,
    };

    for (const transaction of data.transactions) {
      responseTransaction.transactions.push(transaction);
      responseTransaction.totalPointsReeedemed += transaction.redemption_points;
    }

    return { responseTransaction };
  }
}
