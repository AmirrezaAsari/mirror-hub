import { PartialType } from '@nestjs/swagger';
import { CreateMirrorManagerDto } from './create-mirror-manager.dto';

export class UpdateMirrorManagerDto extends PartialType(CreateMirrorManagerDto) {}
