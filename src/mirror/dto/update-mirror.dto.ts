import { PartialType } from '@nestjs/swagger';
import { CreateMirrorDto } from './create-mirror.dto';

export class UpdateMirrorDto extends PartialType(CreateMirrorDto) {}
