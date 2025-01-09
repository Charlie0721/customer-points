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
  ): Promise<ApiResponse<any>> {
    try {
      const {error, data} = await this.customersService.create(nit, name, points);
      return new ApiResponse(true, data, 'Cliente creado exitosamente');
    } catch (error) {
      return new ApiResponse(false, null, 'Error al crear cliente', [
        error.message,
      ]);
    }
  }
}
