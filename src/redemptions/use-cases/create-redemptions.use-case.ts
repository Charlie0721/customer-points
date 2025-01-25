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

      const pointsArray = Array.isArray(customerPoints)
        ? customerPoints
        : [customerPoints];
    
        const validPoints = pointsArray.filter((point) => {
          return (
            !point.expiration_date || new Date(point.expiration_date) >= new Date()
          );
        });
  
      
        const validPointsTotal = validPoints.reduce(
          (total, point) => total + point.points,
          0,
        );
  
      
        if (validPointsTotal < pointsToRedeem) {
          return new ApiResponse(
            false,
            null,
            `No tiene suficientes puntos válidos para redimir. Solo tiene ${validPointsTotal} puntos disponibles.`,
          );
        }
  
        let pointsRemaining = pointsToRedeem;
        let totalPointsRedeemed = 0; // Variable para llevar el conteo de los puntos redimidos
  
      
        for (const point of validPoints) {
          if (pointsRemaining <= 0) break;
  
          const pointsToRedeemNow = Math.min(pointsRemaining, point.points);
          pointsRemaining -= pointsToRedeemNow;
          totalPointsRedeemed += pointsToRedeemNow; // Acumular los puntos redimidos
  
        
          await this.customersService.updatePoints(
            point.id,
            point.points - pointsToRedeemNow,
          );
  
        
          await this.registerKardexEntry(
            customerId,
            point.points,
            point.points - pointsToRedeemNow,
            pointsToRedeemNow,
            'redemption',
            point.expiration_date,
          );
        }
  
      
        const { data, error } = await this.redemptionsService.create(
          customerId,
          totalPointsRedeemed, 
        );
      return new ApiResponse(true, data, 'Datos creados satisfactoriamente !');
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

  private subtractPoints(
    currentPoints: number,
    pointsToRedeem: number,
  ): number {
    return currentPoints - pointsToRedeem;
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
