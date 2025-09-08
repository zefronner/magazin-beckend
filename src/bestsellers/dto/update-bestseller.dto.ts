import { PartialType } from '@nestjs/mapped-types';
import { CreateBestsellerDto } from './create-bestseller.dto';

export class UpdateBestsellerDto extends PartialType(CreateBestsellerDto) {}
