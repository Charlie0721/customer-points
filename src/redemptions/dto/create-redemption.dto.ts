import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateRedemptionDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @ApiProperty({
    description: 'Número de identificación tributaria del cliente',
  })
  readonly nit: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'puntos por cambiar ' })
  @Min(0)
  readonly pointsToRedeem: number;
}
