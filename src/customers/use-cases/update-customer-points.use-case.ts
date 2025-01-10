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
  ): Promise<ApiResponse<any>> {
    try {
      const customerPoints = await this.searchCustomerPoints(customerId);
      const totalPoints = this.addPoints(points, customerPoints.points);
      const { data, error } = await this.customersService.updatePoints(
        customerPoints.id,
        totalPoints,
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
}
