import { IsString } from 'class-validator';

export class AssignRoleDto {
  @IsString()
  uid: string;

  @IsString()
  role: string;
}
