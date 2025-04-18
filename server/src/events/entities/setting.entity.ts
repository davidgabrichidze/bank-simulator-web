import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the setting' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty({ 
    description: 'Setting key',
    example: 'optioSyncEnabled',
  })
  key: string;

  @Column({ type: 'text' })
  @ApiProperty({ 
    description: 'Setting value',
    example: 'true',
  })
  value: string;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'When the setting was last updated' })
  updatedAt: Date;
}
