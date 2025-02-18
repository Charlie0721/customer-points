import { Injectable } from '@nestjs/common';
import { CustomersService } from '../customers.service';
import { ApiResponse } from '../../commons/response-api.commons';

@Injectable()
export class CreateCustomerUseCase {
  public constructor(private readonly customersService: CustomersService) {}

  public async main(
    nit: string,
    name: string,
    points: number,
    expirationDays: number,
  ): Promise<ApiResponse<any>> {
    try {
      const { error, data } = await this.customersService.create(
        nit,
        name,
        points,
        expirationDays,
      );
      const expirationDate = this.calculateExpirationDate(expirationDays);
      await this.registerKardexEntry(
        data.savedCustomer.id,
        0,
        points,
        points,
        'acquisition',
        expirationDate,
      );
      return new ApiResponse(true, data, 'Cliente creado exitosamente');
    } catch (error) {
      return new ApiResponse(false, null, 'Error al crear cliente', [
        error.message,
      ]);
    }
  }
  private calculateExpirationDate(expirationDays: number): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + expirationDays);
    return currentDate;
  }
  private async registerKardexEntry(
    customerId: number,
    previousPoints: number,
    newPoints: number,
    points: number,
    transactionType: 'acquisition' | 'redemption',
    expirationDate: Date,
  ): Promise<void> {
    const difference = newPoints - previousPoints;

    const kardexEntry = {
      customer_id: customerId,
      previous_points: previousPoints,
      new_points: newPoints,
      difference: difference,
      reason: `Puntos ${transactionType}`,
      transaction_type: transactionType,
      expiration_date: expirationDate,
    };

    await this.customersService.createKardex(kardexEntry);
  }
}
