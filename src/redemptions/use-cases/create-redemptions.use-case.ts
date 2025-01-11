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
      if (customerPoints.points <= 0) {
        return new ApiResponse(
          false,
          null,
          `No tiene puntos disponibles por redimir !`,
        );
      }

      if (customerPoints.points < pointsToRedeem) {
        return new ApiResponse(
          false,
          null,
          `No tiene suficientes puntos por redimir solamente puede cambiar ${customerPoints.points} puntos máximo !`,
        );
      }

      const pointsRedeemed = this.subtractPoints(
        customerPoints.points,
        pointsToRedeem,
      );

      const { data, error } = await this.redemptionsService.create(
        customerPoints.customer_id,
        pointsToRedeem,
      );
      await this.customersService.updatePoints(
        customerPoints.id,
        pointsRedeemed,
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
}
