import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SettingDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Setting key',
    example: 'optioSyncEnabled',
  })
  key: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Setting value',
    example: 'true',
  })
  value: string;
}
