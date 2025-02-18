import { Injectable } from '@nestjs/common';
import { ApiResponse } from '../../commons/response-api.commons';
import { CustomersService } from '../customers.service';
import { CustomerPoints } from '../entities/customer-points.entity';

@Injectable()
export class UpdatePointsUseCase {
  public constructor(private readonly customersService: CustomersService) {}
  public async main(
    customerId: number,
    points: number,
    expirationDays: number,
  ): Promise<ApiResponse<any>> {
    try {
      const customerPoints = await this.searchCustomerPoints(customerId);
      const totalPoints = this.addPoints(points, customerPoints.points);
      const expirationDate = this.calculateExpirationDate(expirationDays);
      await this.registerKardexEntry(
        customerId,
        customerPoints.points,
        totalPoints,
        points,
        'acquisition',
        expirationDate,
      );

      const { data, error } = await this.customersService.updatePoints(
        customerPoints.id,
        totalPoints,
        expirationDate,
      );
      return new ApiResponse(true, data, 'Puntos actualizados exitosamente !');
    } catch (error) {
      return new ApiResponse(
        false,
        null,
        'Error al actualizar los puntos del cliente !',
        [error.message],
      );
    }
  }

  private async searchCustomerPoints(
    customerId: number,
  ): Promise<CustomerPoints> {
    const { data, error } = await this.customersService.findPointsByCustomerId(
      customerId,
    );
    return data;
  }

  private addPoints(newPoints: number, currentPoints: number): number {
    return newPoints + currentPoints;
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
