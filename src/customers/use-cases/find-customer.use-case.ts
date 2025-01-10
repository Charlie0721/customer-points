import { Injectable } from '@nestjs/common';
import { CustomersService } from '../customers.service';
import { ApiResponse } from '../../commons/response-api.commons';

@Injectable()
export class FindCustomerUseCase {
  public constructor(private readonly customersService: CustomersService) {}
  public async main(nit: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await this.customersService.findOne(nit);
      if (!data) {
        return new ApiResponse(false, null, 'Cliente no encontrado');
      }
      return new ApiResponse(true, data, 'Cliente encontrado exitosamente');
    } catch (error) {
      return new ApiResponse(false, null, 'Error al buscar cliente', [
        error.message,
      ]);
    }
  }
}