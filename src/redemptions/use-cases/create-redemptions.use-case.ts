import { Injectable } from '@nestjs/common';
import { RedemptionsService } from '../redemptions.service';
import { ApiResponse } from '../../commons/response-api.commons';
import { CustomersService } from '../../customers/customers.service';
import { CustomerPoints } from '../../customers/entities/customer-points.entity';

@Injectable()
export class CreatePointsRedemptionUseCase {
  public constructor(
    private readonly redemptionsService: RedemptionsService,
    private readonly customersService: CustomersService,
  ) {}

  public async main(
    customerId: number,
    pointsToRedeem: number,
  ): Promise<ApiResponse<any>> {
    try {
      const customerPoints = await this.searchCustomerPoints(customerId);

      const validPoints = customerPoints.filter((point) => {
        const expirationDate = new Date(point.expiration_date);
        const today = new Date();
        return expirationDate >= today;
      });

      const totalValidPoints = validPoints.reduce(
        (sum, point) => sum + point.points,
        0,
      );

      if (totalValidPoints < pointsToRedeem) {
        return new ApiResponse(
          false,
          null,
          `Puntos insuficientes. Disponibles: ${totalValidPoints}`,
        );
      }

      let remainingPointsToRedeem = pointsToRedeem;
      const sortedPoints = this.sortPointsByExpiration(validPoints);

      for (const point of sortedPoints) {
        if (remainingPointsToRedeem <= 0) break;

        const pointsAvailable = point.points;
        const pointsToDeduct = Math.min(
          remainingPointsToRedeem,
          pointsAvailable,
        );

       
        await this.customersService.updatePoints(
          point.id,
          pointsAvailable - pointsToDeduct,
          point.expiration_date, 
        );

        
        await this.registerKardexEntry(
          customerId,
          pointsAvailable,
          pointsAvailable - pointsToDeduct,
          pointsToDeduct,
          'redemption',
          point.expiration_date,
        );

        remainingPointsToRedeem -= pointsToDeduct;
      }

    
      const { data } = await this.redemptionsService.create(
        customerId,
        pointsToRedeem,
      );

      return new ApiResponse(true, data, 'Redención realizada exitosamente');
    } catch (error) {
      return new ApiResponse(false, null, 'Error al redimir puntos', [
        error.message,
      ]);
    }
  }

  private async searchCustomerPoints(
    customerId: number,
  ): Promise<CustomerPoints[]> {
    const { data } = await this.customersService.findPointsByCustomerId(
      customerId,
    );
    return Array.isArray(data) ? data : [data];
  }

  private sortPointsByExpiration(points: CustomerPoints[]): CustomerPoints[] {
    return points.sort(
      (a, b) =>
        new Date(a.expiration_date).getTime() -
        new Date(b.expiration_date).getTime(),
    );
  }

  private async registerKardexEntry(
    customerId: number,
    previousPoints: number,
    newPoints: number,
    pointsUsed: number,
    transactionType: 'acquisition' | 'redemption',
    expirationDate: Date,
  ): Promise<void> {
    const kardexEntry = {
      customer_id: customerId,
      previous_points: previousPoints,
      new_points: newPoints,
      difference: newPoints - previousPoints,
      reason: `Redención de ${pointsUsed} puntos`,
      transaction_type: transactionType,
      expiration_date: expirationDate,
    };

    await this.customersService.createKardex(kardexEntry);
  }
}
