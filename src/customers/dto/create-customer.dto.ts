import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Length, Max, Min } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @ApiProperty({
    description: 'Número de identificación tributaria del cliente',
  })
  readonly nit: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({ description: 'Nombre del cliente' })
  readonly name: string;
  
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'puntos' })
  readonly points: number;
  
  @IsInt()
  @IsPositive()
  @Min(1) 
  @Max(365)
  @ApiProperty({ description: 'Dias para expiración de puntos' })
  readonly expiration_days: number;
}
