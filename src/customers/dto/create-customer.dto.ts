import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  @ApiProperty({
    description: 'Número de identificación tributaria del cliente',
  })
  readonly nit: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @ApiProperty({ description: 'Nombre del cliente' })
  readonly name: string;
  
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'puntos' })
  readonly points: number;
}
